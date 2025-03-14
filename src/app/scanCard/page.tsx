'use client'

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Menu from '@/components/ui/menu'

export default function AutoCamera() {
  const [cameraStatus, setCameraStatus] = useState('initializing');
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Auto-start camera on page load
  useEffect(() => {
    initializeCamera();
    
    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    setCameraStatus('requesting');
    
    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('error');
      return;
    }
    
    try {
      // Try to access the camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera for scanning cards
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              setCameraStatus('active');
            })
            .catch(err => {
              console.error('Error playing video:', err);
              setCameraStatus('error');
            });
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraStatus('error');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || cameraStatus !== 'active') return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    
    // Stop camera after capturing
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    initializeCamera();
  };

  const processCard = () => {
    // This is where you would add card processing logic
    alert('Processing card...');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>Card Scanner</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      <main className="flex-1 flex flex-col relative">
        {/* Camera view */}
        {!capturedImage && (
          <div className="flex-1 relative">
            {/* Add the Menu component at the top left */}
            <div className="absolute top-4 left-4 z-50">
              <Menu />
            </div>
            
            {/* Video element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Camera loading states */}
            {cameraStatus !== 'active' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white">
                {cameraStatus === 'initializing' && (
                  <p>Initializing camera...</p>
                )}
                
                {cameraStatus === 'requesting' && (
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p>Accessing camera...</p>
                  </div>
                )}
                
                {cameraStatus === 'error' && (
                  <div className="text-center p-4">
                    <p className="text-red-500 text-xl mb-2">Camera Error</p>
                    <p className="mb-4">Unable to access your camera</p>
                    <button 
                      onClick={initializeCamera}
                      className="px-4 py-2 bg-blue-500 rounded"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Card capture guide */}
            {cameraStatus === 'active' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-white border-opacity-70 rounded w-4/5 h-2/5"></div>
              </div>
            )}
            
            {/* Capture button */}
            {cameraStatus === 'active' && (
              <div className="absolute bottom-8 inset-x-0 flex justify-center">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-gray-800"></div>
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Preview captured image */}
        {capturedImage && (
          <div className="flex-1 flex flex-col">
            {/* Keep menu visible on preview screen too */}
            <div className="absolute top-4 left-4 z-50">
              <Menu />
            </div>
            
            <div className="flex-1 relative">
              <img 
                src={capturedImage} 
                alt="Captured card" 
                className="absolute inset-0 w-full h-full object-contain bg-black" 
              />
            </div>
            
            <div className="p-4 flex space-x-4">
              <button
                onClick={retakePhoto}
                className="flex-1 py-3 bg-gray-700 text-white rounded-lg"
              >
                Retake
              </button>
              
              <button
                onClick={processCard}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg"
              >
                Use Photo
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}