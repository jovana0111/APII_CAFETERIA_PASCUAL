const CONFIG = require('./app/config/configuracion')
const app = require('./app/app')
const conexion = require('./app/config/conexion')


conexion.conect()

app.listen(CONFIG.PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${CONFIG.PORT}`)
})