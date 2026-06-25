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

function addNewPlayer(nameFromChild){
  const newPlayerObj = {
    id: Date.now(),
    name: nameFromChild,
    game: "Unknown",
    level: "1",
    gold: "0",
    image: mariaPic
  };
  setPlayers(prevPlayers => [...prevPlayers, newPlayerObj]);
}

 return(
  <div className="dashboard-container">
   <h1 className="dashboard-title">Leaderboard Lab ⚔️</h1>

   <AddPlayerForm onAddPlayer={addNewPlayer} />

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