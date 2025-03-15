'use client';

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Menu from '@/components/ui/menu';
import CardOptions from '@/components/ui/cardOption';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Suspense } from 'react';
import { getImageDescription } from './actions';

// Main component that doesn't directly use useSearchParams
export default function ScanCardPage() {
  return (
    <Suspense fallback={<LoadingView />}>
      <AutoCamera />
    </Suspense>
  );
}

// Loading component to show while suspense is resolving
function LoadingView() {
  return (
    <div className='min-h-screen bg-black flex items-center justify-center'>
      <div className='text-white text-center'>
        <div className='w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-2'></div>
        <p>Loading camera...</p>
      </div>
    </div>
  );
}

// The component that uses useSearchParams (now wrapped in Suspense)
function AutoCamera() {
  const [cameraStatus, setCameraStatus] = useState('initializing');
  const [capturedImage, setCapturedImage] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [matchingCards, setMatchingCards] = useState([]);
  const [showMatches, setShowMatches] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImageId, setUploadedImageId] = useState(null);
  const [uploadedStorageId, setUploadedStorageId] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const searchParams = useSearchParams();
  const gameId = searchParams.get('id');

  // Only fetch the prompt if gameId exists
  const prompt = gameId
    ? useQuery(api.games.getGamePrompt, { gameId: gameId })
    : null;

  // Convex mutation hooks
  const generateUploadUrl = useMutation(api.image.generateUploadUrl);
  const storeImageMetadata = useMutation(api.image.storeImageMetadata);
  // Only call getImageUrl when we have a storageId
  const imageUrl = uploadedStorageId 
    ? useQuery(api.image.getImageUrl, { storageId: uploadedStorageId }) 
    : null;

  // Auto-start camera on page load
  useEffect(() => {
    initializeCamera();

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
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
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            .play()
            .then(() => {
              setCameraStatus('active');
            })
            .catch((err) => {
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

  const uploadCardImage = async (imageData) => {
    try {
      // Step 1: Generate an upload URL from Convex
      const uploadUrl = await generateUploadUrl();
      
      console.log('Generated upload URL:', uploadUrl);
      
      // Step 2: Convert dataURL to Blob for upload
      // Remove the data URL prefix to get just the base64 data
      const base64Data = imageData.split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(r => r.blob());
      
      // Step 3: Upload the image to the generated URL
      const result = await fetch(uploadUrl, {
        method: "POST", // Check if your Convex setup requires POST instead of PUT
        body: blob,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
      
      if (!result.ok) {
        console.error('Upload failed with status:', result.status, result.statusText);
        throw new Error(`Upload failed: ${result.statusText}`);
      }
      
      // Extract the storage ID from the upload URL
      // The format depends on your Convex setup
      let storageId;
      
      // Try to parse the storageId from the URL (common pattern)
      const urlParts = uploadUrl.split("/");
      storageId = urlParts[urlParts.length - 1];
      
      console.log('Extracted storageId:', storageId);
      
      // Return the storage ID for further processing
      return storageId;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const capturePhoto = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      cameraStatus !== 'active' ||
      isProcessing
    )
      return;

    // Show text on the screen
    setIsProcessing(true);
    setMessageText('Analyzing card...');

    // Get video dimensions
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);

    try {
      console.log("Starting card analysis...");
      
      // Call the API to recognize the card
      const data = await getImageDescription(imageData, prompt?.prompt);
      console.log("Recognition result:", data);
      
      // Always update UI with whatever data we got back
      if (data && data.matchingCards && data.matchingCards.length > 0) {
        setMatchingCards(data.matchingCards);
        setShowMatches(true);
      } else {
        // Handle case where no cards were returned
        setMatchingCards([{ 
          id: '1', 
          name: "No cards detected", 
          confidence: 0.5, 
          image: "/api/placeholder/60/90" 
        }]);
        setShowMatches(true);
      }
      
      // Clear any error message
      setMessageText('');
      
      // Attempt to upload the image (but don't block on it)
      // We do this as a separate step that can fail independently
      try {
        console.log("Uploading image to storage...");
        const storageId = await uploadCardImage(imageData);
        console.log("Upload successful, storageId:", storageId);
        
        if (storageId) {
          setUploadedStorageId(storageId);
          
          try {
            // Try to store the metadata
            const imageId = await storeImageMetadata({
              storageId: storageId,
              gameId: gameId || undefined,
              description: data.matchingCards && data.matchingCards.length > 0 
                ? data.matchingCards[0].name 
                : "Card scan",
              analysisResults: data
            });
            
            setUploadedImageId(imageId);
          } catch (metadataError) {
            console.error("Error storing metadata:", metadataError);
            // Continue anyway - the user can still see the results
          }
        }
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        // We don't show this error to the user - they can still use the card recognition
      }

      // Update state with the results
      setMatchingCards(data.matchingCards || []);
      setMessageText('');
      setShowMatches(true);
    } catch (error) {
      console.error('Error recognizing card:', error);
      
      if (error.message) {
        setMessageText(`Error: ${error.message.slice(0, 50)}${error.message.length > 50 ? '...' : ''}`);
      } else {
        setMessageText('Error analyzing card. Please try again.');
      }
      
      // Show error message for 3 seconds
      setTimeout(() => setMessageText(''), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setShowMatches(false);
    setMatchingCards([]);
    initializeCamera();
  };

  const processCard = async () => {
    // Get the most confident card (first in the array)
    const selectedCard = matchingCards.length > 0 ? matchingCards[0] : null;
    
    if (selectedCard && uploadedStorageId) {
      // Update the image metadata with the selected card name
      await storeImageMetadata({
        storageId: uploadedStorageId,
        gameId: gameId || undefined,
        description: selectedCard.name,
        confidence: selectedCard.confidence,
        // You could add more metadata here as needed
      });
      
      // Here you would normally handle what happens after a card is selected
      // For example, navigate to a detail page or add the card to the game
      alert(
        `Selected card: ${selectedCard.name} with confidence ${selectedCard.confidence.toFixed(2)}`
      );
    } else {
      alert('No card selected');
    }
  };

  const selectCard = async (card) => {
    if (uploadedStorageId) {
      // Update the image metadata with the manually selected card
      await storeImageMetadata({
        storageId: uploadedStorageId,
        gameId: gameId || undefined,
        description: card.name,
        confidence: card.confidence,
        selectedManually: true,
      });
    }
    
    alert(`You selected: ${card.name}`);
    // Here you would normally process the user's card selection
  };

  return (
    <div className='min-h-screen bg-black flex flex-col'>
      <Head>
        <title>Card Scanner</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
      </Head>

      {/* Hidden canvas for image capture */}
      <canvas
        ref={canvasRef}
        className='hidden'
      />

      <main className='flex-1 flex flex-col relative'>
        {/* Camera view */}
        {!capturedImage && (
          <div className='flex-1 relative'>
            {/* Add the Menu component at the top left */}
            <div className='absolute top-4 left-4 z-50'>
              <Menu />
            </div>

            {/* Video element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className='absolute inset-0 w-full h-full object-cover'
            />

            {/* Display text */}
            {messageText && (
              <div className='absolute top-20 inset-x-0 flex justify-center'>
                <div className='bg-black bg-opacity-70 text-white px-4 py-2 rounded'>
                  {messageText}
                </div>
              </div>
            )}

            {/* Camera loading states */}
            {cameraStatus !== 'active' && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white'>
                {cameraStatus === 'initializing' && (
                  <p>Initializing camera...</p>
                )}

                {cameraStatus === 'requesting' && (
                  <div className='text-center'>
                    <div className='w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-2'></div>
                    <p>Accessing camera...</p>
                  </div>
                )}

                {cameraStatus === 'error' && (
                  <div className='text-center p-4'>
                    <p className='text-red-500 text-xl mb-2'>Camera Error</p>
                    <p className='mb-4'>Unable to access your camera</p>
                    <button
                      onClick={initializeCamera}
                      className='px-4 py-2 bg-blue-500 rounded'
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Card capture guide - Modified to be vertical card shaped */}
            {cameraStatus === 'active' && (
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                <div className='border-2 border-white border-opacity-70 rounded aspect-[0.63/1] h-3/5 max-w-1/2'></div>
              </div>
            )}

            {/* Card matching results */}
            <CardOptions
              matchingCards={matchingCards}
              visible={showMatches}
              onSelectCard={selectCard}
            />

            {/* Capture button */}
            {cameraStatus === 'active' && (
              <div className='absolute bottom-8 inset-x-0 flex justify-center'>
                <button
                  aria-label='Take photo'
                  onClick={capturePhoto}
                  disabled={isProcessing}
                  className={`w-16 h-16 rounded-full ${isProcessing ? 'bg-gray-400' : 'bg-white'} flex items-center justify-center`}
                >
                  {isProcessing ? (
                    <div className='w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin'></div>
                  ) : (
                    <div className='w-14 h-14 rounded-full border-2 border-gray-800'></div>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Preview captured image */}
        {capturedImage && (
          <div className='flex-1 flex flex-col'>
            {/* Keep menu visible on preview screen too */}
            <div className='absolute top-4 left-4 z-50'>
              <Menu />
            </div>

            <div className='flex-1 relative'>
              <img
                src={capturedImage}
                alt='Captured card'
                className='absolute inset-0 w-full h-full object-contain bg-black'
              />

              {/* Show matching cards on the preview screen as well */}
              <CardOptions
                matchingCards={matchingCards}
                visible={showMatches}
                onSelectCard={selectCard}
              />
            </div>

            <div className='p-4 flex space-x-4'>
              <button
                onClick={retakePhoto}
                className='flex-1 py-3 bg-gray-700 text-white rounded-lg'
              >
                Retake
              </button>

              <button
                onClick={processCard}
                className='flex-1 py-3 bg-blue-500 text-white rounded-lg'
              >
                Use Top Match
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}