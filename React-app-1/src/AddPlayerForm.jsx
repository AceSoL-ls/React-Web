import { useState } from "react";

function AddPlayerForm() {
 const [playerName, setPlayerName] = useState("");

 function handleNameChange(event){
  setPlayerName(event.target.value);

 }


return (
 <div>
  <input className="player-input"
   type="text"
   placeholder="Enter player name"
   value={playerName}
   onChange={handleNameChange}
  />
  <button onClick={() => console.log(playerName)} className="btn-newPlayer">Add New Player</button>
 </div>
);
}

export default AddPlayerForm;