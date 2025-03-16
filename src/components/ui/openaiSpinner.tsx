import React from 'react';

const OpenAILoadingSpinner = ({ message = 'OpenAI is thinking...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg p-6 max-w-md w-full shadow-xl flex flex-col items-center border border-white">
        {/* Spinner animation */}
        <div className="relative w-16 h-16 mb-4">
          {/* Main spinner - white ring */}
          <div className="absolute inset-0 border-4 border-t-white border-r-gray-400 border-b-gray-600 border-l-transparent rounded-full animate-spin"></div>
          
          {/* Inner spinning dot */}
          <div className="absolute inset-2 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Message text */}
        <p className="text-white font-medium text-center">{message}</p>
        
        {/* Animated dots for "thinking" effect */}
        <div className="flex space-x-1 mt-2">
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
};

export default OpenAILoadingSpinner;