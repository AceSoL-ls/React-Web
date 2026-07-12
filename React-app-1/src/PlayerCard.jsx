// 📁 Αρχείο: PlayerCard.jsx
export default function PlayerCard({ name, game, level, gold, likes, image, onLike, onDelete, userRole }) {
  return (
    <div className="player-card">
      <img src={image} alt={name} className="player-avatar" />
      <h3 className="player-name">{name}</h3>
      <p className="player-game">{game}</p>
      
      <div className="player-stats">
        <span>📊 Lvl: {level}</span>
        <span>💰 Gold: {gold}</span>
        <span>❤️ Likes: {likes}</span>
      </div>

      <button className="btn-like" onClick={onLike}>Like 👍</button>
      
      {/* ❌ ΕΜΦΑΝΙΣΗ DELETE ΜΟΝΟ ΑΝ ΕΙΝΑΙ ADMIN */}
      {userRole === 'Admin' && (
        <button className="btn-delete" onClick={onDelete}>Delete 🗑️</button>
      )}
    </div>
  );
}