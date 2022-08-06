const { response } = require("express");
const { validationResult } = require("express-validator");

const validarCampos = (req, res = response, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errores.mapped(), // mepped(), solo retorna los objetos del array
    });
  }

  next();
};

module.exports = {
  validarCampos,
};
