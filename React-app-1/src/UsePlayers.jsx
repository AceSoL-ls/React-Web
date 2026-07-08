// 📁 Αρχείο: React-app-1/src/usePlayers.js
import { useState, useEffect } from 'react';

export function usePlayers() {
  // 1. Κλέβουμε το state των παικτών από το App.jsx
  const [players, setPlayers] = useState([]);

  // 2. Κλέβουμε το useEffect που φορτώνει τους παίκτες κατά το refresh
  useEffect(() => {
    fetch('/api/players')
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch players");
        return res.json();
      })
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Error loading players:", err));
  }, []);

  // 3. Επιστρέφουμε ένα object με ό,τι θα χρειαστεί το App.jsx
  return {
    players,
    setPlayers
  };
}