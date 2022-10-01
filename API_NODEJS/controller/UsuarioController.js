const conexion = require('../config/conexion');
const { check, validationResult } = require('express-validator');
var express = require('express') //llamamos a Express
var rutas = express()


 //--- define las rutas de la API
// se puede probar con Postman
//http://localhost:8000/
rutas.get('/', function(req, res) {
    res.json({ mensaje: '¡Hola Mundo!' })  
  })
  
  //http://localhost:8000/usuarios
   rutas.get('/usuarios', function(req, res) {
    //res.json({ mensaje: '¡Listando registros!' })  
    let sql="select * from usuarios order by id"
   conexion.query(sql,(err,rows)=>{
       if(err) throw err;
       else{
           res.json(rows)
       }
   })
  
  })//endget
  
  //-- Obtiene un usuario especifico 
  //---- get one user
  //http://localhost:8000/usuarios/5
  rutas.get('/usuarios/:id', function(req, res) {
    conexion.query("select * from usuarios where id = ?", [req.params.id],(err,rows)=>{
        if(err) throw err;
        else{
            res.json(rows)
        }
    })
   })
  
  
  //--- listar usuarios
  //--guardar
  //-- Insertar un usuario
  rutas.post('/usuarios',[
    check('documento').isString(),
    check('nombres').isString(),
    check('apellidos').isString(),
    check('direccion').isString(),
    check('telefono').isString(),
    check('correo').isEmail()
  ],
   function(req, res) {
    let sql = "insert into  usuarios set ?"
    const fecha=new Date
    const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
    console.log('Registro recibido: ',req.body);
    let poststr = {
        documento: req.body.documento,
        nombres : req.body.nombres,
        apellidos: req.body.apellidos,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        correo: req.body.correo,
        modified: fecha
    }
    conexion.query(sql, poststr, function (error, results) {
    if (error) throw error;
    if (results.affectedRows) {
     res.json({status: 'Registro guardado'})
   }
   else
     res.json({status: 'No se pudo guardar'})
    
  });  
  })//End rutas.post
  
  //--actualizar
  rutas.put('/usuarios', function (req, res) {
    const fecha=new Date
  let sql = "update usuarios set documento= ?,nombres= ?,apellidos = ?,direccion =?, telefono = ?,correo= ?, modified = ? where id = ?"
    conexion.query(sql, [req.body.documento,req.body.nombres,req.body.apellidos,req.body.direccion,req.body.telefono,req.body.correo,fecha,req.body.id], function (error, results) {
       if (error) throw error;
       if (results.affectedRows) {
        res.json({status: 'Registro actualizado'})
      }
      else
        res.json({status: 'No se pudo actualizar'})
     });
  });
  
  
  
  //--eliminar
  //---- eliminar un registro
  rutas.delete('/usuarios/:id', function(req, res) {
    let sql ="delete from usuarios where id = ?"
    conexion.query(sql, [req.params.id], function (error, results) {
       if (error) throw error;
       if (results.affectedRows) {
         res.json({status: 'Registro eliminado'})
       }
       else
         res.json({status: 'No se pudo eliminar'})
     });
  })
  
  //--- Para exportar y se pueda usar en otro lado
  module.exports=rutas;
