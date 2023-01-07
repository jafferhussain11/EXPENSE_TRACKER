const path = require('path');

const express = require('express');

const bodyParser = require('body-parser'); 
const jsonparser = bodyParser.json();

const auth = require('../middlewares/auth');

const purchaseController = require('../controllers/purchase');
const { route } = require('./form');

const router = express.Router();//this is a function that returns an object

router.get('/premium/check',auth.isAuth,purchaseController.checkIfPremium);

router.get('/premium/leaderboard',auth.isAuth,purchaseController.getLeaderboard);

router.get('/premium/download',auth.isAuth,purchaseController.downloadPremium);

router.get('/premium',auth.isAuth,purchaseController.purchasePremium);

router.post('/premium',jsonparser,auth.isAuth,purchaseController.verifyPayment);



module.exports = router;