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



async function buscarUsuario(req, res, next) {
    try {
        const consulta = {};
        consulta[req.params.key] = req.params.value;

        const usuario = await usuarioModel.findOne(consulta);

        if (!usuario) return next();

        req.usuario = usuario; // ← AQUÍ ESTÁ EL CAMBIO IMPORTANTE
        return next();
    } catch (e) {
        req.error = e;
        return next();
    }
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





function usuarioActualizar(req, res) {
    if (!req.usuario) {
        return res.status(404).send({ mensaje: "No hay nada que actualizar" });
    }

    usuarioModel.updateOne(
        { _id: req.usuario._id },  // ← usamos el usuario encontrado
        req.body                   // ← solo los campos enviados
    )
    .then(info => {
        return res.status(200).send({ mensaje: "YA JALÓ", info });
    })
    .catch(e => {
        return res.status(404).send({ mensaje: "NO JALÓ :(", e });
    });
}



module.exports = {
    buscarTodo,
    agregarUsuario,
    buscarUsuario,
    mostrarUsuario,
    eliminarUsuario,
    usuarioActualizar
}