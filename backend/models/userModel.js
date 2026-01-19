import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createUser = async ({ name, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role || 'user']
  );
  return result.insertId;
};

export const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await db.query('SELECT id, name, email, role FROM user WHERE id = ?', [id]);
  return rows[0];
};
