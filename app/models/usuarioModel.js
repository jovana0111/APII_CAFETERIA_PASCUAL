const mongoose = require('mongoose');
const usuarioSchema = mongoose.Schema ({
    usuario:{
        type: String,
        required: true,
        length: 50
    },
    correo:{
        type: String,
        required: true,
        length: 200
    },
    password:{
        type: Number,
        required: true
    }
})

const usuarioModel = mongoose.model('usuario', usuarioSchema)

module.exports = usuarioModel