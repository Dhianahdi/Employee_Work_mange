const jwt = require("jsonwebtoken")
const user = require("../models/user")

module.exports.loggedMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, "RANDOM TOKEN")
    const userId = decodedToken.userId
    user.findOne({_id :userId}).then((user)=>{
      if(user){
        req.auth = {
          userId : userId,
         role :user.role 
        }
        next()
      } else {
        res.status(401).json({ error : "No user" })

        }
      
     })
    
  } catch (error) {
    res.status(500).json({ error: "jkkkbkbb" })
  }
}

//--------------------------------------------------------------------

module.exports.isAdmin = (req, res, next) => {
  try {
    if(req.auth.role === "admin"){
      next()
    }
    else{
      res.status(403).json({error: "no access to this route" })
    }

  } catch (e) {
    res.status(401).json({ error : error.message })
  }
}
module.exports.isAuthor = (req, res, next) => {
  try {
    if(req.auth.role === "author"){
      next()
    }
    else{
      res.status(403).json({error: "no access to this route" })
    }

  } catch (e) {
    res.status(401).json({ error : error.message })
  }
}

