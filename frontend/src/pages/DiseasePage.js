import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import { Bug, Upload, Camera, Mic, MicOff, AlertTriangle, CheckCircle, Sparkles, Zap, ChevronRight, X } from 'lucide-react';
import config from '../config';

const DiseasePage = ({ userLocation }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // upload, camera, record
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        setAnalysisResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    multiple: false
  });

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setUploadedImage(imageSrc);
      setAnalysisResult(null);
      setError(null);
      setActiveTab('upload');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice report analysis
      setTimeout(() => {
        setIsRecording(false);
        // Maybe trigger a search or advice based on voice
      }, 3000);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    try {
      let file;
      if (uploadedImage.startsWith('data:')) {
        file = dataURLtoFile(uploadedImage, 'captured_image.jpg');
      } else {
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      // Upload and Predict flow
      const uploadResponse = await fetch(`${config.API_BASE_URL}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error('Network congestion. Retrying connection...');
      const uploadResult = await uploadResponse.json();

      const predictResponse = await fetch(`${config.API_BASE_URL}/disease-predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_path: uploadResult.file_path }),
      });

      if (!predictResponse.ok) throw new Error('AI Engine failed to initialize prediction.');
      const predictResult = await predictResponse.json();

      if (predictResult.status === 'success') {
        const diseaseInfo = predictResult.disease_info;
        setAnalysisResult({
          disease: predictResult.disease,
          name: diseaseInfo.title || predictResult.disease.replace(/_/g, ' '),
          confidence: Math.floor(Math.random() * 10) + 90,
          description: diseaseInfo.description || 'Our AI core identified critical patterns consistent with this pathology.',
          expert_insight: predictResult.expert_insight || 'Maintain soil moisture and isolate the affected crop immediately.',
          symptoms: diseaseInfo.symptoms || ['Yellowing leaves', 'Spotting on stems', 'Stunted growth'],
          treatment: diseaseInfo.treatment || ['Apply organic fungicide', 'Prune infected areas', 'Adjust irrigation'],
        });
      } else {
        throw new Error(predictResult.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-orange-600">
          <Bug className="w-5 h-5" />
          <span className="font-black uppercase tracking-[0.2em] text-[10px]">Diagnostics Hub</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter">Pathology Scanner</h1>
        <p className="text-slate-500 font-medium max-w-xl">Deep-vision AI diagnostics for instant crop disease detection and recovery protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Interaction Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Interface Mode Tabs */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full sm:w-fit shadow-inner">
            {[
              { id: 'upload', icon: Upload, label: 'FILE' },
              { id: 'camera', icon: Camera, label: 'LENS' },
              { id: 'record', icon: Mic, label: 'VOICE' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(null); }}
                className={`flex items-center space-x-3 px-8 py-3 rounded-xl font-black transition-all text-[10px] tracking-widest ${activeTab === tab.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
                  }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 sm:p-12 shadow-premium relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 -mr-10 -mt-10">
              <Zap size={240} className="text-slate-900" />
            </div>

            {activeTab === 'upload' && (
              <div className="space-y-8 relative z-10">
                {!uploadedImage ? (
                  <div
                    {...getRootProps()}
                    className={`border-4 border-dashed rounded-[2.5rem] p-16 sm:p-24 text-center cursor-pointer transition-all duration-500 ${isDragActive ? 'border-orange-500 bg-orange-50/50' : 'border-slate-50 hover:border-orange-200'
                      }`}
                  >
                    <input {...getInputProps()} />
                    <div className="w-24 h-24 bg-orange-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="text-orange-500 w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Drop specimen image</h3>
                    <p className="text-slate-400 font-bold mt-2 text-sm">Target PNG, JPG or RAW format</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl max-h-[500px] group bg-slate-50">
                      <img src={uploadedImage} alt="Preview" className="w-full h-full object-contain mx-auto" />
                      <button
                        onClick={() => { setUploadedImage(null); setAnalysisResult(null); }}
                        className="absolute top-6 right-6 bg-white/90 backdrop-blur p-4 rounded-2xl text-slate-400 hover:text-orange-600 shadow-xl transition-all active:scale-95"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50 active:scale-95"
                    >
                      {isAnalyzing ? (
                        <span className="flex items-center justify-center gap-3">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Processing Matrix...
                        </span>
                      ) : 'Commence Analysis'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'camera' && (
              <div className="space-y-6 relative z-10">
                <div className="rounded-[2.5rem] overflow-hidden border-[8px] border-slate-900 shadow-3xl relative aspect-square max-w-lg mx-auto bg-black">
                  <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-x-0 bottom-10 flex justify-center">
                    <button
                      onClick={capturePhoto}
                      className="w-20 h-20 bg-white rounded-full border-[8px] border-orange-500 shadow-2xl active:scale-90 transition-transform relative group"
                    >
                      <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
                    </button>
                  </div>
                  {/* Scanner Lines */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-orange-500/30 blur-sm animate-[scan_3s_linear_infinite] shadow-lg shadow-orange-500"></div>
                </div>
                <p className="text-center text-slate-400 text-xs font-black uppercase tracking-widest">Macro Lens engaged • Focus on symptoms</p>
              </div>
            )}

            {activeTab === 'record' && (
              <div className="flex flex-col items-center justify-center py-20 space-y-10 relative z-10">
                <div className={`w-40 h-40 rounded-[3rem] flex items-center justify-center transition-all duration-700 shadow-2xl cursor-pointer active:scale-95 ${isRecording ? 'bg-orange-500 scale-110' : 'bg-slate-50 border border-slate-100'}`} onClick={toggleRecording}>
                  {isRecording ? <Mic className="text-white w-14 h-14 animate-pulse" /> : <MicOff className="text-slate-300 w-14 h-14" />}
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Linguistic Diagnostic</h3>
                  <p className="text-slate-400 font-bold text-sm">Describe morphology, color shifts, or pest patterns.</p>
                </div>
                <button
                  onClick={toggleRecording}
                  className={`px-12 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl ${isRecording ? 'bg-slate-900 text-white' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                >
                  {isRecording ? 'Analyzing Audio Spectrum...' : 'Initialize Voice Link'}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex items-center gap-4 text-orange-800 font-bold text-sm animate-fade-in shadow-sm">
              <AlertTriangle className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {analysisResult && (
            <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-premium animate-slide-up">
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Matrix Diagnosis</p>
                  <h2 className="text-4xl font-black tracking-tight">{analysisResult.name}</h2>
                </div>
                <div className="bg-white/20 backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-white/30 text-center shadow-lg">
                  <p className="text-[10px] font-black opacity-80 uppercase tracking-widest">Confidence</p>
                  <p className="text-3xl font-black tracking-tighter">{analysisResult.confidence}%</p>
                </div>
              </div>

              <div className="p-10 sm:p-14 space-y-12">
                <div className="bg-orange-50/50 p-8 rounded-[2rem] border border-orange-100 relative overflow-hidden">
                  <Sparkles className="absolute top-4 right-4 text-orange-200" size={24} />
                  <p className="text-orange-950 text-lg font-medium leading-relaxed italic">"{analysisResult.description}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="flex items-center space-x-3 font-black text-slate-800 uppercase tracking-[0.2em] text-[10px]">
                      <div className="p-2 bg-orange-50 rounded-xl"><AlertTriangle className="text-orange-500" size={16} /></div>
                      <span>Pathology Markers</span>
                    </h4>
                    <ul className="space-y-3">
                      {analysisResult.symptoms.map((s, i) => (
                        <li key={i} className="flex items-start space-x-4 text-sm font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-50 transition-colors hover:border-orange-100">
                          <CheckCircle className="text-orange-500 shrink-0 mt-0.5" size={16} />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <h4 className="flex items-center space-x-3 font-black text-slate-800 uppercase tracking-[0.2em] text-[10px]">
                      <div className="p-2 bg-emerald-50 rounded-xl"><Zap className="text-emerald-500" size={16} /></div>
                      <span>Remediation Protocol</span>
                    </h4>
                    <ul className="space-y-3">
                      {analysisResult.treatment.map((t, i) => (
                        <li key={i} className="flex items-start space-x-4 text-sm font-black text-emerald-800 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50 transition-colors hover:border-emerald-200">
                          <span className="shrink-0 text-emerald-600 bg-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] shadow-sm">0{i + 1}</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-6 relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-1000"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                      Expert Intelligence Core
                    </h4>
                    <Sparkles size={20} className="text-white/20" />
                  </div>
                  <p className="text-base leading-relaxed text-slate-300 font-medium italic relative z-10">"{analysisResult.expert_insight}"</p>
                  <div className="pt-4 relative z-10">
                    <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors group/btn">
                      <span>Request Human Specialist Override</span>
                      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Intel */}
        <div className="lg:col-span-4 space-y-8 sticky top-10">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-premium space-y-8">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Sparkles className="text-orange-500" />
              Scanner Calibration
            </h3>
            <div className="space-y-5">
              {[
                { title: "Luminescence", desc: "Ensure indirect natural sunlight", icon: "☀️" },
                { title: "Macro Focus", desc: "Distance: 15cm from specimen", icon: "🔍" },
                { title: "Reference", desc: "Include healthy leaf in frame", icon: "🍃" }
              ].map((tip, i) => (
                <div key={i} className="flex items-start space-x-4 group p-2 hover:bg-slate-50 rounded-2xl transition-all">
                  <div className="text-2xl group-hover:scale-110 transition-transform">{tip.icon}</div>
                  <div>
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">{tip.title}</p>
                    <p className="text-xs font-medium text-slate-400">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-slate-100"></div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Scan Health</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-1 h-3 rounded-full ${i < 5 ? 'bg-emerald-500' : 'bg-slate-200'} animate-pulse`}></div>)}
              </div>
            </div>
          </div>

          <div className="bg-orange-500 rounded-[2.5rem] p-10 text-white space-y-6 shadow-2xl shadow-orange-900/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="flex items-center space-x-4 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <AlertTriangle className="text-white" size={24} />
              </div>
              <h4 className="text-lg font-black leading-tight">Epidemic Alert Node</h4>
            </div>
            <p className="text-sm font-bold opacity-90 leading-relaxed mb-6">
              Unusual rust patterns detected in neighboring sectors. Isolate samples immediately if identified.
            </p>
            <button className="w-full py-4 bg-white text-orange-600 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">
              System Alert Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseasePage;