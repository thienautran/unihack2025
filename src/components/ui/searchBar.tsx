'use client'

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  // We'll use localStorage to persist the search state across component instances
  useEffect(() => {
    // Store search term in localStorage when it changes
    if (searchTerm) {
      localStorage.setItem('cardGameSearchTerm', searchTerm);
    } else {
      localStorage.removeItem('cardGameSearchTerm');
    }
    
    // Dispatch a custom event that other components can listen to
    const event = new CustomEvent('searchTermChanged', { 
      detail: { searchTerm } 
    });
    window.dispatchEvent(event);
  }, [searchTerm]);

  return (
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
  );
}