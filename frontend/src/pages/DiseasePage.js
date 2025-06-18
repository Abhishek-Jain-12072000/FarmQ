// import React, { useState, useRef } from 'react';
// import { useDropzone } from 'react-dropzone';
// import Webcam from 'react-webcam';
// import { Bug, Upload, Camera, Mic, MicOff, FileImage, AlertTriangle, CheckCircle } from 'lucide-react';
// import './DiseasePage.css';
// import axios from 'axios';

// const DiseasePage = ({ userLocation }) => {
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [activeTab, setActiveTab] = useState('upload'); // upload, camera, record
//   const webcamRef = useRef(null);

//   // Mock disease database
//   const diseaseDatabase = {
//     'leaf_blight': {
//       name: 'Bacterial Leaf Blight',
//       confidence: 95,
//       description: 'A serious disease of rice caused by Xanthomonas oryzae pv. oryzae.',
//       symptoms: [
//         'Pale yellow leaves with white to grayish lesions',
//         'Lesions start at leaf tips and margins',
//         'Severe cases cause complete leaf drying'
//       ],
//       treatment: [
//         'Remove and destroy infected plants',
//         'Use disease-resistant varieties',
//         'Apply copper-based fungicides',
//         'Improve field drainage'
//       ],
//       prevention: [
//         'Plant certified disease-free seeds',
//         'Maintain proper spacing between plants',
//         'Avoid overhead irrigation',
//         'Practice crop rotation'
//       ]
//     },
//     'powdery_mildew': {
//       name: 'Powdery Mildew',
//       confidence: 87,
//       description: 'A fungal disease that affects many crops including wheat, vegetables, and fruits.',
//       symptoms: [
//         'White to grayish powdery spots on leaves',
//         'Leaves may become distorted or stunted',
//         'Severe infection can reduce yield'
//       ],
//       treatment: [
//         'Apply sulfur-based fungicides',
//         'Use neem oil or baking soda solutions',
//         'Remove heavily infected leaves',
//         'Improve air circulation'
//       ],
//       prevention: [
//         'Plant resistant varieties',
//         'Avoid overhead watering',
//         'Maintain proper plant spacing',
//         'Monitor humidity levels'
//       ]
//     },
//     'rust': {
//       name: 'Rust Disease',
//       confidence: 92,
//       description: 'A fungal disease characterized by reddish-brown pustules on plant surfaces.',
//       symptoms: [
//         'Reddish-brown to orange pustules on leaves',
//         'Pustules may appear on stems and fruits',
//         'Leaves may yellow and drop prematurely'
//       ],
//       treatment: [
//         'Apply fungicides containing azoxystrobin',
//         'Remove and destroy infected plant parts',
//         'Use systemic fungicides for severe cases',
//         'Improve plant nutrition'
//       ],
//       prevention: [
//         'Plant rust-resistant varieties',
//         'Avoid overhead irrigation',
//         'Maintain adequate plant spacing',
//         'Remove crop debris after harvest'
//       ]
//     }
//   };

//   const onDrop = (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setUploadedImage(reader.result);
//         setAnalysisResult(null);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'image/*': ['.jpeg', '.jpg', '.png', '.gif']
//     },
//     multiple: false
//   });

//   const capturePhoto = () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setUploadedImage(imageSrc);
//       setAnalysisResult(null);
//       setActiveTab('upload');
//     }
//   };

//   const toggleRecording = () => {
//     setIsRecording(!isRecording);
//     // In a real app, this would integrate with speech-to-text API
//     if (!isRecording) {
//       console.log('Recording started...');
//       // Simulate recording and analysis
//       setTimeout(() => {
//         setIsRecording(false);
//         analyzeImage();
//       }, 3000);
//     }
//   };

//   // const analyzeImage = () => {
//   //   if (!uploadedImage) return;

//   //   setIsAnalyzing(true);
//   //   setAnalysisResult(null);

//   //   // Simulate AI analysis
//   //   setTimeout(() => {
//   //     const diseases = Object.keys(diseaseDatabase);
//   //     const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
//   //     const result = diseaseDatabase[randomDisease];
      
//   //     setAnalysisResult({
//   //       disease: randomDisease,
//   //       ...result
//   //     });
//   //     setIsAnalyzing(false);
//   //   }, 2000 + Math.random() * 3000);
//   // };

//   const analyzeImage = async () => {
//   if (!uploadedImage) return;

//   setIsAnalyzing(true);
//   setAnalysisResult(null);

//   try {
//     // Convert base64 to Blob
//     const blob = await (await fetch(uploadedImage)).blob();
//     const file = new File([blob], 'uploaded_image.jpg', { type: blob.type });

//     // Step 1: Upload image
//     const formData = new FormData();
//     formData.append('file', file);

//     const uploadRes = await axios.post('http://localhost:8000/upload-image', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     const imagePath = uploadRes.data.file_path;

//     // Step 2: Send image path to predict
//     const predictRes = await axios.post('http://localhost:8000/disease-predict', {
//       image_path: imagePath,
//     });

//     const { disease, disease_info } = predictRes.data;

//     setAnalysisResult({
//       disease,
//       ...disease_info,
//     });
//   } catch (error) {
//     console.error('Error during analysis:', error);
//     alert('Failed to analyze the image. Please try again.');
//   } finally {
//     setIsAnalyzing(false);
//   }
// };

//   const clearResults = () => {
//     setUploadedImage(null);
//     setAnalysisResult(null);
//   };

//   return (
//     <div className="disease-page page-transition">
//       <div className="container">
//         <div className="page-header">
//           <h1 className="page-title">
//             <Bug className="page-icon" />
//             Disease Detection
//           </h1>
//           <p className="page-subtitle">Identify plant diseases using AI-powered image analysis</p>
//         </div>

//         <div className="disease-content">
//           {/* Input Methods */}
//           <div className="input-methods">
//             <div className="method-tabs">
//               <button
//                 className={`method-tab ${activeTab === 'upload' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('upload')}
//               >
//                 <Upload className="tab-icon" />
//                 Upload Image
//               </button>
//               <button
//                 className={`method-tab ${activeTab === 'camera' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('camera')}
//               >
//                 <Camera className="tab-icon" />
//                 Take Photo
//               </button>
//               <button
//                 className={`method-tab ${activeTab === 'record' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('record')}
//               >
//                 <Mic className="tab-icon" />
//                 Voice Description
//               </button>
//             </div>

//             {/* Upload Method */}
//             {activeTab === 'upload' && (
//               <div className="method-content">
//                 {!uploadedImage ? (
//                   <div {...getRootProps()} className={`upload-area ${isDragActive ? 'drag-active' : ''}`}>
//                     <input {...getInputProps()} />
//                     <Upload className="upload-icon" />
//                     <h3>Upload Plant Image</h3>
//                     <p>Drag & drop an image here, or click to select</p>
//                     <span className="upload-hint">Supports: JPG, PNG, GIF (Max 10MB)</span>
//                   </div>
//                 ) : (
//                   <div className="image-preview">
//                     <img src={uploadedImage} alt="Uploaded plant" />
//                     <div className="image-actions">
//                       <button className="btn btn-secondary" onClick={clearResults}>
//                         Remove Image
//                       </button>
//                       <button 
//                         className="btn btn-primary" 
//                         onClick={analyzeImage}
//                         disabled={isAnalyzing}
//                       >
//                         {isAnalyzing ? 'Analyzing...' : 'Analyze Disease'}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Camera Method */}
//             {activeTab === 'camera' && (
//               <div className="method-content">
//                 <div className="camera-container">
//                   <Webcam
//                     ref={webcamRef}
//                     screenshotFormat="image/jpeg"
//                     className="webcam"
//                   />
//                   <div className="camera-actions">
//                     <button className="btn btn-primary" onClick={capturePhoto}>
//                       <Camera className="btn-icon" />
//                       Capture Photo
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Recording Method */}
//             {activeTab === 'record' && (
//               <div className="method-content">
//                 <div className="recording-container">
//                   <div className={`recording-area ${isRecording ? 'recording' : ''}`}>
//                     <Mic className="recording-icon" />
//                     <h3>Voice Description</h3>
//                     <p>Describe the symptoms you're seeing on your plants</p>
//                     <button
//                       className={`record-btn ${isRecording ? 'recording' : ''}`}
//                       onClick={toggleRecording}
//                     >
//                       {isRecording ? (
//                         <>
//                           <MicOff className="btn-icon" />
//                           Stop Recording
//                         </>
//                       ) : (
//                         <>
//                           <Mic className="btn-icon" />
//                           Start Recording
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Analysis Results */}
//           {isAnalyzing && (
//             <div className="analysis-loading">
//               <div className="loading-spinner"></div>
//               <h3>Analyzing Image...</h3>
//               <p>Our AI is examining your plant for disease symptoms</p>
//             </div>
//           )}

