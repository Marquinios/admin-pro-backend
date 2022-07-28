const mongoose = require("mongoose");

const dbConnecction = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);
    console.log("BD online...");
  } catch (error) {
    console.log(error);
    throw new Error("Error de conexión a la BD...");
  }
};

module.exports = {
  dbConnecction,
};
