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
  
  //http://localhost:8000/pagos
   rutas.get('/pagos', function(req, res) {
    //res.json({ mensaje: '¡Listando registros!' })  
    let sql="select * from pagos order by id"
   conexion.query(sql,(err,rows)=>{
       if(err) throw err;
       else{
           res.json(rows)
       }
   })
  
  })//endget
  
  //-- Obtiene un usuario especifico 
  //---- get one user
  //http://localhost:8000/pagos/5
  rutas.get('/pagos/:id',check('id').isNumeric().withMessage('Debe digitar un numero') ,function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    conexion.query("select * from pagos where id = ?", [req.params.id],(err,rows)=>{

        if(err) throw err;
        else{
            res.json(rows)
        }
    })
   })
  
  
  //--- listar pagos
  //--guardar
  //-- Insertar un usuario
  rutas.post('/pagos',  [
    check('fecha').isDate().withMessage('Digiste fecha  invalido'),
    check('concepto').
    isLength({ min: 2 }).withMessage('Digiste concepto invalido'),
    check('valor').isNumeric().withMessage('Debe valor debe ser numero'),
    check('usuarios_id').isNumeric().withMessage('Debe usuarios_id debe ser numero')


  ],function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    let sql = "insert into  pagos set ?"
    const fecha=new Date
    console.log('Registro recibido: ',req.body);
    let poststr = {
        fecha: req.body.fecha,
        concepto : req.body.concepto,
        valor: req.body.valor,
        usuarios_id: req.body.usuarios_id,
        
        created: fecha,
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
  rutas.put('/pagos', [
    check('id').isNumeric().withMessage('Debe digitar un numero'),
    check('fecha').isDate().withMessage('Digiste fecha  invalido'),
    check('concepto').
    isLength({ min: 2 }).withMessage('Digiste concepto invalido'),
    check('valor').isNumeric().withMessage('Debe valor debe ser numero'),
    check('usuarios_id').isNumeric().withMessage('Debe usuarios_id debe ser numero')


  ] ,function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    const fecha=new Date
  let sql = "update pagos set fecha= ?,valor= ?,concepto = ?,usuarios_id =?, modified = ? where id = ?"
    conexion.query(sql, [req.body.fecha,req.body.valor,req.body.concepto,req.body.usuarios_id,fecha,req.body.id], function (error, results) {
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
  rutas.delete('/pagos/:id',check('id').isNumeric().withMessage('Debe digitar un numero') , function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    let sql ="delete from pagos where id = ?"
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
