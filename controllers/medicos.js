const { request, response } = require("express");

const Medico = require("../models/medico");

const getMedicos = async (req =request, res = response) => {
  try {
    const medicos = await Medico.find()
      .populate("usuario", "nombre email img")
      .populate("hospital", "nombre img");

    res.json({
      ok: true,
      medicos,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Hable con el Administrador...",
    });
  }
};

const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  try {
    const medico = new Medico({
      usuario: uid,
      ...req.body,
    });
    const medicoDB = await medico.save();
    res.json({
      ok: true,
      medico: medicoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el Administrador...",
    });
  }
};

const actualizarMedico = (req, res = response) => {
  res.json({
    ok: true,
    msg: "actualizarMedico",
  });
};

const eliminarMedico = (req, res = response) => {
  res.json({
    ok: true,
    msg: "eliminarMedico",
  });
};

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  eliminarMedico,
};
