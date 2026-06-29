// Notice we accept 'likes' and 'onLike' as parameters coming from the parent!
function PlayerCard({ name, game, level, gold, image, likes, onLike }) {
  return (
    <div className="player-card">
      <img src={image} alt={name} className="player-avatar" />
      <h2 className="player-name">{name}</h2>
      <p className="player-game">🎮 {game}</p>
      
      <div className="player-stats">
        <span>⭐ Lvl: {level}</span>
        <span>🪙 Gold: {gold}</span>
      </div>

      {/* Display database likes, and fire the parent network action on click */}
      <button className="btn-like" onClick={onLike}>
        ❤️ Likes: {likes || 0}
      </button>
    </div>
  );
}

export default PlayerCard;