'use client'

import React from 'react';

/**
 * Component to display card matching options
 * 
 * @param {Object} props
 * @param {Array} props.matchingCards - Array of card objects with id, name, confidence, and image
 * @param {Function} props.onSelectCard - Callback function when a card is selected
 * @param {boolean} props.visible - Whether the component should be visible
 */
const CardOptions = ({ matchingCards = [], onSelectCard, visible = false }) => {
  if (!visible || matchingCards.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-32 inset-x-0">
      <div className="flex justify-center space-x-2 px-4 overflow-x-auto">
        {matchingCards.map((card) => (
          <div 
            key={card.id} 
            className="flex flex-col items-center"
            onClick={() => onSelectCard(card)}
          >
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <img 
                src={card.image} 
                alt={card.name}
                className="w-16 h-20 object-cover rounded"
              />
            </div>
            <div className="text-white text-xs bg-black bg-opacity-70 px-2 py-1 mt-1 rounded text-center max-w-16">
              {card.name}
              {card.confidence && (
                <div className="text-xs opacity-70">
                  {(card.confidence * 100).toFixed(0)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardOptions;