const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('./db');

const router = express.Router();

// Create a task
router.post('/tasks', async (req, res) => {
    const { title } = req.body;
    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'title is required' });
    }
    const id = uuidv4();
    await pool.query('INSERT INTO tasks (id, title) VALUES ($1, $2)', [id, title]);
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    res.status(201).json(rows[0]);
});

// List all tasks
router.get('/tasks', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY created_at ASC');
    res.json(rows);
});

// Get a single task
router.get('/tasks/:id', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
});

// Update a task (title and/or done)
router.put('/tasks/:id', async (req, res) => {
    const { title, done } = req.body;
    const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'not found' });

    const updated = {
        title: title !== undefined ? title : existing.rows[0].title,
        done: done !== undefined ? done : existing.rows[0].done,
    };

    await pool.query('UPDATE tasks SET title = $1, done = $2 WHERE id = $3', [
        updated.title,
        updated.done,
        req.params.id,
    ]);
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    res.json(rows[0]);
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'not found' });
    res.status(204).send();
});

module.exports = router;
