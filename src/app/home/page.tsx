'use client'

import { useState, useEffect } from 'react';
import CardGamesView from '@/components/ui/cardGamesView';
import SearchBar from '@/components/ui/searchBar';
//import SideMenu from '@/components/ui/sideMenu';
import Header from '@/components/ui/header';
import { api } from '../../../convex/_generated/api';
import { useQuery } from 'convex/react';

export default function HomePage() {
  // Fetch games from Convex
  const games = useQuery(api.games.getGamesList);
  
  // Fallback data in case the query is loading or failed
  const fallbackGames = [
    { id: 1, name: 'Magic: The Gathering' },
    { id: 2, name: 'Pokémon TCG' },
    { id: 3, name: 'Yu-Gi-Oh!' },
    // ... other games
  ];

  // Transform Convex data to match the format expected by CardGamesView
  const transformedGames = games?.map(game => ({
    id: game._id,
    name: game.name,
    // Add other properties as needed
  })) || fallbackGames;

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="min-h-screen">
        <div className="sticky top-0 z-50 bg-black border-b border-gray-800 px-4 py-2">
          <div className="flex justify-center items-center">
            <img
              src='/logoEcho.png'
              alt='Echo Deck Logo'
              className='h-8 w-auto object-contain brightness-0 invert'
            />
          </div>
        </div>
        
        <div className="px-4 py-2">
          <SearchBar />
        </div>
        
        {games === undefined ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p>Loading games...</p>
            </div>
          </div>
        ) : (
          <CardGamesView initialCardGames={transformedGames} />
        )}
      </div>
    </div>
  );
}