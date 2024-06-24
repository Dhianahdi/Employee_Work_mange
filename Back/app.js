const express = require('express');
const app = express();
const http = require('http');
const port = process.env.PORT || 5000;
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Import your routes
const employeeRoutes = require('./routes/employeeRoutes');
const employeePointsRoutes = require('./routes/employeePointsRoutes');
const authorizationRoutes = require('./routes/authorizationRoutes');
const employeeController=require("./controllers/employeeController")
// Create the server
const server = http.createServer(app);

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://monginahdi:123@cluster0.v0sfiro.mongodb.net/KMA')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log('Connexion à MongoDB échouée !', e));

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  })
);

// Set headers for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const imageUpload = multer({ storage: imageStorage });

// Configure multer for file uploads to the 'file' directory
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './file');
  },
  filename: function (req, file, cb) {
    cb(null, 'test.json');
  },
});

// Function to clear the file directory
const clearFileDirectory = () => {
  const directory = path.join(__dirname, 'file');
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
};


const fileUpload = multer({ storage: fileStorage });

// Endpoint for image uploads
app.post('/api/upload', imageUpload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Aucun fichier téléchargé.');
  }

  res.send({ filename: req.file.filename });
});

// Endpoint for file uploads to 'file' directory and renaming to 'test.js'
app.post('/api/upload-file', (req, res, next) => {
  clearFileDirectory();
  next();
}, fileUpload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Aucun fichier téléchargé.');
  }
  res.send({ message: 'Fichier téléchargé et renommé en test.js.' });
});
// Serve static files from the img directory
app.use('/img', express.static(path.join(__dirname, 'img')));

// Serve static files from the file directory
app.use('/file', express.static(path.join(__dirname, 'file')));

// Use routes
app.use('/api/employee', employeeRoutes);
app.use('/api/authorization', authorizationRoutes);
app.use('/api/employeePoints', employeePointsRoutes);

// Start the server
server.listen(port, () => {
  console.log('Listening on ' + port);
});

module.exports = app;
