const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Admin = require('../model/admin.model');
const auth = require('../middleware/admin.auth');
const adminController = require('../controller/admin.controller');


router.post('/signup', body("email").isEmail(),
    body("password", "password minimum length must be 6").isLength(6),
    adminController.adminSignup);



router.post('/signIn', body("email").isEmail(),
    body("password", "password minimum length must be 6").isLength(6),
    adminController.adminSignIn);

module.exports = router;