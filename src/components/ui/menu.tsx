'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MenuButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      {/* Hamburger Button */}
      <button 
        onClick={toggleMenu}
        className="w-10 h-10 flex flex-col justify-center items-center bg-black bg-opacity-50 rounded-full"
      >
        <div className="w-5 h-0.5 bg-white mb-1"></div>
        <div className="w-5 h-0.5 bg-white mb-1"></div>
        <div className="w-5 h-0.5 bg-white"></div>
      </button>
      
      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-12 left-0 bg-black bg-opacity-80 rounded-lg py-2 w-48 shadow-lg">
          <ul>
            <li>
              <button 
                onClick={() => navigateTo('/home')}
                className="text-white px-4 py-2 w-full text-left hover:bg-gray-700"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('/settings')}
                className="text-white px-4 py-2 w-full text-left hover:bg-gray-700"
              >
                Settings
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('/gallery')}
                className="text-white px-4 py-2 w-full text-left hover:bg-gray-700"
              >
                Saved Cards
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MenuButton;