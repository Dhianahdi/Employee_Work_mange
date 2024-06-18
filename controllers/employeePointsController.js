const EmployeePoints = require('../models/employeePoints');

// Obtenir les points d'un employé par matricule
exports.getEmployeePointsByMatricule = async (req, res) => {
  try {
    const matricule = req.params.matricule;
    const employeePoints = await EmployeePoints.findOne({ matricule });

    if (!employeePoints) {
      return res.status(404).json({ message: 'Points de l\'employé non trouvés' });
    }

    res.status(200).json(employeePoints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};