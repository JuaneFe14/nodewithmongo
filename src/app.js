//El m�dulo path proporciona utilidades para trabajar con rutas de archivos y directorios
const path = require("path");
const express = require("express");
/*
Manejo de middleware con express
npm install morgan --save
Morgan es un modulo (middleware) que permite mostrar por consola lo que las aplicaciones clientes van pidiendo
*/
const morgan = require("morgan");
/*
Mongoose es una biblioteca de JavaScript que le permite definir esquemas con datos 
fuertemente tipados. Una vez que se define un esquema, 
Mongoose le permite crear un Modelo basado en un esquema espec�fico. 
Un modelo de mongoose se asigna a un documento MongoDB a trav�s de la 
definici�n del esquema del modelo.
Instalaci�n: npm install mongoose --save
 */
const mongoose = require("mongoose");

const app = express();

// Conexi�n a la base de datos de MongoDB

mongoose
  .connect("mongodb://127.0.0.1:27017/dbtasks")
  .then((db) => console.log("Database MongoDB - dbtasks connected"))
  .catch((err) => console.log(err));

// Importando rutas
const indexRoutes = require("./routes/index");

// Configuraci�n de variables a trav�s de app.set (settings)
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));

/*
Motor de plantillas ejs (otro es pug, por ejemplo)
$ npm install ejs*/
app.set("view engine", "ejs");

// middlewares: Modulos instalados para funciones que se ejecutan antes de ingresar a las rutas
/*
Salida concisa coloreada por estado de respuesta para uso en desarrollo. 
El :status token ser� de color verde para los c�digos de �xito, 
rojo para los c�digos de error del servidor, 
amarillo para los c�digos de error del cliente, 
cian para los c�digos de redirecci�n y sin color para los c�digos de informaci�n.
*/
app.use(morgan("dev"));
//app.use(express.json());
//app.use(express.urlencoded({extended: false}));// reconocimiento de formato json
app.use(express.urlencoded()); // parsear a formato de json
// routes
app.use("/", indexRoutes);

app.listen(app.get("port"), () => {
  console.log(`http://localhost:${app.get("port")}`);
});
