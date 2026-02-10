const {pool} = require('../../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokens.js');
const { ref } = require('node:process');

exports.studentRegister = async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  try {
    // Check if student already exists
    const existingStudent = await pool.query(
      `SELECT * FROM student WHERE email = $1`,
      [email]
    );

    if (existingStudent.rows.length > 0) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new student
    const newStudent = await pool.query(
      `INSERT INTO student (first_name, last_name, email, phone, password_hash) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, phone, role`,
      [firstName, lastName, email, phone, passwordHash]
    );

    res.status(201).json({ student: newStudent.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.studentLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if student exists
    const student = await pool.query(
      `SELECT * FROM student WHERE email = $1`,
      [email]
    );

    if (student.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, student.rows[0].password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: student.rows[0].id,
      role: student.rows[0].role
    });

    const refreshToken = generateRefreshToken({
      id: student.rows[0].id,
      role: student.rows[0].role
    });

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    await pool.query(
      `INSERT INTO refresh_tokens (student_id, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [student.rows[0].id, refreshToken, expiresAt]
    );

    res.status(200).json({
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
exports.refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: 'Refresh token required' });

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const tokenExists = await pool.query(
      `SELECT * FROM refresh_tokens WHERE token = $1`,
      [refreshToken]
    );

    if (tokenExists.rows.length === 0)
      return res.status(403).json({ message: 'Invalid refresh token' });

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role
    });

    res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  await pool.query(
    `DELETE FROM refresh_tokens WHERE token = $1`,
    [refreshToken]
  );
  if (refreshToken) {
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
  }

  res.status(200).json({ message: 'Logged out successfully' });
};

exports.getProfile = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await pool.query(
      `SELECT id, first_name, last_name, email, phone 
       FROM student 
       WHERE id = $1`,
      [studentId]
    );

    if (student.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ student: student.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateProfile = async (req, res) => {
  const { studentId } = req.params;
  const { firstName, lastName, email, phone } = req.body;

  try {
    const updatedStudent = await pool.query(
      `UPDATE student 
       SET first_name = $1, last_name = $2, email = $3, phone = $4
       WHERE id = $5
       RETURNING id, first_name, last_name, email, phone`,
      [firstName, lastName, email, phone, studentId]
    );

    if (updatedStudent.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ student: updatedStudent.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};