const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'minor_project'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.log(
       'Error connecting to the database:',err
    );
    throw err;
  }
  console.log('Connected to the database');
});

// Passport.js setup
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.query(sql, [email], (err, result) => {
        if (err) {
          return done(err);
        }
        if (result.length === 0) {
          return done(null, false, { message: 'Incorrect email.' });
        }
  
        const user = result[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
  
        if (!passwordIsValid) {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
        return done(null, user);
      });
    }
  ));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return done(err);
      }
      done(null, result[0]);
    });
  });
  
  // Signup endpoint
  app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
  
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send('User registered successfully');
    });
  });
  
  // Login endpoint
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.send('Logged in successfully');
  });
  
  // Logout endpoint
  app.post('/api/logout', (req, res) => {
    req.logout();
    res.send('Logged out successfully');
  });

// Create an API endpoint to fetch data
app.get('/api/data', (req, res) => {
  const sql = 'SELECT * FROM your-table';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// CRUD operations for electives
app.get('/api/electives', (req, res) => {
    const sql = 'SELECT * FROM electives';
    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });
  
  app.post('/api/electives', (req, res) => {
    const sql = 'INSERT INTO electives SET ?';
    db.query(sql, req.body, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });
  
  app.put('/api/electives/:id', (req, res) => {
    const sql = 'UPDATE electives SET ? WHERE id = ?';
    db.query(sql, [req.body, req.params.id], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });
  
  app.delete('/api/electives/:id', (req, res) => {
    const sql = 'DELETE FROM electives WHERE id = ?';
    db.query(sql, req.params.id, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });
  
  // CRUD operations for tracks
  app.get('/api/tracks', (req, res) => {
    const sql = 'SELECT * FROM tracks';
    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });
  
  app.post('/api/tracks', (req, res) => {
    const sql = 'INSERT INTO tracks SET ?';
    db.query(sql, req.body, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });
  
  app.put('/api/tracks/:id', (req, res) => {
    const sql = 'UPDATE tracks SET ? WHERE id = ?';
    db.query(sql, [req.body, req.params.id], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });
  
  app.delete('/api/tracks/:id', (req, res) => {
    const sql = 'DELETE FROM tracks WHERE id = ?';
    db.query(sql, req.params.id, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });

  app.get('/api/subjects', (req, res) => {
    const domain = req.query.domain;
    const sql = 'SELECT * FROM subjects WHERE domain = ?';
    db.query(sql, [domain], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});