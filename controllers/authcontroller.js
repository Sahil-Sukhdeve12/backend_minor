const bcrypt = require('bcryptjs');
const db = require('../database/db');

exports.signup = (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(sql, [email, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('User registered successfully');
  });
};

exports.login = (req, res) => {
  res.send('Logged in successfully');
};