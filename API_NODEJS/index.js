//para poder obtener los valores enviado en la api con req.body
var express = require('express') //llamamos a Express
//-- para recibir los parametros por get y/o post
const bodyParser = require('body-parser');
var app = express()
//para que los parametros los acepte en Json
app.use(bodyParser.json())              
var port = process.env.PORT || 8000  
app.set('port',port) // le pasamos el puerto en ejecucion

//-- para dar accesos desde cualquier servidor
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  //--- llamar a los controladores
 app.use('/',require('./controller/categoriasController'));
 app.use('/',require('./controller/editorialesController'));
 app.use('/',require('./controller/librosController'));
 app.use('/',require('./controller/pagosController'));
 app.use('/',require('./controller/prestamosController'));
 app.use('/',require('./controller/UsuarioController'));

//-----------------------------------------------------------
app.get('*', function(req, res){
    res.json({status: 'Pagina no encontrada 404!'})
    res.statusCode = 404;
  });

   // iniciamos nuestro servidor
// Starting the server
app.listen(app.get('port'),(err)=>{
    if(err){
        console.log('Error iniciando el Servidor: '+err)
    }
    else{
        console.log('Server is runing in port: http://localhost:'+port)
    }
  })
  
