const path = require('path');
const auth = require('../middlewares/auth');

const express = require('express');

const bodyParser = require('body-parser'); 
const jsonparser = bodyParser.json();

const forgotpassController = require('../controllers/forgotpassword');

const router = express.Router();//this is a function that returns an object

router.get('/forgotpassword/reset-password/:email/:token',forgotpassController.getResetPassword);

router.post('/forgotpassword/reset-password',jsonparser,forgotpassController.postResetPassword);

router.post('/forgotpassword',jsonparser,forgotpassController.postForgotPasswordLink);



module.exports = router;

