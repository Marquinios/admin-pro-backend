// Importaciones (variables de entorno)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { dbConnecction } = require("./database/config");

// Iniciar servidor express
const app = express();

// Configurar CORS
app.use(cors());

// Carpeta pública
app.use(express.static("public"));

// Permite recibir parametros en formato JSON
app.use(express.json());

// Iniciar conexión a Base de datos
dbConnecction();

// Punto de entrada al servidor
const httpServer = app.listen(process.env.PORT, () => {
  console.log(
    "HTPP Server running at http://localhost:" + httpServer.address().port
  );
});

// Rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/hospitales", require("./routes/hospitales"));
app.use("/api/medicos", require("./routes/medicos"));
app.use("/api/todo", require("./routes/busquedas"));
app.use("/api/uploads", require("./routes/uploads"));
app.use("/api/login", require("./routes/auth"));
