const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

router.post("/signup", UserController.creatUser);
router.post("/login", UserController.loginUser);

module.exports = router;
