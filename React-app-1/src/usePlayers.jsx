// 📁 Αρχείο: React-app-1/src/usePlayers.js
import { useState, useEffect } from 'react';

export function usePlayers() {
  const [players, setPlayers] = useState([]);

  // 1. GET - Φόρτωση παικτών (Ανοιχτό, δεν θέλει token)
  useEffect(() => {
    fetch('/api/players')
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

  // 2. POST - Προσθήκη νέου παίκτη (🔐 ΘΕΛΕΙ TOKEN)
  const addNewPlayer = (name, game, level, gold, onSuccess) => {
    const token = localStorage.getItem('token'); // 👈 Παίρνουμε το token

    fetch('/api/players', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 👈 Το στέλνουμε στον server
      },
      body: JSON.stringify({ name, game, level, gold })
    })
    .then(response => {
      if (!response.ok) throw new Error("Δεν έχεις δικαίωμα να προσθέσεις παίκτη.");
      return response.json();
    })
    .then(newPlayerFromDb => {
      setPlayers(prevPlayers => [...prevPlayers, newPlayerFromDb]);
      if (onSuccess) onSuccess(); // Κλείνει το modal
    })
    .catch(err => {
      alert(err.message); // Αν αποτύχει, βγάζει ένα ωραίο μήνυμα αντί να κρασάρει η σελίδα
    });
  };

  // 3. POST - Like (Ανοιχτό, δεν θέλει token - Διορθώθηκε σε POST)
  const handleLikePlayer = (id) => {
    fetch(`/api/players/${id}/like`, { method: 'POST' })
      .then((res) => {
        if (res.ok) {
          setPlayers(players.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
        }
      })
      .catch(err => console.error("Error liking:", err));
  };

  // 4. DELETE - Διαγραφή (🔐 ΘΕΛΕΙ TOKEN - ΕΔΩ ΗΤΑΝ ΤΟ ΛΑΘΟΣ!)
  const handleDeletePlayer = (id) => {
    const token = localStorage.getItem('token'); // 👈 Παίρνουμε το token

    fetch(`/api/players/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // 👈 Το στέλνουμε και εδώ!
      }
    })
    .then((res) => {
      if (!res.ok) throw new Error("Δεν έχεις δικαίωμα διαγραφής (Μόνο Admin).");
      setPlayers(players.filter(p => p.id !== id));
    })
    .catch(err => {
      alert(err.message); // Βγάζει μήνυμα αν πάει κάτι στραβά
    });
  };

  return {
    players,
    addNewPlayer,
    handleLikePlayer,
    handleDeletePlayer
  };
}