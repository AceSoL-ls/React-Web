import './App.css';
import { useState } from 'react';
import { usePlayers } from './UsePlayers';
import LoginForm from './LoginForm';
import PlayerCard from './PlayerCard';
import AddPlayerForm from './AddPlayerForm';
import { jwtDecode } from 'jwt-decode';
import nickPic from './assets/Nick.jpg';
import mariaPic from './assets/Maria.jpg';
import johnPic from './assets/John.png';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState("leaderboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 👈 State για ανοιχτό/κλειστό sidebar
  
  const { players, addNewPlayer, handleLikePlayer, handleDeletePlayer } = usePlayers(); 

  let currentUser = { username: 'Guest', role: 'User' };
  if (token) {
    try {
      currentUser = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token structure", err);
    }
  }

  const getPlayerImage = (name) => {
    if (name === "Nick") return nickPic;
    if (name === "Maria") return mariaPic;
    if (name === "John") return johnPic;
    return mariaPic; 
  };

  if (!token) {
    return <LoginForm onLoginSuccess={() => setToken(localStorage.getItem('token'))} />;
  }

  const filteredPlayers = players.filter((player) => {
    return player.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="app-layout">
      
      {/* 👑 TOP NAVBAR */}
      <header className="top-navbar">
        <div className="nav-left">
          {/* ☰ Κουμπί για Toggle του Sidebar */}
          <button className="btn-toggle-sidebar" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </button>
          <div className="nav-logo">Gamer Leaderboard ⚔️</div>
        </div>
        <div className="nav-user-zone">
          <span className="user-badge">
            {currentUser.role === 'Admin' ? '👑 Admin: ' : '🎮 User: '} {currentUser.username}
          </span>
          <button 
            className="btn-logout"
            onClick={() => {
              localStorage.removeItem('token');
              setToken(null);
            }}
          >
            Logout 🚪
          </button>
        </div>
      </header>

      {/* Κεντρικό Container */}
      <div className="main-container">
        
        {/* 📊 LEFT SIDEBAR (Με δυναμική κλάση closed) */}
        <aside className={`left-sidebar ${isSidebarOpen ? '' : 'closed'}`}>
          <nav className="sidebar-menu">
            <button 
              className={`menu-item ${activeMenu === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveMenu('leaderboard')}
            >
              📊 Leaderboard
            </button>
            <button 
              className={`menu-item ${activeMenu === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveMenu('profile')}
            >
              👤 My Profile
            </button>
            <button 
              className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveMenu('settings')}
            >
              ⚙️ Settings
            </button>
          </nav>
        </aside>

        {/* 🖥️ MAIN CONTENT WINDOW */}
        <main className="content-window">
          {activeMenu === 'leaderboard' ? (
            <>
              <div className="dashboard-actions">
                <input 
                  type="text" 
                  placeholder="Search players..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                
                {currentUser.role === 'Admin' && (
                  <button className="btn-open-modal" onClick={() => setIsModalOpen(true)}>
                    ➕ Create New Challenger
                  </button>
                )}
              </div>

              {/* Conditional Rendering Modal */}
              {isModalOpen && (
                <AddPlayerForm 
                  onAddPlayer={(name, game, level, gold) => {
                    addNewPlayer(name, game, level, gold, () => setIsModalOpen(false));
                  }} 
                  onClose={() => setIsModalOpen(false)} 
                />
              )}

              {/* THE GRID LAYOUT */}
              <div className="player-grid">
                {filteredPlayers.map((player) => (
                  <PlayerCard 
                    key={player.id} 
                    name={player.name} 
                    game={player.game} 
                    level={player.level} 
                    gold={player.gold} 
                    likes={player.likes} 
                    image={getPlayerImage(player.name)} 
                    onLike={() => handleLikePlayer(player.id)}
                    onDelete={() => handleDeletePlayer(player.id)}
                    userRole={currentUser.role}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="placeholder-view">
              <h2>Έρχεται σύντομα! 🚀</h2>
              <p>Αυτή η ενότητα ({activeMenu}) θα εμπλουτιστεί στο επόμενο βήμα μας.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default App;