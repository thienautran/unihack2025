'use client'

import { useRouter } from 'next/navigation';

const MenuButton = () => {
  const router = useRouter();
  
  const navigateHome = () => {
    router.push('/home');
  };
  
  return (
    <div className="absolute top-4 left-4 z-50">
      {/* Home Button (Hamburger Style) */}
      <button 
        onClick={navigateHome}
        className="w-10 h-10 flex flex-col justify-center items-center bg-black bg-opacity-50 rounded-full transition-colors duration-300 hover:bg-teal-800"
        aria-label="Go to home"
      >
        <div className="w-5 h-0.5 bg-white mb-1"></div>
        <div className="w-5 h-0.5 bg-white mb-1"></div>
        <div className="w-5 h-0.5 bg-white"></div>
      </button>
    </div>
  );
};

export default MenuButton;