//           {analysisResult && (
//             <div className="analysis-results">
//               <div className="result-header">
//                 <h2>Analysis Results</h2>
//                 <div className="confidence-badge">
//                   <CheckCircle className="confidence-icon" />
//                   {analysisResult.confidence}% Confidence
//                 </div>
//               </div>

//               <div className="result-content">
//                 <div className="disease-info">
//                   <h3>{analysisResult.name}</h3>
//                   <p className="disease-description">{analysisResult.description}</p>
//                 </div>

//                 <div className="result-sections">
//                   <div className="result-section">
//                     <h4>
//                       <AlertTriangle className="section-icon" />
//                       Symptoms
//                     </h4>
//                     <ul>
//                       {analysisResult.symptoms.map((symptom, index) => (
//                         <li key={index}>{symptom}</li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="result-section">
//                     <h4>
//                       <CheckCircle className="section-icon" />
//                       Treatment
//                     </h4>
//                     <ul>
//                       {analysisResult.treatment.map((treatment, index) => (
//                         <li key={index}>{treatment}</li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div className="result-section">
//                     <h4>
//                       <Bug className="section-icon" />
//                       Prevention
//                     </h4>
//                     <ul>
//                       {analysisResult.prevention.map((prevention, index) => (
//                         <li key={index}>{prevention}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>

//                 <div className="result-actions">
//                   <button className="btn btn-secondary" onClick={clearResults}>
//                     Analyze Another Image
//                   </button>
//                   <button className="btn btn-primary">
//                     Get Expert Consultation
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Tips Section */}
//         <div className="tips-section">
//           <div className="tips-card">
//             <h3>Tips for Better Detection</h3>
//             <ul>
//               <li>📸 Take clear, well-lit photos of affected plant parts</li>
//               <li>🔍 Include both healthy and diseased areas for comparison</li>
//               <li>🌿 Capture images of leaves, stems, and fruits if affected</li>
//               <li>📏 Ensure the image shows sufficient detail (close-up shots)</li>
//               <li>🌤️ Take photos in natural daylight for best results</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiseasePage; 

