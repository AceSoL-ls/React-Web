//Css Import here
import './App.css';
import {useState} from 'react';

import AddPlayerForm from './AddPlayerForm';
import PlayerCard from './PlayerCard';
import nickPic from './assets/Nick.jpg';
import mariaPic from './assets/Maria.jpg';
import johnPic from './assets/John.png';


function App(){

  const [players, setPlayers] = useState([
  {
    id: 1,
    name: "Nick",
    game: "Lineage",
    level: "85",
    gold: "1000",
    image: nickPic
  },
  {
    id: 2,
    name: "Maria",
    game: "Valorant",
    level: "40",
    gold: "500",
    image: mariaPic
  },
  {
    id: 3,
    name: "John",
    game: "Minecraft",
    level: "100",
    gold: "2000",
    image: johnPic
  }
]);

const [isModalOpen, setIsModalOpen] = useState(false);

function addNewPlayer(nameFromChild,game,gold,level){
  const newPlayerObj = {
    id: Date.now(),
    name: nameFromChild,
    game: game || "Unknown",
    level: level || "1",
    gold: gold || "0",
    image: mariaPic
  };
  setPlayers(prevPlayers => [...prevPlayers, newPlayerObj]);
  setIsModalOpen(false);
}

 return(
  <div className="dashboard-container">
   <h1 className="dashboard-title">Leaderboard Lab ⚔️</h1>

   <div>
    <button className="btn-open-modal" onClick={() => setIsModalOpen(true)}>
     Add New Player
    </button>
   </div>

   {/* Conditional Rendering If modal is true */}
   {isModalOpen && (
    <AddPlayerForm 
    onAddPlayer={addNewPlayer}
    onClose={() => setIsModalOpen(false)} 
    />
   )}

   <div className="player-grid">
      {players.map((player) => (
         <PlayerCard
            key={player.id}
            name={player.name}
            game={player.game}
            level={player.level}
            gold={player.gold}
            image={player.image}
         />
      ))}
   </div>
   </div>
 );
}

export default App;