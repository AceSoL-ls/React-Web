import { useState } from 'react';
import { usePlayers } from './usePlayers';
import './App.css';
import PlayerCard from './PlayerCard';
import AddPlayerForm from './AddPlayerForm';
import nickPic from './assets/Nick.jpg';
import mariaPic from './assets/Maria.jpg';
import johnPic from './assets/John.png';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 🔽 1. Τραβάμε τα πάντα από το Hook (Παίκτες + Όλα τα Fetches!)
  const { players, addNewPlayer, handleLikePlayer, handleDeletePlayer } = usePlayers(); 

  const getPlayerImage = (name) => {
    if (name === "Nick") return nickPic;
    if (name === "Maria") return mariaPic;
    if (name === "John") return johnPic;
    return mariaPic; 
  };

  // 🔽 2. Η συνάρτηση που καλεί το hook και κλείνει το modal
  const handleCreatePlayer = (name, game, level, gold) => {
    addNewPlayer(name, game, level, gold).then((success) => {
      if (success) setIsModalOpen(false); // Κλείνει το modal μόνο αν πετύχει το save
    });
  };

  const filteredPlayers = players.filter((player) => {
    return player.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Gamer Leaderboard ⚔️</h1>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search players..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px', width: '100%', maxWidth: '300px', borderRadius: '5px' }} 
        />
      </div>
      
      {/* ➕ Modal Action Button */}
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <button className="btn-open-modal" onClick={() => setIsModalOpen(true)}>
          ➕ Create New Challenger
        </button>
      </div>

      {/* 🖥️ Conditional Rendering Modal */}
      {isModalOpen && (
        <AddPlayerForm 
          onAddPlayer={handleCreatePlayer} // 👈 Χρησιμοποιεί τη νέα handle συνάρτηση
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {/* 🕸️ THE GRID LAYOUT */}
      <div className="player-grid">
        {filteredPlayers.map((player) => (
          <PlayerCard 
            key={player.id} 
            name={player.name} 
            game={player.game} 
            level={player.level} 
            gold={player.gold} 
            likes={player.likes} 
            image={getPlayerImage(player.name)} 
            onLike={() => handleLikePlayer(player.id)} // 👈 ΤΩΡΑ ΔΟΥΛΕΥΕΙ!
            onDelete={() => handleDeletePlayer(player.id)} // 👈 ΤΩΡΑ ΔΟΥΛΕΥΕΙ!
          />
        ))}
      </div>
    </div>
  );
}

export default App;