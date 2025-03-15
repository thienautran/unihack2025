'use client'

import { useState, useEffect } from 'react';
import { Search, Heart, Menu } from 'lucide-react';

// Sample card game data with unique IDs
const cardGames = [
  { id: 1, name: 'Magic: The Gathering' },
  { id: 2, name: 'Pokémon TCG' },
  { id: 3, name: 'Yu-Gi-Oh!' },
  { id: 4, name: 'Hearthstone' },
  { id: 5, name: 'Legends of Runeterra' },
  { id: 6, name: 'Gwent' },
  { id: 7, name: 'Flesh and Blood' },
  { id: 8, name: 'KeyForge' },
  { id: 9, name: 'Digimon TCG' },
  { id: 10, name: 'Marvel Champions' },
  { id: 11, name: 'Star Wars: Unlimited' },
  { id: 12, name: 'Lorcana' },
  { id: 13, name: 'One Piece Card Game' },
  { id: 14, name: 'Slay the Spire' },
  { id: 15, name: 'Shadowverse' },
  { id: 16, name: 'Artifact' },
  { id: 17, name: 'Eternal' },
  { id: 18, name: 'Splinterlands' },
  { id: 19, name: 'Gods Unchained' },
  { id: 20, name: 'Arkham Horror: The Card Game' }
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [games, setGames] = useState(cardGames.map(game => ({ ...game, favorite: false })));
  const [filteredGames, setFilteredGames] = useState([]);
  
  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true);
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

  const navigateToScanCard = () => {
    window.location.href = '/scanCard';
  };

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === id ? { ...game, favorite: !game.favorite } : game
      )
    );
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Side Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-slate-950 z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xl`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-teal-400">Menu</h2>
          <ul className="space-y-4">
            <li className="p-2 hover:bg-slate-800 rounded-md transition-colors">Home</li>
            <li className="p-2 hover:bg-slate-800 rounded-md transition-colors">My Collection</li>
            <li className="p-2 hover:bg-slate-800 rounded-md transition-colors">Trade Cards</li>
            <li className="p-2 hover:bg-slate-800 rounded-md transition-colors">Settings</li>
            <li className="p-2 hover:bg-slate-800 rounded-md transition-colors">About</li>
          </ul>
        </div>
      </div>
      
      {/* Overlay when menu is open */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}
    
      {/* Main Content */}
      <div 
        className={`min-h-screen transition-transform duration-500 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header */}
        <header className="p-4 flex items-center justify-between bg-slate-900 bg-opacity-90 sticky top-0 z-10 shadow-lg backdrop-blur-md">
          <div className="flex items-center">
            <button 
              className="p-2 rounded-full hover:bg-slate-700 transition-colors"
              onClick={toggleMenu}
            >
              <Menu className="h-6 w-6 text-teal-400" />
            </button>
            <h1 className="text-sm font-bold ml-3 text-teal-400">Card Games</h1>
          </div>
          <button 
            className="bg-teal-600 px-4 py-2 rounded-full hover:bg-teal-500 transition-all shadow-md text-xs"
            onClick={navigateToScanCard}
          >
            Scan Card
          </button>
        </header>
        
        {/* Search Bar */}
        <div className="p-4 sticky top-16 bg-slate-900 bg-opacity-90 backdrop-blur-md z-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search card games..."
              className="bg-slate-800 w-full py-3 pl-12 pr-4 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-teal-500 border border-slate-700 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Card Games List */}
        <div className="p-4 pb-24 overflow-y-auto max-h-[calc(100vh-132px)]">
          {filteredGames.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400">No card games found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredGames.map((game) => (
                <div 
                  key={game.id} 
                  className="bg-slate-800 bg-opacity-60 rounded-xl p-4 transition-all duration-300 border border-slate-700 flex justify-between items-center shadow-md hover:shadow-lg hover:translate-y-px"
                >
                  <h3 className="font-medium text-lg">{game.name}</h3>
                  <button 
                    onClick={() => toggleFavorite(game.id)}
                    className="focus:outline-none"
                    aria-label={game.favorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart 
                      className={`h-6 w-6 transform transition-all duration-300 ${
                        game.favorite ? 'fill-teal-500 text-teal-500 scale-110' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Floating Action Button */}
          {/* <div className="fixed bottom-6 right-6">
            <button 
              className="bg-teal-500 hover:bg-teal-400 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105"
              aria-label="Add new card game"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;