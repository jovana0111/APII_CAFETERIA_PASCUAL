const usuarioModel = require('../models/usuarioModel');

function buscarTodo(req,res){
    usuarioModel.find({})
    .then(usuario => {
        if(usuario.length){
            return res.status(200).send({usuario})
        }
        return res.status(204).send({mensaje: 'No hay nada que mostrar'})
    })
    .catch(e => {return res.status(404).send({mensaje: `error al consultar la informacion ${e}`})})
}


function agregarUsuario(req, res){// funcion con requerimiento y respuesta
    new usuarioModel(req.body).save()//aplicamos el metodo guardar se guarda en localhost, bd y coleccion que se tenga
    .then(info => {// hacemos ua promesa de que se va a regresa algo, 
        return res.status(200)// regresa el 200 por que marca que si esta todo correcto
        mensaje: "La informacion se guardo de manera correcta",
        info// variable que almacena el resultado de la promesa
    })
    .catch(e =>{return  res.status(404).send({mensaje: `error al guardar ${e}`})})
}

async function buscarUsuario(req,res,next){ // sirve para en la misma sintaxis ejecutar dos funciones al mismo tiempo.
   if (!req.body)  req.body={}// si el id existe
    var consulta = {}
    consulta[req.params.key] = req.params.value
    usuarioModel.find(consulta)
    .then(usuario =>{
        if(!usuario.length) return next();
        req.body.usuario = usuario
        return next()
    })
    .catch(e =>{
        req.body.e = e
        return next()
    })
}


function mostrarUsuario(req,res){
    if (req.body.e) return res.status(404).send({mesaje: `error al buscar informacion`})
    if (!req.body.usuario) return res.status(204).send({mensaje: `Nohay nada que mostrar`})
        let usuario = req.body.usuario
    return res.status(200).send({usuario})
}


function eliminarUsuario(req,res){
    var usuario = {}
    usuario = req.body.usuario
    usuarioModel.deleteOne(usuario[0])
    .then(info =>{
        return res.status(200).send({mensaje:`se elimino la informacion`})
    })
    .catch(e =>{
        return res.status(404).send({mensaje: `error al eliminar la informacion`,e})
    })
}




function usuarioActualizar(req,res){
    var usuario = req.body.usuario // se crea una variable que almacena el valor de la joya con los datos de la funcion de buscarJoya

    if(!usuario != !usuario.length){// aqui se valida que la joya exista y que tenga un valor, pero si los valotes son falsos, entonces no se actualiza
        return res.status(404).send({mensaje: "No hay nada que actualizar"})
    }
    usuarioModel.updateOne(usuario[0],req.body)// se actualiza la joya con los datos que se tienen en el body [0], se toma en cero para que lea apartir de la primer posicion
    .then(info =>{
        return res.status(200).send({mensaje: "YA JALO"})
        })
    .catch(e =>{
        return res.status(404).send({mensaje: "NO JALO :(", e})
    })
}



module.exports = {
    buscarTodo,
    agregarUsuario,
    buscarUsuario,
    mostrarUsuario,
    eliminarUsuario,
    usuarioActualizar
}