const express = require('express');
const app = express();
const router = require('./routes/usuarioRoute');


app.use(express.json())


app.use('/usuario',router)

 
module.exports=app
