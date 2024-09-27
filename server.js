const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
require('./database/db'); // Ensure the database connection is established

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authRoutes);
app.use('/api', itemRoutes);

app.post('/api/logout', (req, res) => {
  req.logout();
  res.send('Logged out successfully');
});

app.get('/api/data', (req, res) => {
  const sql = 'SELECT * FROM your-table';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});