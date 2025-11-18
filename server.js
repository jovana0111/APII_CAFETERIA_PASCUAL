const CONFIG = require('./app/config/configuracion')
const app = require('./app/app')
const conexion = require('./app/config/conexion')
const usuarioRoutes = require('./app/routes/usuarioRoute')


conexion.conect()

app.use("/", usuarioRoutes);


app.listen(CONFIG.PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${CONFIG.PORT}`)
})