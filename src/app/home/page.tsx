
import CardGamesView from '@/components/ui/cardGamesView'
import SearchBar from '@/components/ui/searchBar';
import SideMenu from '@/components/ui/sideMenu';
import Header from '@/components/ui/header';

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

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Use client components for interactive parts */}
      <SideMenu />
      <div className="min-h-screen">
        <Header />
        <SearchBar />
        <CardGamesView initialCardGames={cardGames} />
      </div>
    </div>
  );
}