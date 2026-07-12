import express from 'express';
import cors from 'cors';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "my_super_secret_game_leaderboard_key_123!";

app.use(cors());
app.use(express.json());

// Σύνδεση στη βάση
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://gamer_admin:super_secret_password123@localhost:5432/leaderboard_data',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Δημιουργία πινάκων
async function initDatabaseTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        game VARCHAR(100),
        level VARCHAR(50),
        gold VARCHAR(50),
        likes INT DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'User'
      );
    `);
    console.log("✅ Database tables verified and ready.");
  } catch (err) {
    console.error("❌ Error generating database tables:", err);
  }
}
initDatabaseTable();

const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Access denied." });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== 'Admin') return res.status(403).json({ error: "Unauthorized" });
    req.user = decoded;
    next();
  });
};

// API ROUTES
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (result.rows.length === 0 || result.rows[0].password !== password) 
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  
  const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ success: true, token });
});

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const role = username.toLowerCase() === 'nick' ? 'Admin' : 'User';
  try {
    const result = await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *', [username, password, role]);
    res.json({ success: true, user: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/players', async (req, res) => {
  const result = await pool.query('SELECT * FROM players ORDER BY id ASC');
  res.json(result.rows);
});

app.post('/api/players', verifyAdmin, async (req, res) => {
  const { name, game, level, gold } = req.body;
  const result = await pool.query('INSERT INTO players (name, game, level, gold) VALUES ($1, $2, $3, $4) RETURNING *', [name, game, level, gold]);
  res.json(result.rows[0]);
});

app.post('/api/players/:id/like', async (req, res) => {
  const result = await pool.query('UPDATE players SET likes = likes + 1 WHERE id = $1 RETURNING *', [req.params.id]);
  res.json(result.rows[0]);
});

app.delete('/api/players/:id', verifyAdmin, async (req, res) => {
  await pool.query('DELETE FROM players WHERE id = $1', [req.params.id]);
  res.json({ message: "Deleted" });
});

// FRONTEND STATIC SERVING
const buildPath = path.join(__dirname, '../React-app-1/dist');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Server ready on port ${PORT}`));