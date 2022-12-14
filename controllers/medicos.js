const { request, response } = require("express");
const { findById } = require("../models/medico");

const Medico = require("../models/medico");

const getMedicos = async (req = request, res = response) => {
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

const getMedicoById = async (req = request, res = response) => {
  const id = req.params.id;

  try {
    const medico = await Medico.findById(id)
      .populate("usuario", "nombre email img")
      .populate("hospital", "nombre img");

    if (!medico) {
      res.status(404).json({
        ok: false,
        msg: "No se encontro el medico",
      });
    }

    res.json({
      ok: true,
      medico,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
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

const actualizarMedico = async (req, res = response) => {
  const uid = req.uid;
  const id = req.params.id;
  try {
    const medicoDB = await Medico.findById(id);

    if (!medicoDB) {
      return res.status(404).json({
        ok: false,
        msg: "Medico no encontrado por id",
      });
    }

    const cambiosMedico = {
      ...req.body,
      usuario: uid,
    };

    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      cambiosMedico,
      { new: true }
    );

    res.json({
      ok: true,
      medico: medicoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarMedico = async (req, res = response) => {
  const id = req.params.id;
  try {
    const medicoDB = await Medico.findById(id);

    if (!medicoDB) {
      return res.status(404).json({
        ok: false,
        msg: "Medico no encontrado por id",
      });
    }

    await Medico.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Medico eliminado",
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
  getMedicos,
  getMedicoById,
  crearMedico,
  actualizarMedico,
  eliminarMedico,
};
