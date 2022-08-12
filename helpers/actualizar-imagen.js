const fs = require("fs");

const Hospital = require("../models/hospital");
const Medico = require("../models/medico");
const Usuario = require("../models/usuario");

const borrarImagen = (tipo, nombreArchivo) => {
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  if (fs.existsSync(path)) {
    // borrar la imagen anterior
    fs.unlinkSync(path);
  }
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
  console.log("vamos bien");

  switch (tipo) {
    case "medicos":
      const medico = await Medico.findById(id);
      console.log(medico);
      if (!medico) {
        console.log("No es un medico por id");
        return false;
      }

      borrarImagen(tipo, medico.img);

      medico.img = nombreArchivo;
      await medico.save();

      return true;

      break;

    case "hospitales":
      const hospital = await Hospital.findById(id);
      console.log(hospital);
      if (!hospital) {
        console.log("No es un hospital por id");
        return false;
      }

      borrarImagen(tipo, hospital.img);

      hospital.img = nombreArchivo;
      await hospital.save();

      return true;

      break;

    case "usuarios":
      const usuario = await Usuario.findById(id);
      console.log(usuario);
      if (!usuario) {
        console.log("No es un usuario por id");
        return false;
      }

      borrarImagen(tipo, usuario.img);

      usuario.img = nombreArchivo;
      await usuario.save();

      return true;

      break;

    default:
      break;
  }
};

module.exports = {
  actualizarImagen,
};
