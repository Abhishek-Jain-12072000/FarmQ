import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);
  const messagesEndRef = useRef(null);

  // Connect to WebSocket on mount
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/voicechat");
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

    return () => ws.close();
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "user_text_partial") {
        // Update user's partial speech text in UI
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
        // Update bot's partial response in UI
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
        // Final bot response - replace partial message with final one
        const finalText = data.text;
        setMessages((prev) => {
          // Remove any partial bot messages
          const filtered = prev.filter(msg => !(msg.sender === "bot" && msg.partial));
          return [...filtered, { text: finalText, sender: "bot", partial: false }];
        });
        speak(finalText);
      }
    };
  }, [socket]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript && socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "asr_partial",
            text: interimTranscript,
          })
        );
      }

      if (finalTranscript && socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "asr_end",
            text: finalTranscript,
          })
        );
        
        // Replace partial user message with final one
        setMessages((prev) => {
          // Remove any partial user messages
          const filtered = prev.filter(msg => !(msg.sender === "user" && msg.partial));
          return [...filtered, { text: finalTranscript, sender: "user", partial: false }];
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [socket]);

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not ready.");
      return;
    }

    if (!isConnected) {
      alert("Not connected to server. Please try again later.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Speak text using speech synthesis
  const speak = (text) => {
    if (synthesisRef.current) {
      // Cancel any ongoing speech
      synthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      synthesisRef.current.speak(utterance);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>FarmQ Voice Assistant</h1>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </header>
      
      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome to FarmQ!</h2>
              <p>Ask me about:</p>
              <ul>
                <li>Crop recommendations based on soil and weather conditions</li>
                <li>Fertilizer recommendations for your crops</li>
                <li>Plant disease identification and treatment</li>
              </ul>
              <p>Try saying: "What crop should I plant if my soil has nitrogen level of 90, phosphorus level of 42, potassium level of 43, pH of 6.5, and rainfall of 200mm?"</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`message ${message.sender} ${message.partial ? 'partial' : ''}`}>
                <div className="message-avatar">
                  {message.sender === 'user' ? '👤' : '🌱'}
                </div>
                <div className="message-content">
                  {message.text}
                  {message.partial && message.sender === 'bot' && (
                    <span className="typing-indicator">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-form">
          <button
            type="button"
            className={`voice-button ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            disabled={!isConnected}
          >
            {isListening ? '🔴 Stop' : '🎤 Speak'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;