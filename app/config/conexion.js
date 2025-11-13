const config = require('./configuracion')
const mongoose = require('mongoose')


module.exports={
    connection : null,
    conect:()=>{
        if (this.connection) return this.connection
        return mongoose.connect(config.BD)
         .then(conn => {
            this.connection = this.connection
            console.log('LA CONEXION SE REALIZO CORRECTAMENTE');
         })
         .catch(e =>(console.log(`Error en la conexion ${e}`)))
         
    }
}