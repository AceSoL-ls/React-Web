//Css Import here
import './App.css';

import PlayerCard from './PlayerCard';
import nickPic from './assets/Nick.jpg';
import mariaPic from './assets/Maria.jpg';
import johnPic from './assets/John.png';

function App(){

 return(
  <div className="app-container">
   <h1 className="title">Leaderboard Lab ⚔️</h1>
   <div className="card-grid">
   <PlayerCard 
   name = "Nick" 
   game = "Lineage" 
   level = "85" 
   gold = "1000" 
   image = {nickPic} 
   />
   <PlayerCard 
   name = "Maria" 
   game = "Valorant" 
   level = "40" 
   gold = "500"
   image = {mariaPic}
   />
   <PlayerCard 
   name ="John" 
   game = "Minecraft" 
   level = "100" 
   gold = "2000"
   image = {johnPic}
   />
   </div>
  </div>
 )
}

export default App;