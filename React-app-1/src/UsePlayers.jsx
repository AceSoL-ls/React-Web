// 📁 Αρχείο: React-app-1/src/usePlayers.js
import { useState, useEffect } from 'react';

export function usePlayers() {
  const [players, setPlayers] = useState([]);

  // 1. GET - Φόρτωση παικτών
  useEffect(() => {
    fetch('/api/players')
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Error loading players:", err));
  }, []);

  // 2. POST - Προσθήκη νέου παίκτη
  const addNewPlayer = (name, game, level, gold) => {
    return fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, game, level, gold })
    })
    .then(response => response.json())
    .then(newPlayerFromDb => {
      setPlayers(prevPlayers => [...prevPlayers, newPlayerFromDb]);
      return true; // Επιστρέφουμε true για να ξέρει το App ότι πέτυχε και να κλείσει το modal
    })
    .catch(err => {
      console.error("Error saving player:", err);
      return false;
    });
  };

  // 3. PUT - Like
  const handleLikePlayer = (id) => {
    fetch(`/api/players/${id}/like`, { method: 'PUT' })
      .then((res) => {
        if (res.ok) {
          setPlayers(players.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
        }
      });
  };

  // 4. DELETE - Διαγραφή
  const handleDeletePlayer = (id) => {
    fetch(`/api/players/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setPlayers(players.filter(p => p.id !== id));
        } else {
          alert("Κάτι πήγε στραβά με τη διαγραφή.");
        }
      });
  };

  // Στέλνουμε ΟΛΑ τα εργαλεία στο κουτί
  return {
    players,
    addNewPlayer,
    handleLikePlayer,
    handleDeletePlayer
  };
}