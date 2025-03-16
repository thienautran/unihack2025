'use client'

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CardGamesView({ initialCardGames }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [games, setGames] = useState(initialCardGames.map(game => ({ ...game, favorite: false })));
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Listen for search term changes from SearchBar component
  useEffect(() => {
    // Initialize from localStorage if available
    const storedSearchTerm = localStorage.getItem('cardGameSearchTerm') || '';
    setSearchTerm(storedSearchTerm);

    // Listen for changes from the SearchBar component
    const handleSearchChange = (event) => {
      setSearchTerm(event.detail.searchTerm);
    };

    window.addEventListener('searchTermChanged', handleSearchChange);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('searchTermChanged', handleSearchChange);
    };
  }, []);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('cardGameFavorites');
    if (storedFavorites) {
      const favoriteIds = JSON.parse(storedFavorites);
      setGames(prevGames => 
        prevGames.map(game => ({ 
          ...game, 
          favorite: favoriteIds.includes(game.id)
        }))
      );
    }
  }, []);

  // Filter and sort games based on search term and favorites
  useEffect(() => {
    let filtered = games.filter(game => 
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort to put favorites at the top
    filtered = filtered.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });
    
    setFilteredGames(filtered);
  }, [searchTerm, games]);

  // Toggle favorite status
  const toggleFavorite = (e, id) => {
    // Prevent the card click from triggering
    e.stopPropagation();
    
    setGames(prevGames => {
      const updatedGames = prevGames.map(game => 
        game.id === id ? { ...game, favorite: !game.favorite } : game
      );
      
      // Store favorites in localStorage
      const favoriteIds = updatedGames
        .filter(game => game.favorite)
        .map(game => game.id);
      localStorage.setItem('cardGameFavorites', JSON.stringify(favoriteIds));
      
      return updatedGames;
    });
  };

  // Handle card click and redirect to scanCard with the game ID
  const handleCardClick = (id) => {
    router.push(`/scanCard?id=${id}`);
  };

  return (
    <div 
      className={`transition-transform duration-500 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Card Games List */}
      <div className="p-4 pb-24 overflow-y-auto max-h-[calc(100vh-132px)]">
        {filteredGames.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No card games found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredGames.map((game) => (
              <div 
                key={game.id} 
                className="bg-gray-900 rounded-xl p-4 transition-all duration-300 border border-gray-800 flex justify-between items-center shadow-md hover:shadow-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => handleCardClick(game.id)}
              >
                <h3 className="font-medium text-lg">{game.name}</h3>
                <button 
                  onClick={(e) => toggleFavorite(e, game.id)}
                  className="focus:outline-none"
                  aria-label={game.favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={`h-6 w-6 transform transition-all duration-300 ${
                      game.favorite ? 'fill-white text-white scale-110' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}