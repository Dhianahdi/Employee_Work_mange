const Employee = require('../models/employee')
const moment = require('moment')
const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')
const EmployeePoints = require('../models/employeePoints');
const congeController = require('../controllers/congeController')

// Créer un employé
// Fonction pour générer une matricule aléatoire de 3 ou 4 chiffres
function generateMatricule() {
  const length = Math.floor(Math.random() * 2) + 3; // Génère 3 ou 4
  let matricule = '';
  for (let i = 0; i < length; i++) {
    matricule += Math.floor(Math.random() * 10);
  }
  return matricule;
}

// Fonction pour vérifier l'unicité de la matricule
async function getUniqueMatricule() {
  let isUnique = false;
  let newMatricule = '';
  while (!isUnique) {
    newMatricule = generateMatricule();
    const existingEmployee = await Employee.findOne({ matricule: newMatricule });
    if (!existingEmployee) {
      isUnique = true;
    }
  }
  return newMatricule;
}

exports.createEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee({
      ...req.body,
    });
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Obtenir tous les employés
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
    res.status(200).json(employees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Obtenir un employé par ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
    if (!employee) {
      return res.status(404).json({ message: 'Employé non trouvé' })
    }
    res.status(200).json(employee)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mettre à jour un employé par matricule
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { matricule: req.params.matricule },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Supprimer un employé par matricule
exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({ matricule: req.params.matricule });
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    res.status(200).json({ message: 'Employé supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Modifier le statut d'un employé par matricule
exports.toggleEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employee.findOne({ matricule: req.params.matricule });
    if (!employee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    // Inverser le statut de l'employé
    employee.status = employee.status === 'Active' ? 'noActive' : 'Active';
    
    // Sauvegarder les modifications
    await employee.save();

    res.status(200).json({ message: 'Statut de l\'employé modifié avec succès', newStatus: employee.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un employé par matricule
exports.getEmployeeByMatricule = async (req, res) => {
  try {
    const employee = await Employee.findOne({ matricule: req.params.matricule });
    if (!employee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getEmployeeByMatricule1() {
          
  const employee = await Employee.find();
     
  

      return employee;
    
  
}

const joursFeries = [
  '01/01', // Nouvel An
  '14/01', // Fête de la Révolution et de la Jeunesse
  '20/03', // Fête de l'Indépendance
  '09/04', // Journée des Martyrs
  '01/05', // Fête du Travail
  '25/07', // Fête de la République
  '13/08', // Fête de la Femme
  '15/10', // Fête de l'Évacuation
];

function calculateWorkingHours(points, length) {
  const format = 'HH:mm';
  const start1 = moment(points[0], format);
  const end1 = moment(points[1], format);

  if (length === 2) {
    // Si seulement 2 points de relevé, calculer la différence moins 1 heure
    const diff = end1.diff(start1, 'minutes') - 60;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  if (length === 3) {
    // Si 3 points de relevé, calculer la différence entre le premier et le dernier moins 1 heure
    const end = moment(points[2], format);
    const diff = end.diff(start1, 'minutes') - 60;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  // Si 4 points de relevé, calculer normalement
  const start2 = moment(points[2], format);
  const end2 = moment(points[3], format);

  const diff1 = end1.diff(start1, 'minutes');
  const diff2 = end2.diff(start2, 'minutes');

  const totalMinutes = diff1 + diff2;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

// Fonction pour convertir les minutes en format hh:mm
function convertMinutesToHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
}


exports.groupPointsByEmployee = async (req, res) => {
  const filePath = path.join(__dirname, '../file/test.json');
  const employees = await getEmployeeByMatricule1(); 

        if (employees === null) {
          console.error(`Employee not found for matricule: `);
    } 
  try {
    await EmployeePoints.deleteMany({});
    
  } catch (err) {
    console.error('Error clearing EmployeePoints collection:', err);
    return res.status(500).json({ error: 'Failed to clear EmployeePoints collection' });
  }

  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ error: 'Failed to read JSON file' });
    }

    try {
      let monthYear;
      const jsonData = JSON.parse(data); // Parse JSON data from file

      // Object to store grouped results
      const groupedResults = {};

      // Loop through JSON data
      jsonData.forEach( (item) => {
        const { Matricule, DateHeure } = item;
      
       
        

        // Extract the date part of DateHeure
        const datePart = moment(DateHeure, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD');
        const dayName = moment(DateHeure, 'DD/MM/YYYY HH:mm').format('dddd'); // Get the day name
         monthYear = moment(DateHeure, 'DD/MM/YYYY HH:mm').format('MM-YYYY'); // Get the month and year

        // Check if Matricule key exists in groupedResults
        if (!groupedResults[Matricule]) {
          groupedResults[Matricule] = {
            details: {},
            totalHeuresNormales: 0,
            totalHeuresSupplementaires: 0,
            totalHeuresSamedi: 0,
            totalHeuresDimanche: 0,
            absences: [], // Initialize absences array
            nbrAbsentParMois: new Map(),
            ponctualiteParMois: new Map(),
             retardParMois: new Map()

          };
        }

        // Check if datePart key exists in groupedResults[Matricule].details
        if (!groupedResults[Matricule].details[datePart]) {
          groupedResults[Matricule].details[datePart] = {
            points: [],
            jour: dayName,
            erreur: 'non', // Default to no error
            heuresTravail: 0,
            heuresNormales: 0,
            heuresSupplementaires: 0,
          };
        }

        // Add point time to groupedResults[Matricule].details[datePart].points
        groupedResults[Matricule].details[datePart].points.push(moment(DateHeure, 'DD/MM/YYYY HH:mm').format('HH:mm'));
      });

      // Remove points with <= 5 minutes difference and calculate working hours
      Object.keys(groupedResults).forEach(async (matricule) => {
             let mat = matricule+''
         if (mat.length === 2) {
  mat="0"+mat
}     if (mat.length === 1) {
  mat="00"+mat
        }

        const empdp = employees.find(employee => employee.matricule === mat);
        Object.keys(groupedResults[matricule].details).forEach(async (datePart) => {
        
          const points = groupedResults[matricule].details[datePart].points;
          const filteredPoints = [];

          for (let i = 0; i < points.length; i++) {

            if (i === 0 || moment(points[i], 'HH:mm').diff(moment(points[i - 1], 'HH:mm'), 'minutes') > 14) {

              filteredPoints.push(points[i]);
            }
          }

          groupedResults[matricule].details[datePart].points = filteredPoints;

          const dayName = groupedResults[matricule].details[datePart].jour;

          if (filteredPoints.length !== 4 && filteredPoints.length !== 3 && filteredPoints.length !== 2) {
            groupedResults[matricule].details[datePart].erreur = 'oui';
          } else {
            // Calculate working hours
            const heuresTravail = calculateWorkingHours(filteredPoints, filteredPoints.length);
            groupedResults[matricule].details[datePart].heuresTravail = heuresTravail;
       

            const [hours, minutes] = heuresTravail.split(':').map(Number);
            const totalMinutes = hours * 60 + minutes;
              let heuresSupplementaires = 0 ;

            if (totalMinutes > 540) { // More than 9 hours (540 minutes)
              groupedResults[matricule].details[datePart].heuresNormales = '8:00';
               heuresSupplementaires = totalMinutes - 480;
              groupedResults[matricule].details[datePart].heuresSupplementaires = `${Math.floor(heuresSupplementaires / 60)}:${(heuresSupplementaires % 60).toString().padStart(2, '0')}`;
            } else if (totalMinutes > 535 && totalMinutes <= 540) { // Between 8 and 9 hours (480-540 minutes)
              groupedResults[matricule].details[datePart].heuresNormales = '8:00';
              groupedResults[matricule].details[datePart].heuresSupplementaires = '1:00';
                             heuresSupplementaires = 60;

            } else {
              groupedResults[matricule].details[datePart].heuresNormales = heuresTravail;
              groupedResults[matricule].details[datePart].heuresSupplementaires = '0:00';
            }

            groupedResults[matricule].totalHeuresNormales += Math.min(totalMinutes, 480);
            groupedResults[matricule].totalHeuresSupplementaires += heuresSupplementaires;

            if (dayName === 'Saturday') {
              groupedResults[matricule].totalHeuresSamedi += totalMinutes;
            }
            if (dayName === 'Sunday') {
              groupedResults[matricule].totalHeuresDimanche += totalMinutes;
            }

            if (empdp) {
               if (empdp.DP == false) {

                 
                const arrivalTime = filteredPoints[0]; // Assuming the first point is the arrival time
                const arrivalMoment = moment(arrivalTime, 'HH:mm');
                const punctualityTime = moment('08:01', 'HH:mm');
                const tardinessTime = moment('08:12', 'HH:mm');

                if (arrivalMoment.isBefore(punctualityTime)) {
                  const ponctualite = groupedResults[matricule].ponctualiteParMois.get(monthYear) || 0;
                  groupedResults[matricule].ponctualiteParMois.set(monthYear, ponctualite + 1);
                } else if (arrivalMoment.isAfter(tardinessTime)) {
                  const retard = groupedResults[matricule].retardParMois.get(monthYear) || 0;
                  groupedResults[matricule].retardParMois.set(monthYear, retard + 1);
                }
            } else if ( empdp.DP == true ) {
             

                 const arrivalTime = filteredPoints[0]; // Assuming the first point is the arrival time
                const arrivalMoment = moment(arrivalTime, 'HH:mm');
                const punctualityTime = moment('07:00', 'HH:mm');
                const punctualityTimeR2 = moment('10:00', 'HH:mm');
                const punctualityTime0 = moment('06:00', 'HH:mm');
                const punctualityTime2 = moment('13:30', 'HH:mm');
                const tardinessTime = moment('7:12', 'HH:mm');
                const tardinessTime2 = moment('13:42', 'HH:mm');
                const punctualityTime02 = moment('12:00', 'HH:mm');

              if (arrivalMoment.isBetween(punctualityTime0, punctualityTime)) {
              
                  const ponctualite = groupedResults[matricule].ponctualiteParMois.get(monthYear) || 0;
                  groupedResults[matricule].ponctualiteParMois.set(monthYear, ponctualite + 1);
                } else if (arrivalMoment.isBetween(punctualityTime02, punctualityTime2)) {
                  const ponctualite = groupedResults[matricule].ponctualiteParMois.get(monthYear) || 0;
                  groupedResults[matricule].ponctualiteParMois.set(monthYear, ponctualite + 1);
                }else  if (arrivalMoment.isAfter(tardinessTime2)) {
                  const retard = groupedResults[matricule].retardParMois.get(monthYear) || 0;
                  groupedResults[matricule].retardParMois.set(monthYear, retard + 1);
                }else  if (arrivalMoment.isBetween(tardinessTime, punctualityTimeR2)) {
                  const retard = groupedResults[matricule].retardParMois.get(monthYear) || 0;
                  groupedResults[matricule].retardParMois.set(monthYear, retard + 1);
                }
               
               
              }
         }
        
          }
        });

        // Convert total minutes to hh:mm format
        groupedResults[matricule].totalHeuresNormales = convertMinutesToHours(groupedResults[matricule].totalHeuresNormales);
        groupedResults[matricule].totalHeuresSupplementaires = convertMinutesToHours(groupedResults[matricule].totalHeuresSupplementaires);
        groupedResults[matricule].totalHeuresSamedi = convertMinutesToHours(groupedResults[matricule].totalHeuresSamedi);
        groupedResults[matricule].totalHeuresDimanche = convertMinutesToHours(groupedResults[matricule].totalHeuresDimanche);

        // Detect absences
        const employeeDates = Object.keys(groupedResults[matricule].details);
        const allDates = [];

        for (let d = moment(employeeDates[0]); d.isBefore(moment(employeeDates[employeeDates.length - 1]).add(1, 'days')); d.add(1, 'days')) {
          if (d.day() !== 0 && d.day() !== 6 && !joursFeries.includes(d.format('YYYY-MM-DD')) && !employeeDates.includes(d.format('YYYY-MM-DD'))) {
            groupedResults[matricule].absences.push(d.format('YYYY-MM-DD'));

            // Update absences par mois
            const absenceMonth = d.format('MM-YYYY');
                

            
            const nbrAbsents = groupedResults[matricule].nbrAbsentParMois.get(absenceMonth) || 0;
            groupedResults[matricule].nbrAbsentParMois.set(absenceMonth, nbrAbsents + 1);
          }
          allDates.push(d.format('YYYY-MM-DD'));
        }
 
        // Convert Maps to plain objects for MongoDB storage
        groupedResults[matricule].nbrAbsentParMois = Object.fromEntries(groupedResults[matricule].nbrAbsentParMois);
        groupedResults[matricule].ponctualiteParMois = Object.fromEntries(groupedResults[matricule].ponctualiteParMois);

      });

      // Save results to the database
      for (let matricule in groupedResults) {
          let matr=matricule
        if (groupedResults.hasOwnProperty(matricule)) {
          const employeeData = groupedResults[matricule];
          for (let date in employeeData.nbrAbsentParMois) { 
            if (date) {
      if (matricule.length === 2) {
 matr ="0"+matricule
}     if (matricule.length === 1) {
    matr="00"+matricule
          }
const nbrabs = await congeController.getNombreConges(matr, date)
              console.log(nbrabs);
              console.log(matr);
              employeeData.nbrAbsentParMois[date]-=nbrabs
              
    
}

        
          }


          await EmployeePoints.updateOne(
            { matricule },
            { $set: employeeData },
            { upsert: true }
          );
          // Update employee with calculated values
          const { nbrAbsentParMois, ponctualiteParMois, retardParMois } = employeeData;
          const updateData = {
            nbrAbsentParMois,
            ponctualiteParMois,
            retardParMois
          };
          if (matricule.length === 2) {
  matricule="0"+matricule
}     if (matricule.length === 1) {
  matricule="00"+matricule
          }
          await Employee.updateOne(
            { matricule },
            { $set: updateData }
          );
        }
      }

      // Send JSON response with grouped and calculated data
      res.json(groupedResults);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.status(500).json({ error: 'Failed to parse JSON' });
    }
  });
};


// Helper functions
function calculateWorkingHours(points, length) {
  let startTime, endTime, midStartTime, midEndTime;

  if (length === 2) {
    [startTime, endTime] = points;
    return diffTime(startTime, endTime);
  } else if (length === 3) {
    [startTime, midStartTime, endTime] = points;
    return subtractOneHour(diffTime(startTime, endTime));
  } else if (length === 4) {
    [startTime, midStartTime, midEndTime, endTime] = points;
    return addTimes(diffTime(startTime, midStartTime), diffTime(midEndTime, endTime));
  }
  return '0:00';
}
function subtractOneHour(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = (hours * 60 + minutes) - 60;
  return convertMinutesToHours(totalMinutes);
}

function diffTime(start, end) {
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);

  let diff = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  if (diff < 0) diff += 24 * 60; // handle overnight times

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

function addTimes(time1, time2) {
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);

  const totalMinutes = (hours1 * 60 + minutes1) + (hours2 * 60 + minutes2);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

function convertMinutesToHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
}

function convertMinutesToHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
}


exports.createEmployeesFromList = async (req, res) => {
  const employeesData = [
    { matricule: '001', nom: 'KARIM AOUNI' },
    { matricule: '004', nom: 'AKARI SOFIENE' },
    { matricule: '005', nom: 'NESRINE BEN HAMMOUDA' },
    { matricule: '007', nom: 'AZAOUZI YAHYA' },
    { matricule: '008', nom: 'HAMDI HADDAR' },
    { matricule: '016', nom: 'ZOGHLAMI AHLEM' },
    { matricule: '029', nom: 'AMIN HAMDI' },
    { matricule: '031', nom: 'MOHAMED TAHRI' },
    { matricule: '035', nom: 'NIDHAL AZZABI' },
    { matricule: '038', nom: 'SARRA FELEH' },
    { matricule: '044', nom: 'BOTHEINA MECHRI' },
    { matricule: '047', nom: 'HIBA ALLAH NASRAOUI' },
    { matricule: '050', nom: 'IMEN HABLANI' },
    { matricule: '051', nom: 'RAMZI KHEMIRI' },
    { matricule: '054', nom: 'ABDELKADER SLITI' },
    { matricule: '060', nom: 'MOHAMED BOUHANI' },
    { matricule: '063', nom: 'AHMED AMINE CHAANBI' },
    { matricule: '070', nom: 'HACHEM DRIDI' },
    { matricule: '072', nom: 'MONTASSAR DAHMANI' },
    { matricule: '085', nom: 'YASSINE NOURI' },
    { matricule: '086', nom: 'WESSIM WESLATI' },
    { matricule: '087', nom: 'MOUNA HAWAMI' },
    { matricule: '089', nom: 'KHALIL KTHIRI' },
    { matricule: '090', nom: 'FADHEL CHAWALI' },
    { matricule: '091', nom: 'GHAYDEN BALTI' },
    { matricule: '555', nom: 'MABROUKA ARRAKI' },
    { matricule: '094', nom: 'MOHSEN CHERIF' },
    { matricule: '095', nom: 'CHAIMA GHIZAOUI' },
    { matricule: '096', nom: 'TROUDI MOUHIB' },
    { matricule: '097', nom: 'ABIDI WASSIM' },
    { matricule: '098', nom: 'HAITHEM THEMRI' },
    { matricule: '099', nom: 'FAKHREDDINE ZEWABI' },
    { matricule: '100', nom: 'NOUR SASSI' },
    { matricule: '101', nom: 'OMAR BEN HSAN' },
    { matricule: '102', nom: 'MOHAMED TAHER NAFATY' },
    { matricule: '103', nom: 'AMJED HABIBI' },
    { matricule: '104', nom: 'SAMI ZOGLAMI' },
    { matricule: '105', nom: 'INES MOUFID' },
    { matricule: '107', nom: 'OUMAIMA HAMMAMI' },
    { matricule: '108', nom: 'ABDELKADER ABIDI' },
    { matricule: '109', nom: 'AYARI ACHREF' },
    { matricule: '110', nom: 'ZERRAI KARIM' },
    { matricule: '111', nom: 'DHIA EDDINE HAJRI' },
    { matricule: '113', nom: 'REFKA BILEL' },
    { matricule: '114', nom: 'IKBEL ABIDI' },
    { matricule: '115', nom: 'SALHA MAAMOURI' },
  ];

  const errors = [];
  const successes = [];

  for (const employeeData of employeesData) {
    if (!employeeData.matricule) {
      errors.push({
        employee: employeeData,
        message: 'Matricule is null or undefined'
      });
      continue;
    }

    try {
      const existingEmployee = await Employee.findOne({ matricule: employeeData.matricule });
      if (existingEmployee) {
        errors.push({
          employee: employeeData,
          message: `Employee with matricule ${employeeData.matricule} already exists`
        });
      } else {
        const newEmployee = new Employee(employeeData);
        const savedEmployee = await newEmployee.save();
        successes.push(savedEmployee);
      }
    } catch (error) {
      errors.push({
        employee: employeeData,
        message: error.message
      });
    }
  }

  res.status(201).json({ successes, errors });
};



