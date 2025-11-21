const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const qrcode = require('qrcode');


const router = express.Router();


// Get user's cart
router.get('/', authenticate, async (req, res, next) => {
try {
let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
res.json(cart);
} catch (err) { next(err); }
});


// Add item to cart
router.post('/add', authenticate, [
body('productId').isMongoId(),
body('quantity').optional().isInt({ min: 1 })
], async (req, res, next) => {
try {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { productId, quantity = 1 } = req.body;
const product = await Product.findById(productId);
if (!product || !product.disponible) return res.status(404).json({ message: 'Producto no disponible' });


let cart = await Cart.findOne({ user: req.user._id });
if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });


const existing = cart.items.find(i => i.product.toString() === productId);
if (existing) existing.quantity += quantity;
else cart.items.push({ product: productId, quantity });


cart.updatedAt = new Date();
await cart.save();
res.json(cart);
} catch (err) { next(err); }
});


// Remove item
router.post('/remove', authenticate, [body('productId').isMongoId()], async (req, res, next) => {
try {
const { productId } = req.body;
let cart = await Cart.findOne({ user: req.user._id });
if (!cart) return res.status(404).json({ message: 'Carrito vacío' });
cart.items = cart.items.filter(i => i.product.toString() !== productId);
cart.updatedAt = new Date();
await cart.save();
res.json(cart);
} catch (err) { next(err); }
});


// Checkout: return amount and QR code as data URL
router.post('/checkout', authenticate, async (req, res, next) => {
try {
const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Carrito vacío' });


const total = cart.items.reduce((sum, it) => sum + (it.product.precio * it.quantity), 0);


// Here you would create a payment order with the gateway. For demo: generate a simple payload and QR
const paymentPayload = {
userId: req.user._id.toString(),
amount: total,
currency: 'MXN',
createdAt: new Date().toISOString()
};


const payloadString = JSON.stringify(paymentPayload);
const qrDataUrl = await qrcode.toDataURL(payloadString);


res.json({ amount: total, currency: 'MXN', qr: qrDataUrl });
} catch (err) { next(err); }
});


module.exports = router;