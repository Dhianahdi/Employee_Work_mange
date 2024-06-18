const jwt = require("jsonwebtoken");
const user = require("../models/choriste"); 

module.exports.loggedMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM TOKEN");
    const userId = decodedToken.userId;

    const fetchedUser = await user.findOne({ _id: userId });

    if (fetchedUser) {
      req.auth = { 
        userId: userId,
        role: fetchedUser.type, 
      };
      next();
    } else {
      res.status(401).json({ error: "No user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

