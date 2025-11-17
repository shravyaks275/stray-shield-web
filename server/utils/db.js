const pool = require('../config/database');

async function getUserById(id) {
  const result = await pool.query('SELECT id, email, name, phone, user_type, organization_name FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

async function getReportsByUserId(userId, status = null) {
  let query = 'SELECT * FROM reports WHERE user_id = $1';
  const params = [userId];

  if (status && status !== 'all') {
    query += ' AND status = $2';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';
  const result = await pool.query(query, params);
  return result.rows;
}

async function getAllReports(status = null) {
  let query = 'SELECT r.*, u.name as reporter_name, u.phone as reporter_phone FROM reports r JOIN users u ON r.user_id = u.id';
  const params = [];

  if (status && status !== 'all') {
    query += ' WHERE r.status = $1';
    params.push(status);
  }

  query += ' ORDER BY r.created_at DESC';
  const result = await pool.query(query, params);
  return result.rows;
}

async function getReportStats() {
  const result = await pool.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
    FROM reports
  `);
  return result.rows[0];
}

module.exports = {
  getUserById,
  getUserByEmail,
  getReportsByUserId,
  getAllReports,
  getReportStats,
};
