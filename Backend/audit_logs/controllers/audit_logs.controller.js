const {pool} = require('../../config/db.js');

/**
 * 
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id INT REFERENCES student(id),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(50),
    entity_id INT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 */

exports.createLog = async (req, res) => {
    const { actor_id, action, entity, entity_id, metadata } = req.body;
    try {
        const newLog = await pool.query(
            `INSERT INTO audit_logs (actor_id, action, entity, entity_id, metadata) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [actor_id, action, entity, entity_id, metadata]
        );
        res.status(201).json({ log: newLog.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getLogs = async (req, res) => {
    try {
        const logs = await pool.query(`SELECT * FROM audit_logs ORDER BY created_at DESC`);
        res.status(200).json({ logs: logs.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}


