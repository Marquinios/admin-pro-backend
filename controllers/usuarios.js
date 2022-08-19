const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  console.log(desde);

  /*  const usuarios = await Usuario.find({}, "nombre email role google")
    .skip(desde)
    .limit(5);

const total = await Usuario.count();*/

  // Mejora
  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nombre email role google img").skip(desde).limit(5),
    Usuario.countDocuments(),
  ]);

  res.json({
    ok: true,
    usuarios,
    total,
  });
};

const crearUsuario = async (req, res = response) => {
  const { password, email } = req.body;
  console.log(email);
  try {
    const existeMail = await Usuario.findOne({ email });
    if (existeMail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar usuario
    await usuario.save();

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario.id);

    /**
     en la creación de todo nuevo registro en mongoose se añade automáticamente un id asociado. 
     El payload del token puede incluir menos o mas información, esto es opcional. Como mínimo el ID 
     para identificar el usuario, el profesor utiliza usuario.id porque así se identifica en el objeto.
     */

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  // TODO: validar token y comprobar si es el usuario correcto
  const uid = req.params.id;
  console.log(uid);

  try {
    const usuarioDB = await Usuario.findById(uid);
    console.log(usuarioDB);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese id",
      });
    }

    // se quita propiedades para que no las actualice
    const { password, google, email, ...campos } = req.body;
    // para evitar que que de problemas con el campo unico
    // TODO: el primer bloque ya no es necesario
    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese mail",
        });
      }
    }

    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario de Google no pueden cambiar su correo",
      });
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const eliminarUsuario = async (req, res = response) => {
  // TODO: validar token y comprobar si es el usuario correcto
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);
    console.log(usuarioDB);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese id",
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "Usuario eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
