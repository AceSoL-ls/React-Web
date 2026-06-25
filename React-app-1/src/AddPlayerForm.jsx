import { useState } from "react";

function AddPlayerForm({onAddPlayer}) {
 const [playerName, setPlayerName] = useState("");

 function handleNameChange(event){
  setPlayerName(event.target.value);
 }

 function handleSubmit(){
  if(playerName.trim() === "") {
   alert("Please enter a player name.");
   return;
  }
  onAddPlayer(playerName);
  setPlayerName("");
 }
 


return (
 <div>
  <input className="player-input"
   type="text"
   placeholder="Enter player name"
   value={playerName}
   onChange={handleNameChange}
  />
  <button onClick={handleSubmit} className="btn-newPlayer">Add New Player</button>
 </div>
);
}

export default AddPlayerForm;