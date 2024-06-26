const mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new mongoose.Schema({
  nom: { type: String},
  matricule: { type: String},
  tel: { type: String},
  image: { type: String, default: 'user.png' },
  DP:{ type: Boolean, default: false},

})

module.exports = mongoose.model('Employee', employeeSchema)
