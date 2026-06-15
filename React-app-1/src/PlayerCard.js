import {useState} from 'react';

function PlayerCard({name,game,level,gold,image}){
  const [likes, setLikes] = useState(0);

function increaseLikes(){
 setLikes(prev => prev + 1);
 }
function decreaseLikes(){
 setLikes(prev => prev - 1);
 }
 function resetLikes(){
  setLikes(0);
 }

return(
 <div>
  <img src={image} alt={name}></img>
  <h2>{name}</h2>
  <p>Game:{game}</p>
  <p>Level:{level}</p>
  <p>Likes:{likes}</p>
  <p>Gold:{gold}</p>
  <button onClick={increaseLikes}>+</button>
  <button onClick={decreaseLikes}>-</button>
  <button onClick={resetLikes}>Reset</button>
 </div>
 )
}

export default PlayerCard;