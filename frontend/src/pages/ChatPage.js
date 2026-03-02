import React, { useState, useEffect, useRef } from "react";
import "./ChatPage.css";
import config from "../config";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);
  const messagesEndRef = useRef(null);
  const [language, setLanguage] = useState("English");
  const audioRef = useRef(null);

  const languages = [
    "English", "Hindi", "Marathi", "Telugu", "Tamil", "Kannada", "Punjabi", "Bengali"
  ];

  const suggestedQuestions = [
    "What crop should I plant now?",
    "How to treat tomato leaf mold?",
    "Organic fertilizer for rice"
  ];

  // Connect to WebSocket on mount
  useEffect(() => {
    // Determine WS URL based on current host (useful for deployment)
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const apiHost = config.API_BASE_URL ? config.API_BASE_URL.replace(/^http(s?):\/\//, '') : window.location.host;
    const wsUrl = `${protocol}//${apiHost}/ws/voicechat`;

    console.log(`Connecting to WebSocket at: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsConnected(false);
    };

    // Cleanup: cancel speech and close socket
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      ws.close();
    };
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "user_text_partial") {
        const text = data.text.trim();
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.sender === "user" && last.partial) {
            return [...prev.slice(0, -1), { text, sender: "user", partial: true }];
          } else {
            return [...prev, { text, sender: "user", partial: true }];
          }
        });
      }

      if (data.type === "agent_text_partial") {
        const text = data.text;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.sender === "bot" && last.partial) {
            return [...prev.slice(0, -1), { text: last.text + text, sender: "bot", partial: true }];
          } else {
            return [...prev, { text, sender: "bot", partial: true }];
          }
        });
      }

      if (data.type === "agent_text_final") {
        const finalText = data.text;
        setMessages((prev) => {
          // Remove any partial bot messages and add final
          const filtered = prev.filter(msg => !(msg.sender === "bot" && msg.partial));
          return [...filtered, { text: finalText, sender: "bot", partial: false }];
        });
        speak(finalText);
      }
    };
  }, [socket, language]);

  // Cleanup speech on unmount or reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    const languageMap = {
      English: "en-US",
      Hindi: "hi-IN",
      Marathi: "mr-IN",
      Telugu: "te-IN",
      Tamil: "ta-IN",
      Kannada: "kn-IN",
      Punjabi: "pa-IN",
      Bengali: "bn-IN"
    };

    recognition.lang = languageMap[language] || "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = async (event) => {
      let transcript = "";
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          isFinal = true;
        }
      }

      transcript = transcript.trim();
      if (!transcript) return;

      setMessages((prev) => {
        const last = prev[prev.length - 1];

        // If last message is user and still partial → update it
        if (last && last.sender === "user" && last.partial) {
          return [
            ...prev.slice(0, -1),
            { text: transcript, sender: "user", partial: !isFinal }
          ];
        }

        // Otherwise add new
        return [...prev, { text: transcript, sender: "user", partial: !isFinal }];
      });

      // When speech completes
      if (isFinal) {
        await handleVoiceAnswer(transcript);
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err.error);
      setIsListening(false);
    };
    recognitionRef.current = recognition;
  }, [socket]);

  const languageRef = useRef(language);

  useEffect(() => {
    const languageMap = {
      English: "en-US",
      Hindi: "hi-IN",
      Marathi: "mr-IN",
      Telugu: "te-IN",
      Tamil: "ta-IN",
      Kannada: "kn-IN",
      Punjabi: "pa-IN",
      Bengali: "bn-IN"
    };

    if (recognitionRef.current) {
      recognitionRef.current.stop(); // stop ongoing recognition
      recognitionRef.current.lang = languageMap[language] || "en-US";
      console.log("Recognition language set to:", recognitionRef.current.lang);
    }
    languageRef.current = language;
  }, [language]);

  // Function to send text to backend and play returned audio
  const handleVoiceAnswer = async (userText) => {
    try {
      setIsSending(true);
      setMessages((prev) => [...prev, { text: "...AI is thinking...", sender: "bot", partial: true }]);
      const baseUrl = config.API_BASE_URL;
      const resp = await fetch(`${baseUrl}/api/voicechat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText, language: languageRef.current })
      });
      if (!resp.ok) throw new Error("Voicechat API error");
      const data = await resp.json();

      const answerText = data.text;
      const audioBase64 = data.audio;

      // Show real AI text
      setMessages((prev) => {
        const filtered = prev.filter(msg => !(msg.sender === "bot" && msg.partial));
        return [...filtered, { text: answerText, sender: "bot", partial: false }];
      });

      // Convert base64 to playable audio
      const audioUrl = `data:audio/mp3;base64,${audioBase64}`;

      if (audioRef.current) {
        window.speechSynthesis.cancel();
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }

      setMessages((prev) => {
        const filtered = prev.filter(msg => !(msg.sender === "bot" && msg.partial));
        return [...filtered, { text: "(AI answer in audio)", sender: "bot", partial: false }];
      });
    } catch (err) {
      setMessages((prev) => [...prev, { text: "Voice answer error.", sender: "bot", partial: false }]);
    } finally {
      setIsSending(false);
    }
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported.");
      return;
    }

    if (!isConnected) {
      alert("Connecting to server...");
      return;
    }

    // 🛑 STOP ANY PLAYING AUDIO FIRST
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // 🎙 Start / Stop mic
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speak = (text) => {
    if (!window.speechSynthesis || !text) return;

    // Stop ANY current speech immediately
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Small delay prevents glitchy restart behavior
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const sendTextMessage = async (evt, manualInput = null) => {
    if (evt) evt.preventDefault();
    const prompt = (manualInput || input).trim();
    if (!prompt) return;

    setIsSending(true);
    setMessages((prev) => [...prev, { text: prompt, sender: "user", partial: false }]);
    setInput("");

    try {
      const baseUrl = config.API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/bedrock-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `[Language: ${language}] ${prompt}` }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      // Add initial empty bot message for streaming
      setMessages((prev) => [...prev, { text: "", sender: "bot", partial: true }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.sender === "bot" && last.partial) {
            return [...prev.slice(0, -1), { text: fullText, sender: "bot", partial: true }];
          }
          return prev;
        });
      }

      // Mark final
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.sender === "bot" && last.partial) {
          return [...prev.slice(0, -1), { text: fullText, sender: "bot", partial: false }];
        }
        return prev;
      });

      speak(fullText);

    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { text: "Connection error. Please check your internet.", sender: "bot", partial: false }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-page-root">
      <div className="chat-card">
        <header className="chat-header">
          <h1><span>🌱</span> FarmQ AI Assistant</h1>
          <div className="header-actions">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-pill"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className="status-indicator">
              <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
              {isConnected ? 'Live' : 'Offline'}
            </div>
          </div>
        </header>

        <div className="messages-area">
          {messages.length === 0 ? (
            <div className="welcome-hero">
              <h2>Namaste! <span>🙏</span></h2>
              <p>I am your FarmQ agricultural expert. How can I help your farm thrive today?</p>
              <div className="suggested-chips">
                {suggestedQuestions.map((q, i) => (
                  <div key={i} className="suggested-chip" onClick={() => sendTextMessage(null, q)}>
                    {q}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.sender}`}>
                <div className="avatar-circle">
                  {msg.sender === 'user' ? '👤' : '🌱'}
                </div>
                <div className="message-bubble">
                  {msg.text}
                  {msg.partial && msg.sender === 'bot' && (
                    <div className="typing-dots">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <audio ref={audioRef} style={{ display: "none" }} />

        <div className="input-area">
          <form className="input-container" onSubmit={sendTextMessage}>
            <button
              type="button"
              className={`icon-btn voice-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              title="Voice Input"
            >
              {isListening ? '⏹️' : '🎤'}
            </button>
            <input
              type="text"
              className="chat-input"
              placeholder="Tell me about your crops or ask for advice..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
            />
            <button
              type="submit"
              className="icon-btn send-btn"
              disabled={isSending || !input.trim()}
              title="Send Message"
            >
              {isSending ? '⏳' : '➡️'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;