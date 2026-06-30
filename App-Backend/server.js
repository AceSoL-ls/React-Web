import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const PORT = 5000;

app.use(express.json());

// 1. LINK TO DOCKER DATABASE USING YOUR CREDENTIALS
const pool = new Pool({
  user: 'gamer_admin',
  host: 'localhost',
  database: 'leaderboard_data',
  password: 'super_secret_password123',
  port: 5432,
});

// 2. AUTOMATIC TABLE CREATOR: Builds the structure if it doesn't exist
async function initDatabaseTable() {
  const tableBlueprint = `
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      game VARCHAR(100),
      level VARCHAR(50),
      gold VARCHAR(50),
      likes INT DEFAULT 0
    );
  `;
  try {
    await pool.query(tableBlueprint);
    console.log("✅ Database 'players' table verified and ready.");
  } catch (err) {
    console.error("❌ Error generating database table:", err);
  }
}
initDatabaseTable();

// 3. ROUTE: Fetch all players from the real database
app.get('/api/players', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players ORDER BY id ASC');
    res.json(result.rows); // Sends actual rows back to React
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. ROUTE: Save a brand new player into the database
app.post('/api/players', async (req, res) => {
  const { name, game, level, gold } = req.body;
  try {
    const queryText = 'INSERT INTO players (name, game, level, gold, likes) VALUES ($1, $2, $3, $4, 0) RETURNING *';
    const values = [name, game, level, gold];
    const result = await pool.query(queryText, values);
    res.json(result.rows[0]); // Returns the fresh database row back to React
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. ROUTE: Increment likes inside the database row
app.post('/api/players/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const queryText = 'UPDATE players SET likes = likes + 1 WHERE id = $1 RETURNING *';
    const result = await pool.query(queryText, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Full-Stack API Engine humming on http://localhost:${PORT}`);
});