//Css Import here
import './App.css';

import AddPlayerForm from './AddPlayerForm';
import PlayerCard from './PlayerCard';
import nickPic from './assets/Nick.jpg';
import mariaPic from './assets/Maria.jpg';
import johnPic from './assets/John.png';

const PLAYERS_DATA = [
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
];

function App(){

 return(
  <div className="dashboard-container">
   <h1 className="dashboard-title">Leaderboard Lab ⚔️</h1>

   <AddPlayerForm />

   <div className="player-grid">
      {PLAYERS_DATA.map((player) => (
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