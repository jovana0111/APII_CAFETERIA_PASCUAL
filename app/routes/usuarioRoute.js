const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuarioController')

router.get('/', usuarioController.buscarTodo)
    .post('/', usuarioController.agregarUsuario)// se deja exactamente igual, por que depende de get y post

module.exports=router;