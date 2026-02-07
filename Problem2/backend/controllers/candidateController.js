const pool = require('../db');

const getAllCandidates = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM candidates ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCandidateById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM candidates WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createCandidate = async (req, res) => {
    const { name, age, email, phone, skills, experience, applied_position, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO candidates (name, age, email, phone, skills, experience, applied_position, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, age, email, phone, skills, experience, applied_position, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateCandidate = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age, email, phone, skills, experience, applied_position, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE candidates SET name = $1, age = $2, email = $3, phone = $4, skills = $5, experience = $6, applied_position = $7, status = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
            [name, age, email, phone, skills, experience, applied_position, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteCandidate = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM candidates WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.status(200).json({ message: `Candidate deleted with ID: ${id}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllCandidates,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate,
};
