const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.creatUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
      res.status(201).json({
        massage: "User Created",
        result: result
      });
    }).catch(err => {
      res.status(500).json({
          message: "Invalid authentication credentials!"
      });
    });
  });
}

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  //check if email exist in database
  User.findOne({email: req.body.email}).then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed!"
      });
    }
    fetchedUser = user;
    //if user exist, validate password by comparing the hash of the entered password with the stored hashed password and return "true" if same and "false" otherwise
    //validate password without decrypting the stored hashed password
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Authentication failed!"
      });
    }
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id}, //data to obtain from jwt
      "secret_this_should_be_longer", //secrete key to generate jwt
      { expiresIn: "1h" } //duration of jwt
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      //token is decoded here to pass userId to enhance performance
      //decoding token in frontend might impact operation performance
      userId: fetchedUser._id,
      status: "User Loged In"
    });
  }).catch(err => {
    console.log(err);
    return res.status(401).json({
      message: "Invalid Credentials!"
    });
  });
}
