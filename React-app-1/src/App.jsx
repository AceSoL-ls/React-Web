import { useState, useEffect } from 'react';
import './App.css';
import PlayerCard from './PlayerCard';
import AddPlayerForm from './AddPlayerForm';
import nickPic from './assets/Nick.jpg';
import mariaPic from './assets/Maria.jpg';
import johnPic from './assets/John.png';

function App() {
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Your V2.2 switch!

  const getPlayerImage = (name) => {
    if (name === "Nick") return nickPic;
    if (name === "Maria") return mariaPic;
    if (name === "John") return johnPic;
    return mariaPic; 
  };

  // Fetch players on page load
  useEffect(() => {
    fetch('/api/players')
      .then(response => response.json())
      .then(data => setPlayers(data))
      .catch(err => console.error("Error fetching players:", err));
  }, []);

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

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Gamer Leaderboard ⚔️</h1>
      
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
        {players.map((player) => (
          <PlayerCard 
            key={player.id} 
            name={player.name} 
            game={player.game} 
            level={player.level} 
            gold={player.gold} 
            likes={player.likes} 
            image={getPlayerImage(player.name)} 
            onLike={() => handleLikePlayer(player.id)} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;