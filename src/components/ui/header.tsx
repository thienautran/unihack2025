'use client'

export default function Header() {
  const navigateToScanCard = () => {
    window.location.href = '/scanCard';
  };

  return (
    <header className="p-4 flex items-center justify-between bg-slate-900 bg-opacity-90 sticky top-0 z-10 shadow-lg backdrop-blur-md">
      <div className="flex items-center">
        {/* Empty space to account for the menu button that's now in the SideMenu component */}
        <div className="w-3"></div>
        <h1 className="text-sm font-bold text-teal-400">Card Games</h1>
      </div>
      <button 
        className="bg-teal-600 px-4 py-2 rounded-full hover:bg-teal-500 transition-all shadow-md text-xs"
        onClick={navigateToScanCard}
      >
        Scan Card
      </button>
    </header>
  );
}