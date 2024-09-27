const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authcontroller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', passport.authenticate('local'), authController.login);

module.exports = router;