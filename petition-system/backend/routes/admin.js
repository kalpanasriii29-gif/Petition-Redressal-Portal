import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { query } from '../config/database.js';

const router = express.Router();

router.use(authenticate, requireRole('admin'));

router.delete('/petitions/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await query('DELETE FROM petitions WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete', error: err.message });
  }
});

router.get('/analytics', async (_req, res) => {
  try {
    const total = (await query('SELECT COUNT(*) AS c FROM petitions')).rows[0].c;
    const byStatus = (await query("SELECT status, COUNT(*) AS c FROM petitions GROUP BY status")).rows;
    const byDepartment = (await query("SELECT to_department AS department, COUNT(*) AS c FROM petitions GROUP BY to_department")).rows;
    const resolved = (await query("SELECT COUNT(*) AS c FROM petitions WHERE status = 'resolved'")) .rows[0].c;

    res.json({
      totals: { total: Number(total), resolved: Number(resolved) },
      byStatus: byStatus.map(r => ({ status: r.status, count: Number(r.c) })),
      byDepartment: byDepartment.map(r => ({ department: r.department, count: Number(r.c) })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute analytics', error: err.message });
  }
});

export default router;