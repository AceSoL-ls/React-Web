import { useState } from "react";

function AddPlayerForm({onAddPlayer, onClose}) {
 const [playerName, setPlayerName] = useState("");
 const [playerGame, setPlayerGame] = useState("");
 const [playerLevel, setPlayerLevel] = useState("");
 const [playerGold, setPlayerGold] = useState("");


 function handleSubmit(event){
  event.preventDefault();
  if (playerName.trim() === "")
   return;
 
  onAddPlayer(playerName, playerGame, playerLevel, playerGold);
 }

return (
 <div className="modal-overlay">
  <div className="modal-content">
   <h2>Add New Player</h2>

   <form onSubmit={handleSubmit}>
    <div className="form-group">
     <label>Player Name:</label>
     <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} required />
    </div>

    <div className="form-group">
     <label>Game:</label>
     <input type="text" value={playerGame} onChange={(e) => setPlayerGame(e.target.value)} />
    </div>

    <div className="form-group">
     <label>Level:</label>
     <input type="text" value={playerLevel} onChange={(e) => setPlayerLevel(e.target.value)} />
    </div>

    <div className="form-group">
     <label>Gold:</label>
     <input type="text" value={playerGold} onChange={(e) => setPlayerGold(e.target.value)} />
    </div>
  

  <div className="modal-actions">
    <button type="submit" className="btn-submit">Add Player</button>
    <button type="button" className="btn-close" onClick={onClose}>Close</button>
   </div>
  </form>
 </div>
</div>
);
}

export default AddPlayerForm;