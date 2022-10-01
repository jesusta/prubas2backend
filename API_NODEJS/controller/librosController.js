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
  
  //http://localhost:8000/usuarios
   rutas.get('/libros', function(req, res) {
    //res.json({ mensaje: '¡Listando registros!' })  
    let sql="select * from libros order by id"
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
  rutas.get('/libros/:id',check('id').isNumeric().withMessage('Debe digitar un numero'), function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    conexion.query("select * from libros where id = ?", [req.params.id],(err,rows)=>{
        if(err) throw err;
        else{
            res.json(rows)
        }
    })
   })
  
  
  //--- listar usuarios
  //--guardar
  //-- Insertar un usuario
  rutas.post('/libros', [
    check('titulo').
    isLength({ min: 2 }).withMessage('Digiste titulo  invalido'),
    check('descripcion').
    isLength({ min: 2 }).withMessage('Digiste descripcion invalido'),
    check('precio').isNumeric().withMessage('Debe precio debe ser numero'),
    check('ejemplares').isNumeric().withMessage('Debe ejemplares debe ser numero'),
    check('autor').isLength({ min: 1 }).withMessage('Debe dijitar un autor'),
    check('editoriales_id').isNumeric().withMessage('Debe editoriales_id debe ser numero'),
    check('categorias_id').isNumeric().withMessage('Debe categorias_id debe ser numero')

  ],function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    let sql = "insert into libros set ?"
    const fecha=new Date
    console.log('Registro recibido: ',req.body);
    let poststr = {

        
        titulo   : req.body.titulo,
        descripcion: req.body.descripcion,
        ejemplares: req.body.ejemplares,
        autor: req.body.autor,
        editoriales_id: req.body.editoriales_id,
        categorias_id: req.body.categorias_id,
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
  rutas.put('/libros', [
    check('titulo').
    isLength({ min: 2 }).withMessage('Digiste titulo  invalido'),
    check('descripcion').
    isLength({ min: 2 }).withMessage('Digiste descripcion invalido'),
    check('precio').isNumeric().withMessage('Debe precio debe ser numero'),
    check('ejemplares').isNumeric().withMessage('Debe ejemplares debe ser numero'),
    check('autor').isLength({ min: 1 }).withMessage('Debe dijitar un autor'),
    check('editoriales_id').isNumeric().withMessage('Debe editoriales_id debe ser numero'),
    check('categorias_id').isNumeric().withMessage('Debe categorias_id debe ser numero')

  ] ,function (req, res) {
    const fecha=new Date
  let sql = "update libros set titulo= ?,descripcion = ?, precio=?,ejemplares = ?, autor=?,editoriales_id=?, categorias_id=? ,modified = ? where id = ?"
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  } 
  conexion.query(sql, [req.body.titulo,req.body.descripcion,req.body.precio,req.body.ejemplares,req.body.autor,req.body.editoriales_id,req.body.categorias_id,fecha,req.body.id], function (error, results) {
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
  rutas.delete('/libros/:id',check('id').isNumeric().withMessage('Debe digitar un numero'), function(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    let sql ="delete from libros where id = ?"
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