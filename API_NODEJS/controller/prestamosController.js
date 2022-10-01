const conexion = require('../config/conexion');
var express = require('express') //llamamos a Express
var rutas = express()
const { check, validationResult } = require('express-validator');

//--- define las rutas de la API
// se puede probar con Postman
//http://localhost:8000/
rutas.get('/', function (req, res) {
  res.json({ mensaje: '¡Hola Mundo!' })
})

//http://localhost:8000/usuarios
rutas.get('/prestamos' , function (req, res) {
  //res.json({ mensaje: '¡Listando registros!' })  
  

  let sql = "select * from prestamos order by id"
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    else {
      res.json(rows)
    }
  })

})//endget

//-- Obtiene un usuario especifico 
//---- get one user
//http://localhost:8000/usuarios/5
rutas.get('/prestamos/:id',check('id').isNumeric().withMessage('Debe digitar un numero'), function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  conexion.query("select * from prestamos where id = ?", [req.params.id], (err, rows) => {

    if (err) throw err;
    else {
      res.json(rows)
    }
  })
})

rutas.get('/prestamos_usuario/:id',check('id').isNumeric().withMessage('Debe digitar un numero'), function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  conexion.query("select * from prestamos where usuarios_id	= ?", [req.params.id], (err, rows) => {

    if (err) throw err;
    else {
      res.json(rows)
    }
  })
})
rutas.get('/prestamos_destalle/:id',check('id').isNumeric().withMessage('Debe digitar un numero'), function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  conexion.query("SELECT detalles.id,libros.titulo,libros.precio FROM detalles INNER join libros on detalles.libros_id  =libros.id  where prestamos_id	= ?", [req.params.id], (err, rows) => {

    if (err) throw err;
    else {
      res.json(rows)
    }
  })
})


//--- listar usuarios
//--guardar
//-- Insertar un usuario

rutas.post('/prestamos', [
  check('fecha').isDate().withMessage('Digiste fecha  invalido'),
  check('devolucion').isDate().withMessage('Digiste fecha  invalido para devolucion'),
  check('entrega').isDate().withMessage('Digiste fecha  invalido para entrega'),
  check('usuarios_id').isNumeric().withMessage('Debe usuarios_id debe ser numero')

],function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  let sql = "insert into prestamos set ?"
  const fecha = new Date
  console.log('Registro recibido: ', req.body);
  let poststr = {

    fecha: req.body.fecha,
    devolucion: req.body.devolucion,
    entrega: req.body.entrega,
    created: fecha,
    modified: fecha,
    usuarios_id: req.body.usuarios_id
  }
  conexion.query(sql, poststr, function (error, results) {
    if (error) throw error;
    if (results.affectedRows) {
      res.json({ status: 'Registro guardado' })
    }
    else
      res.json({ status: 'No se pudo guardar' })

  });
})//End rutas.post

//--actualizar
rutas.put('/prestamos',  [
  check('id').isNumeric().withMessage('Debe digitar un numero') ,
  check('fecha').isDate().withMessage('Digiste fecha  invalido'),
  check('devolucion').isDate().withMessage('Digiste fecha  invalido para devolucion'),
  check('entrega').isDate().withMessage('Digiste fecha  invalido para entrega'),
  check('usuarios_id').isNumeric().withMessage('Debe usuarios_id debe ser numero')

],function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  const fecha = new Date
  let sql = "update prestamos set fecha= ?,devolucion = ?,entrega=?,usuarios_id=? ,modified = ? where id = ?"
  conexion.query(sql, [req.body.fecha, req.body.devolucion,req.body.entrega,req.body.usuarios_id,fecha, req.body.id], function (error, results) {
    if (error) throw error;
    if (results.affectedRows) {
      res.json({ status: 'Registro actualizado' })
    }
    else
      res.json({ status: 'No se pudo actualizar' })
  });
});



//--eliminar
//---- eliminar un registro
rutas.delete('/prestamos/:id',check('id').isNumeric().withMessage('Debe digitar un numero')  ,function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  let sql = "delete from prestamos where id = ?"
  conexion.query(sql, [req.params.id], function (error, results) {
    if (error) throw error;
    if (results.affectedRows) {
      res.json({ status: 'Registro eliminado' })
    }
    else
      res.json({ status: 'No se pudo eliminar' })
  });
})

//--- Para exportar y se pueda usar en otro lado
module.exports = rutas;