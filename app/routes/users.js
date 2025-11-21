const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');


const router = express.Router();


// Get my profile
router.get('/me', authenticate, async (req, res, next) => {
try {
res.json(req.user);
} catch (err) { next(err); }
});


// Update profile
router.put('/me', authenticate, [
body('nombre').optional().isLength({ min: 2 }),
body('email').optional().isEmail(),
body('password').optional().isLength({ min: 6 })
], async (req, res, next) => {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const updates = {};
['nombre','email','password'].forEach(f => { if (req.body[f]) updates[f] = req.body[f]; });


if (updates.password) req.user.password = updates.password;
if (updates.nombre) req.user.nombre = updates.nombre;
if (updates.email) req.user.email = updates.email;


await req.user.save();
res.json({ message: 'Perfil actualizado' });
} catch (err) { next(err); }
});


module.exports = router;