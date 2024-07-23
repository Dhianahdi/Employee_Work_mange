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
// Create the server
const server = http.createServer(app)

// SQL Server configuration
var config = {
    user: "sa", // Database username
    password: "1920", // Database password
    server: "LAPTOP-P1H9QAET", // Server name and instance (if any)
    database: "KTN_System2", // Database name
  options: {
            trustServerCertificate: true, // Autoriser le certificat non approuvé (pour développement seulement)

        trustedConnection: true,
        encrypt: false, // Disable encryption
        enableArithAbort: true // Enable arithabort to avoid certain types of errors
    },
    port: 1433 // Ensure this is the correct port
};


sql.connect(config, err => {
    if (err) {
        console.error("Erreur de connexion à SQL Server:", err.message);
    } else {
        console.log("Connexion réussie à SQL Server !");
    }
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
// Augmentez la limite de taille des charges utiles de requête
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

let receivedChunks = [];

app.post('/api/saveJsonData', (req, res) => {
  const jsonData = req.body;

  receivedChunks.push(jsonData);

  if (receivedChunks.length === 3) {
    const combinedData = [].concat(...receivedChunks);
    const filePath = path.join(__dirname, './file/test.json');
        console.log(combinedData);

    fs.writeFile(filePath, JSON.stringify(combinedData, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
        res.status(500).json({ error: 'Failed to save JSON data' });
      } else {
        console.log('JSON data saved successfully');
        res.json({ message: 'JSON data saved successfully' });
      }
      receivedChunks = []; // Reset the chunks
    });
  } else {
    res.json({ message: 'Chunk received, waiting for more chunks' });
  }
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



app.get('/api/fiche_conformite', async (req, res) => {
    try {
        await sql.connect(config);
        
        const result = await sql.query('SELECT  * FROM Fiche_Conformité_tbl');
        
        res.json(result.recordset);
    } catch (err) {
        console.error('Erreur de connexion ou de requête : ', err);
        res.status(500).send('Erreur serveur');
    }
});

const moment = require('moment');  // Assurez-vous que moment.js est installé



app.post('/api/fiche_conformitestats', async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const twentyFourHoursAgo = moment(startDate, 'YYYY-MM-DD').subtract(24, 'hours').format('YYYY-MM-DD');
        const currentYear = moment().year();

        // Requête pour la somme de Quantite_total groupée par Nom et Date pour aujourd'hui
        const resultQuantite = await sql.query(`
            SELECT Nom, SUM(Quantite_total) AS Quantite_total_somme
            FROM Fiche_Conformité_tbl
            WHERE CONVERT(DATE, Date) BETWEEN '${twentyFourHoursAgo}' AND '${endDate}'
            GROUP BY Nom
        `);

        // Requête pour compter les occurrences de etatpiece (conforme et non conforme) pour aujourd'hui
        const resultEtatPiece = await sql.query(`
            SELECT 
                COUNT(CASE WHEN etatpiece = 'conforme' THEN 1 END) AS count_etatpiece_conforme,
                COUNT(CASE WHEN etatpiece = 'non conforme' THEN 1 END) AS count_etatpiece_non_conforme
            FROM Fiche_Conformité_tbl
            WHERE CONVERT(DATE, Date) BETWEEN '${twentyFourHoursAgo}' AND '${endDate}'
        `);

        // Requête pour compter les occurrences de Statut (Modification et Nouveau) pour aujourd'hui
        const resultStatut = await sql.query(`
            SELECT 
                COUNT(CASE WHEN Statut = 'Modification' THEN 1 END) AS count_statut_modification,
                COUNT(CASE WHEN Statut = 'Nouveau' THEN 1 END) AS count_statut_nouveau
            FROM Fiche_Conformité_tbl
            WHERE CONVERT(DATE, Date) BETWEEN '${twentyFourHoursAgo}' AND '${endDate}'
        `);

        // Requête pour le nombre d'etatpiece = 'non conforme' groupé par mois et machine pour l'année en cours
        const resultNonConformePerMonth = await sql.query(`
            SELECT 
                Machine, 
                MONTH(Date) AS Month, 
                COUNT(*) AS count_non_conforme
            FROM Fiche_Conformité_tbl
            WHERE YEAR(Date) = ${currentYear} AND etatpiece = 'non conforme'
            GROUP BY Machine, MONTH(Date)
            ORDER BY Machine, Month
        `);

        // Requête pour le nombre d'occurrences groupées par le premier caractère de PM
        const resultMachineCount = await sql.query(`
            SELECT 
                CASE 
                    WHEN LEFT([PM], 1) IN ('L', 'l', '2') THEN 'CMX_650_V'
                    ELSE 'Haas_VF2_SS'
                END AS Machine,
                MONTH(Date) AS Month,
                COUNT(*) AS count_non_conforme
            FROM Tableau_NC
            WHERE YEAR(Date) = ${currentYear}
            GROUP BY 
                CASE 
                    WHEN LEFT([PM], 1) IN ('L', 'l', '2') THEN 'CMX_650_V'
                    ELSE 'Haas_VF2_SS'
                END,
                MONTH(Date)
            ORDER BY Machine, Month
        `);

        res.json({
            quantiteParNom: resultQuantite.recordset,
            countParEtatPiece: resultEtatPiece.recordset,
            countParStatut: resultStatut.recordset,
            nonConformePerMonth: resultNonConformePerMonth.recordset,
            machineCount: resultMachineCount.recordset
        });
    } catch (err) {
        console.error('Erreur de connexion ou de requête : ', err);
        res.status(500).send('Erreur serveur');
    }
});










// Start the server
server.listen(port, () => {
  console.log('Listening on ' + port)
})



// async function deleteHighQuantities() {
//   try {
//     // Connect to the database
//     let pool = await sql.connect(config);

//     // Update query to remove spaces from the 'Nom' column
//     let result = await pool.request().query(`
//     DELETE FROM [Fiche_Conformité_tbl] WHERE Quantite_total > 150;
//     `);

// console.log(`Deleted ${result.affectedRows} rows`);
//   } catch (err) {
//     console.error('Error executing the query:', err);
//   }
// }


// deleteHighQuantities();








// async function updateNames() {
//   try {
//     // Connect to the database
//     let pool = await sql.connect(config);

//     // Update query to remove spaces from the 'Nom' column
//     let result = await pool.request().query(`
//       UPDATE Fiche_Conformité_tbl
//       SET Nom = REPLACE(Nom, ' ', '');
//     `);

//     console.log('Spaces removed successfully from the "Nom" column');
//   } catch (err) {
//     console.error('Error executing the query:', err);
//   }
// }


// updateNames();


// async function fixDateFormats() {
// try {
//     // Connect to the database
//     let pool = await sql.connect(config);

//     // Select the dates from the table starting from a specific ID
//     let result = await pool.request().query(`
//       SELECT id, Date
//       FROM Fiche_Conformité_tbl
//       WHERE id >= 77449
//     `);

//     for (let row of result.recordset) {
//       let { id, Date } = row;

//       // Check if the date is in "YYYY-DD-MM" format
//       if (moment(Date, 'YYYY-DD-MM', true).isValid()) {
//         let correctedDate = moment(Date, 'YYYY-DD-MM').format('YYYY-DD-MM');

//         // Update the date in the database
//         await pool.request()
//           .input('id', sql.Int, id)
//           .input('correctedDate', sql.VarChar, correctedDate)
//           .query(`
//             UPDATE Fiche_Conformité_tbl
//             SET Date = @correctedDate
//             WHERE id = @id
//           `);

//         console.log(`Updated date for id ${id}: ${moment(Date, 'YYYY-DD-MM').format('YYYY-DD-MM')} -> ${correctedDate}`);
//       }
//     }
//   } catch (err) {
//     console.error('Error executing the query:', err);
//   }
// }



// fixDateFormats();












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
