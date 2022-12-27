const path = require('path');

const express = require('express');

const bodyParser = require('body-parser'); 
const jsonparser = bodyParser.json();

const signupController = require('../controllers/signup');

const router = express.Router();//this is a function that returns an object

router.post('/signup',jsonparser,signupController.signup);

router.post('/login',jsonparser,signupController.login);

module.exports = router;