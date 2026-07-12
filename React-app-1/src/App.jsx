import './App.css';
import { useState } from 'react';
import { usePlayers } from './usePlayers';
import LoginForm from './LoginForm';
import PlayerCard from './PlayerCard';
import AddPlayerForm from './AddPlayerForm';
import { jwtDecode } from 'jwt-decode'; // 👈 1. Εισαγωγή του decoder
import nickPic from './assets/Nick.jpg';
import mariaPic from './assets/Maria.jpg';
import johnPic from './assets/John.png';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { players, addNewPlayer, handleLikePlayer, handleDeletePlayer } = usePlayers(); 

  // 👈 2. Αποκωδικοποίηση του token για να πάρουμε τα στοιχεία του τρέχοντος χρήστη
  let currentUser = { username: 'Guest', role: 'User' };
  if (token) {
    try {
      currentUser = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token structure", err);
    }
  }

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
      
      {/* 👑 Δυναμικό Top Bar με τα στοιχεία του τρέχοντος χρήστη */}
      <div className="top-bar">
        <span className="user-badge">
          {currentUser.role === 'Admin' ? '👑 Admin: ' : '🎮 User: '} {currentUser.username}
        </span>
        <button 
          className="btn-logout"
          onClick={() => {
            localStorage.removeItem('token');
            setToken(null);
          }}
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
          className="search-input"
        />
      </div>
      
      {currentUser.role === 'Admin' && (
        <div className="action-bar">
          <button className="btn-open-modal" onClick={() => setIsModalOpen(true)}>
            ➕ Create New Challenger
          </button>
        </div>
      )}

      {/* Conditional Rendering Modal */}
      {isModalOpen && (
        <AddPlayerForm 
          onAddPlayer={(name, game, level, gold) => {
            addNewPlayer(name, game, level, gold, () => setIsModalOpen(false));
          }} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {/* THE GRID LAYOUT */}
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
            userRole={currentUser.role}
          />
        ))}
      </div>
    </div>
  );
}

export default App;