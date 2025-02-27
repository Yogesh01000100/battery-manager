import { Request, Response } from 'express';
import db from '../db/database';

const runQuery = (query: string, params: any[] = []): Promise<{ lastID?: number }> => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err: Error | null) {
            if (err) {
                console.error('Database error:', err.message);
                reject(err);
            } else {
                resolve({ lastID: this.lastID });
            }
        });
    });
};

const getQuery = (query: string, params: any[] = []): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err: Error | null, rows: any[]) => {
            if (err) {
                console.error('Database retrieval error:', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export const createBatteryData = async (req: Request, res: Response): Promise<void> => {
    try {
        const { battery_id, current, voltage, temperature, time } = req.body;

        if (!battery_id || current == null || voltage == null || temperature == null || !time) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const sql = `INSERT INTO battery_data (battery_id, current, voltage, temperature, time) 
                     VALUES (?, ?, ?, ?, ?)`;

        const result = await runQuery(sql, [battery_id, current, voltage, temperature, time]);
        res.status(201).json({ message: 'Data stored successfully', id: result.lastID });

    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

export const getBatteryData = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'Battery ID is required' });
            return;
        }

        const sql = `SELECT * FROM battery_data WHERE battery_id = ? ORDER BY time ASC`;
        const rows = await getQuery(sql, [id]);

        if (rows.length === 0) {
            res.status(404).json({ message: 'No data found for this battery ID' });
        } else {
            res.json(rows);
        }
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

export const getBatteryFieldData = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, field } = req.params;
        const { start, end } = req.query;
        const allowedFields = ['current', 'voltage', 'temperature'];

        if (!allowedFields.includes(field)) {
            res.status(400).json({ error: 'Invalid field requested' });
            return;
        }

        let sql = `SELECT battery_id, ${field}, time FROM battery_data WHERE battery_id = ?`;
        const params: (string | number)[] = [id];

        if (start && end) {
            sql += ' AND time BETWEEN ? AND ?';
            params.push(String(start), String(end));
        }

        sql += ' ORDER BY time DESC';
        const rows = await getQuery(sql, params);

        if (rows.length === 0) {
            res.status(404).json({ message: `No ${field} data found for battery ID ${id}` });
        } else {
            res.json(rows);
        }
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};
