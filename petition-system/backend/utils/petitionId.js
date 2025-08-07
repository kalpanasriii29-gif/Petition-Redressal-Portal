import { withTransaction } from '../config/database.js';

export async function generateUniquePetitionId() {
  const currentYear = new Date().getFullYear();
  const prefix = `TNK-${currentYear}-`;

  return withTransaction(async (client) => {
    // Lock table to avoid race on concurrent inserts
    await client.query('LOCK TABLE petitions IN SHARE ROW EXCLUSIVE MODE');
    const { rows } = await client.query(
      `SELECT petition_id FROM petitions WHERE petition_id LIKE $1 ORDER BY petition_id DESC LIMIT 1`,
      [`${prefix}%`]
    );

    let nextNumber = 1;
    if (rows.length > 0) {
      const last = rows[0].petition_id; // TNK-YYYY-XXX
      const parts = last.split('-');
      const numeric = parseInt(parts[2], 10);
      if (!Number.isNaN(numeric)) nextNumber = numeric + 1;
    }

    const petitionId = `${prefix}${String(nextNumber).padStart(3, '0')}`;
    return petitionId;
  });
}