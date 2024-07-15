const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const user = require("../models/user")
exports.getuser =async(req,res)=>{
    try {
        User.find({_id : req.params.id}).exec()
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
exports.signup = (req,res,next) => {

        const user = new User ({
            nom : req.body.nom,
            prenom : req.body.prenom,
            telephone: req.body.telephone,
            login : req.body.login,
        })
        user 
        .save()
        .then ((response) =>{
            const newUser= response.toObject()
            delete newUser.password
            res.status(201).json ({
                user: newUser,
                message: 'user created !',

            })
        })
        .catch ((error) => res.status(400).json ({ error : error.message}))
    
.catch ((error)=> res.status(500).json({error}))
}

exports.AddAdmin = (req,res,next) => {
    bcrypt 
    .hash(req.body.password, 10)
    .then((hash) =>{
        const user = new User ({
            nom : req.body.nom,
            prenom : req.body.prenom,
            telephone: req.body.telephone,
            login : req.body.login,
            password : hash,
            role : "admin",
            statut :"V"
        })
        user 
        .save()
        .then ((response) =>{
            const newUser= response.toObject()
            delete newUser.password
            res.status(201).json ({
                user: newUser,
                message: 'Admin created !',

            })
        })
        .catch ((error) => res.status(400).json ({ error : error.message}))
    })
.catch ((error)=> res.status(500).json({error}))
}




exports.login = (req, res, next) => {

    user.findOne({login:req.body.login})
    .then((user)=>{
        if(!user){
            return res 
            .status(401)
            .json({message:"login ou pass incorrect"})
        }
        bcrypt.compare(req.body.password,user.password)
        .then((valid)=>{
            if(!valid){
                return res.status(401)
                .json({message:"login ou MP inco"})
            }
            res.status(200).json({
                token:jwt.sign({userId:user._id},"RANDOM TOKEN",{
                    expiresIn:"24h",
                }),
            })
        })
    }).catch((error)=> res.status(500).json({error:error}))

}

exports.statut = async (req, res) => {
    try {
        user.findByIdAndUpdate(req.params.id, { status: "V" }).exec()
        .then(result => {
          if(result){
            res.status(200).json({message : "status updated successfully"})
          }else{
            res.status(404).json({message : "id not found"})
          }
        })
        .catch(error => {
          res.status(500).json({ error: error.message })
        })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }