import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./battery.db', (err: Error | null) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS battery_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  battery_id TEXT NOT NULL,
  current REAL,
  voltage REAL,
  temperature REAL,
  time TEXT NOT NULL
)`, (err: Error | null) => {
    if (err) {
        console.error(err.message);
    }
    console.log('battery_data table ready.');
});

export default db;
