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
  <div className="player-card">
    <img src={image} alt={name} className="player-image" />
    <h2 className="player-name">{name}</h2>
    
    <div className="card-stats">
      <p><strong>Game:</strong> {game}</p>
      <p><strong>Level:</strong> {level}</p>
      <p><strong>Likes:</strong> {likes}</p>
      <p><strong>Gold:</strong> {gold}</p>
    </div>

    <div className="card-actions">
      <button onClick={increaseLikes} className="btn-add">+</button>
      <button onClick={decreaseLikes} className="btn-sub">-</button>
      <button onClick={resetLikes} className="btn-reset">Reset</button>
    </div>
  </div>
 )
}

export default PlayerCard;