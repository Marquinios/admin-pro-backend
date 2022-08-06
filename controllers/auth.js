const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar email
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        msg: "Email no valido",
      });
    }

    // Verificar constraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      res.status(404).json({
        ok: false,
        msg: "Contraseña no valida",
      });
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
};
