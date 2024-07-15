const Publication = require('../models/publication'); 
const User = require("../models/user")
const user = require("../models/user")
exports.getPublication=async(req,res)=>{
    try {
        Publication.find({_id : req.params.id}).exec()
            .then(result=>{
                res.status(200).json(result)
            })
            .catch(error=>{
                res.status(500).json({error : error.message})
            })
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

/*exports.ajouterPublication = async (req, res, next) => {
  try {
    const { titre, contenue } = req.body;

    const newPublication = new Publication({
      titre,
      contenue,
    });

    const savedPublication = await newPublication.save();

    res.status(201).json({
      success: true,
      message: 'Publication added successfully',
      publication: savedPublication,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};





*/
exports.ajouterPublication = async (req, res) => {
    try {
      const author = await User.findOne({ login: req.params.authorLogin });
  
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }
  
      const newPublication = new Publication({
        titre: req.body.titre,
        contenue: req.body.contenue,
      });
  
      newPublication.author = author._id;
  
      const savedPublication = await newPublication.save();
  
      author.publication.push(savedPublication._id);
      await author.save();
  
      res.status(201).json({
        success: true,
        message: 'Publication added successfully',
        publication: savedPublication,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  };
  