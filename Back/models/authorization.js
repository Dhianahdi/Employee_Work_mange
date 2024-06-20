const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorizationSchema = new mongoose.Schema(
  {
    matricule: { type: String, required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Authorization", authorizationSchema);
