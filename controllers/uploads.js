const path = require("path");
const fs = require("fs");

const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = async (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  const tiposValidos = ["hospitales", "usuarios", "medicos"];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: true,
      msg: "Tipo no valido",
    });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningun archivo",
    });
  }

  // Procesar la imagen...
  const file = req.files.imagen;
  console.log(file);

  const nombreCortado = file.name.split("."); // imagen.12.2.jpg
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];
  console.log(extensionArchivo);

  // Validar Extensión
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: "No es una extensión permitida",
    });
  }

  // Generar el nombre del archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

  const path = `./uploads/${tipo}/${nombreArchivo}`;

  // Path para guardar la imagen
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Error al mover la imagen",
      });
    }
  });

  await actualizarImagen(tipo, id, nombreArchivo);

  res.json({
    ok: true,
    msg: "Archivo subido",
    nombreArchivo,
  });
};

const retornaImagen = (req, res = response) => {
  const tipo = req.params.tipo;
  const foto = req.params.foto;

  let pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    // imagen por defecto
    pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
    res.sendFile(pathImg);
  }
};

module.exports = {
  fileUpload,
  retornaImagen,
};
