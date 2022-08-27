/**
 * Ruta : /api/medicos
 */

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  getMedicos,
  getMedicoById,
  crearMedico,
  actualizarMedico,
  eliminarMedico,
} = require("../controllers/medicos");

const router = Router();

router.get("/", validarJWT, getMedicos);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es necesario").not().isEmpty(),
    //check("hospital", "El medico es necesario").not().isEmpty(),
    check("hospital", "El medico es necesario").isMongoId(),
    validarCampos,
  ],
  crearMedico
);

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es necesario").not().isEmpty(),
    check("hospital", "El medico es necesario").isMongoId(),
    validarCampos,
  ],
  actualizarMedico
);

router.delete("/:id", validarJWT, eliminarMedico);

router.get("/:id", validarJWT, getMedicoById);

module.exports = router;
