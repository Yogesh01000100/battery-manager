import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'battery.db');
console.log(`Using database file at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err: Error | null) => {
    if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database.');
});

const runQuery = (query: string, params: any[] = []): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err: Error | null) => {
            if (err) {
                console.error('SQL Execution Error:', err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const createTable = async () => {
    try {
        await runQuery(`
            CREATE TABLE IF NOT EXISTS battery_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                battery_id TEXT NOT NULL,
                current REAL,
                voltage REAL,
                temperature REAL,
                time TEXT NOT NULL
            )
        `);
        console.log('battery_data table is ready.');
        await loadSampleData();
    } catch (error) {
        console.error('Error creating table:', error);
    }
};


const checkDataExists = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) AS count FROM battery_data`, [], (err, row: any) => {
            if (err) {
                console.error('Error checking existing data:', err.message);
                reject(err);
            } else {
                resolve(row.count > 0);
            }
        });
    });
};


const loadSampleData = async () => {
    try {
        const dataExists = await checkDataExists();
        if (dataExists) {
            console.log('Sample data already exists. Skipping insertion.');
            return;
        }

        console.log('Inserting sample data...');
        const sampleData = [
            { battery_id: "1001", current: 15.2, voltage: 48.7, temperature: 35.5, time: "2024-08-19T10:00:00Z" },
            { battery_id: "1002", current: 13.5, voltage: 47.3, temperature: 33.8, time: "2024-08-19T10:01:00Z" },
            { battery_id: "1001", current: 15.0, voltage: 48.9, temperature: 35.0, time: "2024-08-19T10:02:00Z" },
            { battery_id: "1004", current: 16.8, voltage: 50.2, temperature: 36.1, time: "2024-08-19T10:03:00Z" },
            { battery_id: "1001", current: 13.8, voltage: 47.5, temperature: 34.0, time: "2024-08-19T10:04:00Z" }
        ];

        const stmt = db.prepare(`INSERT INTO battery_data (battery_id, current, voltage, temperature, time)
                                 VALUES (?, ?, ?, ?, ?)`);

        for (const data of sampleData) {
            await new Promise<void>((resolve, reject) => {
                stmt.run(data.battery_id, data.current, data.voltage, data.temperature, data.time, (err: Error | null) => {
                    if (err) {
                        console.error('Error inserting sample data:', err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }

        stmt.finalize((err: Error | null) => {
            if (err) {
                console.error('Error finalizing statement:', err.message);
            } else {
                console.log('Sample data inserted successfully.');
            }
        });

    } catch (error) {
        console.error('Error loading sample data:', error);
    }
};

createTable();

export default db;
