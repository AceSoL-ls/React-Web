import './App.css';
import { useState } from 'react';
import { usePlayers } from './usePlayers';
import LoginForm from './LoginForm';
import PlayerCard from './PlayerCard';
import AddPlayerForm from './AddPlayerForm';
import nickPic from './assets/Nick.jpg';
import mariaPic from './assets/Maria.jpg';
import johnPic from './assets/John.png';

function App() {

  const [token, setToken] = useState(localStorage.getItem('token'));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Παίρνουμε τα πάντα σωστά από το hook μας
  const { players, addNewPlayer, handleLikePlayer, handleDeletePlayer } = usePlayers(); 

  const getPlayerImage = (name) => {
    if (name === "Nick") return nickPic;
    if (name === "Maria") return mariaPic;
    if (name === "John") return johnPic;
    return mariaPic; 
  };

  if (!token) {
    return <LoginForm onLoginSuccess={() => setToken(localStorage.getItem('token'))} />;
  }


  const filteredPlayers = players.filter((player) => {
    return player.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="dashboard-container">
      {/* Κουμπί Logout στην κορυφή */}
      <div style={{ textAlign: 'right', padding: '10px' }}>
        <button 
          onClick={() => {
            localStorage.removeItem('token'); // Σβήσιμο από τον browser
            setToken(null); // Ενημέρωση της React
          }}
          style={{ background: '#f44336', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout 🚪
        </button>
      </div>
      
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
          // 🔽 ΕΔΩ: Του δίνουμε τα δεδομένα και μια συνάρτηση να κλείνει το modal στο καπάκι
          onAddPlayer={(name, game, level, gold) => {
            addNewPlayer(name, game, level, gold, () => setIsModalOpen(false));
          }} 
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
            onLike={() => handleLikePlayer(player.id)}
            onDelete={() => handleDeletePlayer(player.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;