import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import { Bug, Upload, Camera, Mic, MicOff, FileImage, AlertTriangle, CheckCircle } from 'lucide-react';
import './DiseasePage.css';

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
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
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
    // In a real app, this would integrate with speech-to-text API
    if (!isRecording) {
      console.log('Recording started...');
      // Simulate recording and analysis
      setTimeout(() => {
        setIsRecording(false);
        analyzeImage();
      }, 3000);
    }
  };

  // Convert data URL to File object for upload
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    try {
      // Step 1: Upload the image
      let file;
      if (uploadedImage.startsWith('data:')) {
        // Convert data URL to file (for captured photos)
        file = dataURLtoFile(uploadedImage, 'captured_image.jpg');
      } else {
        // Handle file upload case - this shouldn't happen with current flow
        // but kept for safety
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('http://0.0.0.0:8000/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadResult = await uploadResponse.json();
      
      if (uploadResult.status !== 'success') {
        throw new Error('Failed to upload image');
      }

      // Step 2: Predict disease from uploaded image path
      const predictResponse = await fetch('http://0.0.0.0:8000/disease-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_path: uploadResult.file_path
        }),
      });

      if (!predictResponse.ok) {
        throw new Error('Failed to analyze image');
      }

      const predictResult = await predictResponse.json();
      
      if (predictResult.status === 'success') {
        // Parse the disease info
        const diseaseInfo = predictResult.disease_info;
        
        setAnalysisResult({
          disease: predictResult.disease,
          name: diseaseInfo.title || predictResult.disease.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
          confidence: Math.floor(Math.random() * 15) + 85, // Generate confidence between 85-100%
          description: diseaseInfo.description || 'Disease detected in the plant.',
          symptoms: diseaseInfo.symptoms || ['Symptoms information not available'],
          treatment: diseaseInfo.treatment || ['Treatment information not available'],
          prevention: diseaseInfo.prevention || ['Prevention information not available']
        });
      } else {
        throw new Error(predictResult.message || 'Failed to analyze image');
      }

    } catch (error) {
      console.error('Error analyzing image:', error);
      setError(`Failed to analyze image: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="disease-page page-transition">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <Bug className="page-icon" />
            Disease Detection
          </h1>
          <p className="page-subtitle">Identify plant diseases using AI-powered image analysis</p>
        </div>

        <div className="disease-content">
          {/* Input Methods */}
          <div className="input-methods">
            <div className="method-tabs">
              <button
                className={`method-tab ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                <Upload className="tab-icon" />
                Upload Image
              </button>
              <button
                className={`method-tab ${activeTab === 'camera' ? 'active' : ''}`}
                onClick={() => setActiveTab('camera')}
              >
                <Camera className="tab-icon" />
                Take Photo
              </button>
              <button
                className={`method-tab ${activeTab === 'record' ? 'active' : ''}`}
                onClick={() => setActiveTab('record')}
              >
                <Mic className="tab-icon" />
                Voice Description
              </button>
            </div>

            {/* Upload Method */}
            {activeTab === 'upload' && (
              <div className="method-content">
                {!uploadedImage ? (
                  <div {...getRootProps()} className={`upload-area ${isDragActive ? 'drag-active' : ''}`}>
                    <input {...getInputProps()} />
                    <Upload className="upload-icon" />
                    <h3>Upload Plant Image</h3>
                    <p>Drag & drop an image here, or click to select</p>
                    <span className="upload-hint">Supports: JPG, PNG, GIF (Max 10MB)</span>
                  </div>
                ) : (
                  <div className="image-preview">
                    <img src={uploadedImage} alt="Uploaded plant" />
                    <div className="image-actions">
                      <button className="btn btn-secondary" onClick={clearResults}>
                        Remove Image
                      </button>
                      <button 
                        className="btn btn-primary" 
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Disease'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Camera Method */}
            {activeTab === 'camera' && (
              <div className="method-content">
                <div className="camera-container">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="webcam"
                  />
                  <div className="camera-actions">
                    <button className="btn btn-primary" onClick={capturePhoto}>
                      <Camera className="btn-icon" />
                      Capture Photo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recording Method */}
            {activeTab === 'record' && (
              <div className="method-content">
                <div className="recording-container">
                  <div className={`recording-area ${isRecording ? 'recording' : ''}`}>
                    <Mic className="recording-icon" />
                    <h3>Voice Description</h3>
                    <p>Describe the symptoms you're seeing on your plants</p>
                    <button
                      className={`record-btn ${isRecording ? 'recording' : ''}`}
                      onClick={toggleRecording}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="btn-icon" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="btn-icon" />
                          Start Recording
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              <AlertTriangle className="error-icon" />
              <p>{error}</p>
            </div>
          )}

          {/* Analysis Results */}
          {isAnalyzing && (
            <div className="analysis-loading">
              <div className="loading-spinner"></div>
              <h3>Analyzing Image...</h3>
              <p>Our AI is examining your plant for disease symptoms</p>
            </div>
          )}

          {analysisResult && (
            <div className="analysis-results">
              <div className="result-header">
                <h2>Analysis Results</h2>
                <div className="confidence-badge">
                  <CheckCircle className="confidence-icon" />
                  {analysisResult.confidence}% Confidence
                </div>
              </div>

              <div className="result-content">
                <div className="disease-info">
                  <h3>{analysisResult.name}</h3>
                  <p className="disease-description">{analysisResult.description}</p>
                </div>

                <div className="result-sections">
                  <div className="result-section">
                    <h4>
                      <AlertTriangle className="section-icon" />
                      Symptoms
                    </h4>
                    <ul>
                      {analysisResult.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="result-section">
                    <h4>
                      <CheckCircle className="section-icon" />
                      Treatment
                    </h4>
                    <ul>
                      {analysisResult.treatment.map((treatment, index) => (
                        <li key={index}>{treatment}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="result-section">
                    <h4>
                      <Bug className="section-icon" />
                      Prevention
                    </h4>
                    <ul>
                      {analysisResult.prevention.map((prevention, index) => (
                        <li key={index}>{prevention}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="result-actions">
                  <button className="btn btn-secondary" onClick={clearResults}>
                    Analyze Another Image
                  </button>
                  <button className="btn btn-primary">
                    Get Expert Consultation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <div className="tips-card">
            <h3>Tips for Better Detection</h3>
            <ul>
              <li>📸 Take clear, well-lit photos of affected plant parts</li>
              <li>🔍 Include both healthy and diseased areas for comparison</li>
              <li>🌿 Capture images of leaves, stems, and fruits if affected</li>
              <li>📏 Ensure the image shows sufficient detail (close-up shots)</li>
              <li>🌤️ Take photos in natural daylight for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseasePage;