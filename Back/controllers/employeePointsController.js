const EmployeePoints = require('../models/employeePoints')

// Obtenir les points d'un employé par matricule
exports.getEmployeePointsByMatricule = async (req, res) => {
  try {
    const matricule = req.params.matricule
    const employeePoints = await EmployeePoints.findOne({ matricule })

    if (!employeePoints) {
      return res
        .status(404)
        .json({ message: "Points de l'employé non trouvés" })
    }

    res.status(200).json(employeePoints)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
exports.getEmployeePointsDetails = async (req, res) => {
  const matricule = req.params.matricule; // Supposant que vous récupérez le matricule à partir des paramètres de requête

  try {
    // Recherchez les points de l'employé par matricule
    const employeePoints = await EmployeePoints.findOne({ matricule });

    if (!employeePoints) {
      return res.status(404).json({ message: "Points de l'employé non trouvés" });
    }

    // Structure de données pour stocker les détails des points et des absences
    const employeeDetails = [];

    // Parcours des détails des points pour chaque jour
    employeePoints.details.forEach((value, key) => {
      const jour = value.jour;
      const points = value.points;
      const date = key; // Supposant que la clé est la date

      employeeDetails.push({ jour, date, points });
    });

    // Récupération des absences
    const absences = employeePoints.absences || [];

    // Retourner la réponse avec les détails des points et des absences
    res.status(200).json({ employeeDetails, absences });
  } catch (error) {
    console.error('Erreur lors de la récupération des points de l\'employé:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des points de l\'employé' });
  }
};