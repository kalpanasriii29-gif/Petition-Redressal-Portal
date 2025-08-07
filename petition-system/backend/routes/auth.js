import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const AUTH_CODES = {
  official: process.env.OFFICIAL_LOGIN_CODE,
  admin: process.env.ADMIN_LOGIN_CODE,
};

router.post('/login', (req, res) => {
  const { role, code } = req.body || {};
  if (!role || !code) return res.status(400).json({ message: 'role and code are required' });
  if (!['official', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  if (AUTH_CODES[role] !== code) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.json({ token, role });
});

router.post('/logout', (_req, res) => {
  // Stateless JWT: client should discard token
  res.json({ message: 'Logged out' });
});

export default router;