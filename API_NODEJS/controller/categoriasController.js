const conexion = require('../config/conexion');
var express = require('express') //llamamos a Express
var rutas = express()
const { check, validationResult } = require('express-validator');

 //--- define las rutas de la API
// se puede probar con Postman
//http://localhost:8000/
rutas.get('/', function(req, res) {
    res.json({ mensaje: '¡Hola Mundo!' })  
  })
  
  //http://localhost:8000/categorias
   rutas.get('/categorias', function(req, res) {
    //res.json({ mensaje: '¡Listando registros!' })  
    let sql="select * from categorias order by id"
   conexion.query(sql,(err,rows)=>{
       if(err) throw err;
       else{
           res.json(rows)
       }
   })
  
  })//endget
  
  //-- Obtiene un conductor especifico 
  //---- get one user
  //http://localhost:8000/usuarios/5
  rutas.get('/categorias/:id',check('id').isNumeric().withMessage('Debe digitar un numero'), function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    conexion.query("select * from categorias where id = ?", [req.params.id],(err,rows)=>{
        if(err) throw err;
        else{
            res.json(rows)
        }
    })
   })
  
  
  //--- listar usuarios
  //--guardar
  //-- Insertar un usuario
  rutas.post('/categorias',check('nombre').
  isLength({ min: 3 }).withMessage('Digiste nombre de una categoria valido') ,function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    let sql = "insert into  categorias set ?"
    const fecha=new Date
    console.log('Registro recibido: ',req.body);
    let poststr = {
        nombre: req.body.nombre,
        created:fecha,
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
  rutas.put('/categorias',[
    check('id').isNumeric().withMessage('Debe digitar un numero'),
    check('nombre').
    isLength({ min: 3 }).withMessage('Digiste nombre de una categoria valido')
   
  ] ,function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const fecha=new Date
  let sql = "update categorias set nombre= ?, modified = ? where id = ?"
    conexion.query(sql, [req.body.nombre,fecha,req.body.id], function (error, results) {
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
  rutas.delete('/categorias/:id',check('id').isNumeric().withMessage('Debe digitar un numero'), function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    let sql ="delete from categorias where id = ?"
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
