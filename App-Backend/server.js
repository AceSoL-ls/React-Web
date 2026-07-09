import express from 'express';
import cors from 'cors';
import pg from 'pg';
import jwt from 'jsonwebtoken'; // 👈 Διορθώθηκε σε import αντί για require!

const { Pool } = pg;
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors()); // Για να επιτρέπουμε requests από το frontend

// 🚨 Το κρυφό κλειδί για την υπογραφή των JWT
const JWT_SECRET = "my_super_secret_game_leaderboard_key_123!";

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

// 🛡️ MIDDLEWARE: Ο πορτιέρης που ελέγχει αν το JWT είναι έγκυρο και ο χρήστης Admin
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Απομονώνουμε το token μετά το 'Bearer'

  if (!token) {
    return res.status(401).json({ error: "Δεν βρέθηκε token. Πρόσβαση απαγορευμένη." });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: "Το token είναι άκυρο ή έχει λήξει." });
    }

    if (decodedUser.role !== 'Admin') {
      return res.status(403).json({ error: "Δεν έχεις δικαιώματα Admin για αυτή την ενέργεια." });
    }

    req.user = decodedUser; // Αποθηκεύουμε τα στοιχεία του χρήστη στο request
    next(); // Προχωράμε στο επόμενο βήμα (στο πραγματικό route)
  });
};

// 🔐 ROUTE: Login Χρήστη & Έκδοση JWT
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (username === "Nick" && password === "123456") {
    const userPayload = {
      username: "Nick",
      role: "Admin" // 👑 Ρόλος Admin για να περνάει τον πορτιέρη!
    };

    // Παράγουμε το token με λήξη σε 2 ώρες
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '2h' });

    return res.json({ success: true, token: token });
  }

  return res.status(401).json({ success: false, message: "Λάθος Username ή Password" });
});

// 3. ROUTE: Fetch all players (Ανοιχτό για όλους)
app.get('/api/players', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. ROUTE: Save a brand new player (🔐 ΠΡΟΣΤΑΤΕΥΜΕΝΟ ΜΕ VERIFYADMIN)
app.post('/api/players', verifyAdmin, async (req, res) => {
  const { name, game, level, gold } = req.body;
  try {
    const queryText = 'INSERT INTO players (name, game, level, gold, likes) VALUES ($1, $2, $3, $4, 0) RETURNING *';
    const values = [name, game, level, gold];
    const result = await pool.query(queryText, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. ROUTE: Increment likes inside the database (Ανοιχτό για όλους - Διορθώθηκε σε POST)
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

// 6. ROUTE: ΔΙΑΓΡΑΦΗ ΠΑΙΚΤΗ (🔐 ΠΡΟΣΤΑΤΕΥΜΕΝΟ ΜΕ VERIFYADMIN)
app.delete('/api/players/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM players WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Ο παίκτης δεν βρέθηκε" });
    }

    res.json({ message: "Ο παίκτης διαγράφηκε με επιτυχία!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Σφάλμα κατά τη διαγραφή από τη βάση" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Full-Stack API Engine humming on http://localhost:${PORT}`);
});