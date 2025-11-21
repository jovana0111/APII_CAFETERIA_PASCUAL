const User = require('../models/User');
const { createToken } = require('../utils/jwt');


exports.register = async (req, res, next) => {
try {
const { nombre, email, password } = req.body;
const exists = await User.findOne({ email });
if (exists) return res.status(400).json({ message: 'Email ya registrado' });
const user = await User.create({ nombre, email, password });
const token = createToken(user._id);
res.status(201).json({ token });
} catch (err) { next(err); }
};


exports.login = async (req, res, next) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });
const match = await user.comparePassword(password);
if (!match) return res.status(400).json({ message: 'Credenciales inválidas' });
const token = createToken(user._id);
res.json({ token });
} catch (err) { next(err); }
};