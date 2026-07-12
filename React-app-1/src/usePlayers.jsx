// 📁 Αρχείο: React-app-1/src/usePlayers.js
import { useState, useEffect } from 'react';

export function usePlayers() {
  const [players, setPlayers] = useState([]);
  const baseUrl = "https://react-web-aoqq.onrender.com"; // 👈 Το live URL του backend σου!

  // 1. GET - Φόρτωση παικτών
  useEffect(() => {
    fetch(`${baseUrl}/api/players`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPlayers(data);
        } else {
          setPlayers([]);
        }
      })
      .catch((err) => console.error("Error loading players:", err));
  }, []);

  // 2. POST - Προσθήκη νέου παίκτη
  const addNewPlayer = (name, game, level, gold, onSuccess) => {
    const token = localStorage.getItem('token'); 

    fetch(`${baseUrl}/api/players`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ name, game, level, gold })
    })
    .then(response => {
      if (!response.ok) throw new Error("Δεν έχεις δικαίωμα να προσθέσεις παίκτη.");
      return response.json();
    })
    .then(newPlayerFromDb => {
      setPlayers(prevPlayers => [...prevPlayers, newPlayerFromDb]);
      if (onSuccess) onSuccess(); 
    })
    .catch(err => {
      alert(err.message); 
    });
  };

  // 3. POST - Like
  const handleLikePlayer = (id) => {
    fetch(`${baseUrl}/api/players/${id}/like`, { method: 'POST' })
      .then((res) => {
        if (res.ok) {
          setPlayers(players.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
        }
      })
      .catch(err => console.error("Error liking:", err));
  };

  // 4. DELETE - Διαγραφή
  const handleDeletePlayer = (id) => {
    const token = localStorage.getItem('token'); 

    fetch(`${baseUrl}/api/players/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
    .then((res) => {
      if (!res.ok) throw new Error("Δεν έχεις δικαίωμα διαγραφής (Μόνο Admin).");
      setPlayers(players.filter(p => p.id !== id));
    })
    .catch(err => {
      alert(err.message); 
    });
  };

  return {
    players,
    addNewPlayer,
    handleLikePlayer,
    handleDeletePlayer
  };
}