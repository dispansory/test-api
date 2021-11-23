const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[0];
    // console.log(token);
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    //the following request field is a user created request field permitted by express which passes the field to the next execution scope
    //however, next() is needed to be called at the end to pass the execution and available created fields
    req.userData = {email: decodedToken.email, userId: decodedToken.userId}
    next();
  } catch (error) {
    res.status(401).json({message: "You are not authenticated!"});
  }
}
