const {pool} = require('../../config/db.js');

/**
 * 
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 */

exports.createPolicy = async (req, res) => {
    const { key, value } = req.body;
    try {
        const newPolicy = await pool.query(
            `INSERT INTO policies (key, value) 
             VALUES ($1, $2) RETURNING *`,
            [key, value]
        );
        res.status(201).json({ policy: newPolicy.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getPolicies = async (req, res) => {
    try {
        const policies = await pool.query(`SELECT * FROM policies`);
        res.status(200).json({ policies: policies.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getPolicy = async (req, res) => {
    const { policyId } = req.params;
    try {
        const policy = await pool.query(
            `SELECT * FROM policies WHERE id = $1`,
            [policyId]
        );
        if (policy.rows.length === 0) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        res.status(200).json({ policy: policy.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updatePolicy = async (req, res) => {
    const { policyId } = req.params;
    const { key, value } = req.body;    
    try {
        const updatedPolicy = await pool.query(
            `UPDATE policies SET key = $1, value = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 RETURNING *`,
            [key, value, policyId]
        );
        if (updatedPolicy.rows.length === 0) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        res.status(200).json({ policy: updatedPolicy.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.deletePolicy = async (req, res) => {
    const { policyId } = req.params;
    try {
        const deletedPolicy = await pool.query(
            `DELETE FROM policies WHERE id = $1 RETURNING *`,       

            [policyId]
        );
        if (deletedPolicy.rows.length === 0) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        res.status(200).json({ policy: deletedPolicy.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
