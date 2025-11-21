const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const Product = require('../models/Product');


const router = express.Router();


// Public: list products
router.get('/', async (req, res, next) => {
try {
const products = await Product.find({ disponible: true });
res.json(products);
} catch (err) { next(err); }
});


// Admin: create product
router.post('/', authenticate, authorize('admin'), [
body('nombre').isLength({ min: 2 }),
body('precio').isFloat({ gt: 0 })
], async (req, res, next) => {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { nombre, descripcion, precio } = req.body;
const product = await Product.create({ nombre, descripcion, precio, createdBy: req.user._id });
res.status(201).json(product);
} catch (err) { next(err); }
});


// Admin: update product
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
try {
const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
res.json(product);
} catch (err) { next(err); }
});


module.exports = router;