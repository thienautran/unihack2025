'use client'

import { useState, useEffect } from 'react';
import CardGamesView from '@/components/ui/cardGamesView';
import SearchBar from '@/components/ui/searchBar';
import SideMenu from '@/components/ui/sideMenu';
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
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Use client components for interactive parts */}
      <SideMenu />
      <div className="min-h-screen">
        <Header />
        <SearchBar />
        {games === undefined ? (
          <div className="flex justify-center items-center p-8">
            <p>Loading games...</p>
          </div>
        ) : (
          <CardGamesView initialCardGames={transformedGames} />
        )}
      </div>
    </div>
  );
}