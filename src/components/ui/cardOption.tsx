'use client'

import { useState, useEffect } from 'react';

export default function CardOptions({ matchingCards, visible, onSelectCard }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  if (!isVisible || !matchingCards || matchingCards.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-28 inset-x-0 flex justify-center">
      <div className="bg-black bg-opacity-80 rounded-lg p-3 w-full max-w-md">
        <h3 className="text-white text-center font-medium mb-3">Possible Matches</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {matchingCards.map((card) => (
            <button
              key={card.id}
              className="flex flex-col items-center bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => onSelectCard(card)}
            >
              <div className="flex items-center mb-2">
                {/* <img 
                  src={card.image} 
                  alt={card.name} 
                  className="w-10 h-16 object-contain mr-2" 
                /> */}
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{card.name}</p>
                  <div className="mt-1 bg-gray-700 h-2 w-24 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${card.confidence * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {Math.round(card.confidence * 100)}% confidence
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}