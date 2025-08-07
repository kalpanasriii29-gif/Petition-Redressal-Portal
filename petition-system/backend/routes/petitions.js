import express from 'express';
import { query } from '../config/database.js';
import { generateUniquePetitionId } from '../utils/petitionId.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { petitionSchema, statusSchema, responseSchema, validateBody } from '../middleware/validation.js';

const router = express.Router();

// Public: submit new petition
router.post('/', validateBody(petitionSchema), async (req, res) => {
  try {
    const petitionId = await generateUniquePetitionId();
    const { from_name, to_department, whatsapp_number, petition_text, priority } = req.body;
    const insert = `INSERT INTO petitions (petition_id, from_name, to_department, whatsapp_number, petition_text, priority)
                    VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    const { rows } = await query(insert, [petitionId, from_name, to_department, whatsapp_number, petition_text, priority || 'normal']);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create petition', error: err.message });
  }
});

// Public: track by petition_id
router.get('/track/:petition_id', async (req, res) => {
  try {
    const { petition_id } = req.params;
    const { rows } = await query('SELECT * FROM petitions WHERE petition_id = $1', [petition_id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    const petition = rows[0];
    const responses = (await query('SELECT * FROM responses WHERE petition_id = $1 ORDER BY response_date ASC', [petition.id])).rows;
    res.json({ petition, responses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch petition', error: err.message });
  }
});

// Protected: list with filters
router.get('/', authenticate, requireRole(['official', 'admin']), async (req, res) => {
  try {
    const { status, department, priority } = req.query;
    const conditions = [];
    const params = [];
    if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
    if (department) { params.push(department); conditions.push(`to_department = $${params.length}`); }
    if (priority) { params.push(priority); conditions.push(`priority = $${params.length}`); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM petitions ${where} ORDER BY created_at DESC`;
    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list petitions', error: err.message });
  }
});

// Protected: get by numeric id
router.get('/:id', authenticate, requireRole(['official', 'admin']), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await query('SELECT * FROM petitions WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    const petition = rows[0];
    const responses = (await query('SELECT * FROM responses WHERE petition_id = $1 ORDER BY response_date ASC', [id])).rows;
    res.json({ petition, responses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch petition', error: err.message });
  }
});

// Protected: update status
router.put('/:id/status', authenticate, requireRole(['official', 'admin']), validateBody(statusSchema), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const { rows } = await query('UPDATE petitions SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
});

// Protected: add response
router.post('/:id/response', authenticate, requireRole(['official', 'admin']), validateBody(responseSchema), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { response_text, is_final } = req.body;
    const { rows: pr } = await query('SELECT id FROM petitions WHERE id = $1', [id]);
    if (pr.length === 0) return res.status(404).json({ message: 'Not found' });
    const insert = `INSERT INTO responses (petition_id, response_text, is_final, responded_by)
                    VALUES ($1,$2,$3,$4) RETURNING *`;
    const { rows } = await query(insert, [id, response_text, !!is_final, req.user.role === 'admin' ? 'admin' : 'official']);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add response', error: err.message });
  }
});

export default router;