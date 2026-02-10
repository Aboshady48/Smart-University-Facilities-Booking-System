const {pool} = require('../../config/db.js');
/**
 * 
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,          -- room | lab | hall | equipment
    capacity INT CHECK (capacity > 0),
    rules JSONB,                        -- booking rules (time limits, restrictions)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 */

exports.createResource = async (req, res) => {
    const { name, type, capacity, rules } = req.body;
    try {
        const newResource = await pool.query(
            `INSERT INTO resources (name, type, capacity, rules) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, type, capacity, rules]
        );
        res.status(201).json({ resource: newResource.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getResources = async (req, res) => {
    try {
        const resources = await pool.query(`SELECT * FROM resources`);
        res.status(200).json({ resources: resources.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getResource = async (req, res) => {
    const { resourceId } = req.params;
    try {
        const resource = await pool.query(
            `SELECT * FROM resources WHERE id = $1`,
            [resourceId]
        );
        if (resource.rows.length === 0) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json({ resource: resource.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateResource = async (req, res) => {
    const { resourceId } = req.params;
    const { name, type, capacity, rules, is_active } = req.body;
    try {
        const updatedResource = await pool.query(
            `UPDATE resources SET name = $1, type = $2, capacity = $3, rules = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $6 RETURNING *`,
            [name, type, capacity, rules, is_active, resourceId]
        );
        if (updatedResource.rows.length === 0) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json({ resource: updatedResource.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deleteResource = async (req, res) => {
    const { resourceId } = req.params;
    try {
        const deletedResource = await pool.query(
            `DELETE FROM resources WHERE id = $1 RETURNING *`,
            [resourceId]
        );
        if (deletedResource.rows.length === 0) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

