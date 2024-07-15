const express = require('express')
const app = express()
const http = require('http')
const port = process.env.PORT || 5000
const multer = require('multer')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const sql = require("mssql");

// Import your routes
const employeeRoutes = require('./routes/employeeRoutes')
const employeePointsRoutes = require('./routes/employeePointsRoutes')
const authorizationRoutes = require('./routes/authorizationRoutes')
const congeRoutes = require('./routes/congeRoutes')
const employeeController = require('./controllers/employeeController')
// Create the server
const server = http.createServer(app)

// SQL Server configuration
var config = {
    user: "sa", // Database username
    password: "1920", // Database password
    server: "LAPTOP-P1H9QAET", // Server name and instance (if any)
    database: "usinage", // Database name
  options: {
            trustServerCertificate: true, // Autoriser le certificat non approuvé (pour développement seulement)

        trustedConnection: true,
        encrypt: false, // Disable encryption
        enableArithAbort: true // Enable arithabort to avoid certain types of errors
    },
    port: 1433 // Ensure this is the correct port
};


// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});







// Connect to MongoDB
mongoose
  .connect('mongodb+srv://monginahdi:123@cluster0.v0sfiro.mongodb.net/KMA')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log('Connexion à MongoDB échouée !', e))

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: '*',
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  }),
)

// Set headers for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  )
  next()
})

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extname = path.extname(file.originalname)
    cb(null, uniqueSuffix + extname)
  },
})

const imageUpload = multer({ storage: imageStorage })

// Configure multer for file uploads to the 'file' directory
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './file')
  },
  filename: function (req, file, cb) {
    cb(null, 'test.json')
  },
})

// Function to clear the file directory
const clearFileDirectory = () => {
  const directory = path.join(__dirname, 'file')
  fs.readdir(directory, (err, files) => {
    if (err) throw err

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err
      })
    }
  })
}

const fileUpload = multer({ storage: fileStorage })

// Endpoint for image uploads
app.post('/api/upload', imageUpload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Aucun fichier téléchargé.')
  }

  res.send({ filename: req.file.filename })
})
app.post('/api/saveJsonData', (req, res) => {
  const jsonData = req.body;
  const filePath = path.join(__dirname, './file/test.json');

  fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
      res.status(500).json({ error: 'Failed to save JSON data' });
    } else {
      console.log('JSON data saved successfully');
      res.json({ message: 'JSON data saved successfully' });
    }
  });
});
// Endpoint for file uploads to 'file' directory and renaming to 'test.js'
app.post(
  '/api/upload-file',
  (req, res, next) => {
    clearFileDirectory()
    next()
  },
  fileUpload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send('Aucun fichier téléchargé.')
    }
    res.send({ message: 'Fichier téléchargé et renommé en test.js.' })
  },
)
// Serve static files from the img directory
app.use('/img', express.static(path.join(__dirname, 'img')))

// Serve static files from the file directory
app.use('/file', express.static(path.join(__dirname, 'file')))

// Use routes
app.use('/api/employee', employeeRoutes)
app.use('/api/authorization', authorizationRoutes)
app.use('/api/employeePoints', employeePointsRoutes)
app.use('/api/conge', congeRoutes)

// Start the server
server.listen(port, () => {
  console.log('Listening on ' + port)
})
const Employee = require('./models/employee'); // Assurez-vous de spécifier le chemin correct vers votre modèle


// const addDPAttributeToAllEmployees = async () => {
//   try {
//     // Mettre à jour tous les documents pour ajouter le nouvel attribut DP avec la valeur par défaut false
//     await Employee.updateMany({}, { $set: { tel: "000000" } });
//     console.log('Tous les employés ont été mis à jour avec le nouvel attribut DP.');
//   } catch (err) {
//     console.error('Erreur lors de la mise à jour des employés:', err);
//   }
// };
//addDPAttributeToAllEmployees();




// const updateEmployees = async () => {
//   try {
 

//     // Obtenir tous les employés
//     const employees = await Employee.find({});

//     // Parcourir chaque employé et mettre à jour les champs
//     for (const employee of employees) {
//       employee.hiredate = employee.hiredate || '2023-01-01';
//       employee.status = employee.status || 'Active';
//       employee.department = employee.department || 'General';
        
//       // Assurez-vous que nbrAbsentParMois et ponctualiteParMois sont initialisés en tant que Map
//       if (!employee.nbrAbsentParMois) {
//         employee.nbrAbsentParMois = new Map();
//       }
//       if (!employee.ponctualiteParMois) {
//         employee.ponctualiteParMois = new Map();
//       }   if (!employee.retardParMois) {
//         employee.retardParMois = new Map();
//       }
      
//       // Ajouter des valeurs pour chaque mois de l'année pour nbrAbsentParMois et ponctualiteParMois
//       const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
//       for (const month of months) {
//         if (!employee.nbrAbsentParMois.has(month)) {
//           employee.nbrAbsentParMois.set(month, 0);
//         }
//         if (!employee.ponctualiteParMois.has(month)) {
//           employee.ponctualiteParMois.set(month, 0);
//         }  if (!employee.retardParMois.has(month)) {
//           employee.retardParMois.set(month, 0);
//         }
//       }

//       // Sauvegarder les modifications pour chaque employé
//       await employee.save();
//     }

//     console.log('Tous les employés ont été mis à jour avec succès.');
//   } catch (error) {
//     console.error('Erreur lors de la mise à jour des employés:', error);
//   } 



// };
//   updateEmployees();

module.exports = app
