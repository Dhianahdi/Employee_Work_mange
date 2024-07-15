const express = require('express');
const app = express();
const mongoose  = require('mongoose');
const userRoutes= require ("./routes/user")
const pubRoutes= require ("./routes/publication")

mongoose.connect('mongodb://127.0.0.1:27017/DsNode')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log('Connexion à MongoDB échouée !',e));

  
app.use(express.json());



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


  app.use("/api/user", userRoutes)
  app.use("/api/Pub", pubRoutes)




module.exports = app;