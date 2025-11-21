const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const router = express.Router();


// Register
router.post('/register', [
body('nombre').isLength({ min: 2 }),
body('email').isEmail(),
body('password').isLength({ min: 6 })
], async (req, res, next) => {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { nombre, email, password } = req.body;
const exists = await User.findOne({ email });
if (exists) return res.status(400).json({ message: 'Email ya registrado' });


const user = await User.create({ nombre, email, password });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
res.status(201).json({ token });
} catch (err) {
next(err);
}
});


// Login
router.post('/login', [
body('email').isEmail(),
body('password').exists()
], async (req, res, next) => {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });


const match = await user.comparePassword(password);
if (!match) return res.status(400).json({ message: 'Credenciales inválidas' });


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
res.json({ token });
} catch (err) {
next(err);
}
});


module.exports = router;

