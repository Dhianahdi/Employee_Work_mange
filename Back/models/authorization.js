const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorizationSchema = new mongoose.Schema(
  {
    idEmployee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Authorization", authorizationSchema);
