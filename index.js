// Importaciones
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { dbConnecction } = require("./database/config");

// Iniciar servidor express
const app = express();

// Configurar CORS
app.use(cors());

// Iniciar conexión a Base de datos
dbConnecction();

// Punto de entrada al servidor
const httpServer = app.listen(process.env.PORT, () => {
  console.log(
    "HTPP Server running at http://localhost:" + httpServer.address().port
  );
});

// Endpoint
app.get("/", (req, res) => {
  res.status(500).json({
    ok: true,
    msg: "Hola mundo",
  });
});
