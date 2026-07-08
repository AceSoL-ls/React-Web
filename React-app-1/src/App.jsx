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
  const { players, setPlayers } = usePlayers(); 

  const getPlayerImage = (name) => {
    if (name === "Nick") return nickPic;
    if (name === "Maria") return mariaPic;
    if (name === "John") return johnPic;
    return mariaPic; 
  };

  // Save new player to database
  function addNewPlayer(name, game, level, gold) {
    fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, game, level, gold }) // Ensure order is uniform
    })
    .then(response => response.json())
    .then(newPlayerFromDb => {
      setPlayers(prevPlayers => [...prevPlayers, newPlayerFromDb]);
      setIsModalOpen(false); // Close modal cleanly
    })
    .catch(err => console.error("Error saving player:", err));
  }

  // Like player inside database
  function handleLikePlayer(id) {
    fetch(`/api/players/${id}/like`, {
      method: 'POST'
    })
    .then(response => response.json())
    .then(updatedPlayer => {
      setPlayers(prevPlayers => 
        prevPlayers.map(p => p.id === id ? updatedPlayer : p)
      );
    })
    .catch(err => console.error("Error updating likes:", err));
  }

  const handleDeletePlayer = (id) => {
  // 1. Στέλνουμε το αίτημα διαγραφής στο backend (χρησιμοποιώντας το relative path)
  fetch(`/api/players/${id}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (response.ok) {
      // 2. Αν το backend πει "OK", σβήνουμε τον παίκτη από το state της React
      setPlayers(players.filter(player => player.id !== id));
    } else {
      alert("Κάτι πήγε στραβά με τη διαγραφή.");
    }
  })
  .catch(error => console.error("Error deleting player:", error));
};

const filteredPlayers = players.filter((player) => {
  // Μετατρέπουμε τα πάντα σε μικρά (lowercase) για να μην έχει σημασία αν γράψεις "NICK" ή "nick"
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
          onAddPlayer={addNewPlayer} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {/* 🕸️ THE GRID LAYOUT: Wraps all components securely */}
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