const Expense = require('../models/expense');
const Order = require('../models/orders');
const User = require('../models/users');
const reset_token = require('../models/forgotpasstokens');
const path = require('path');
const bcrypt = require('bcrypt');


const Sequelize = require('sequelize');

const sib = require('sib-api-v3-sdk');
const { TransactionalEmailsApi } = require('sib-api-v3-sdk');

const defaultClient = sib.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '';


exports.getResetPassword = (req, res, next) => {

    const email = decodeURIComponent(req.params.email);
    const token = decodeURIComponent(req.params.token);
    reset_token.findOne({where: {token: token, usermail: email}}).then(token => {

        //check validity of token
        if(!token){
             
            return res.status(200).json({message: 'Invalid token'});
        }
        if(token.expirationDate < Date.now()){

            return res.status(200).json({message: 'Token expired'});
        }
        res.sendFile(path.join(__dirname, '..', 'views', 'reset-password.html'));
    });
}
exports.postForgotPasswordLink = (req, res, next) => {

    
    
    try{
            const email = req.body.email;
            User.findOne({where: {email: email}}).then(user => {

                if(!user){

                    return res.status(200).json({message: 'No user found with this email'});
                }
                const token = Math.floor(Math.random() * 1000000);
                const resetPasswordLink = `http://localhost:5000/forgotpassword/reset-password/${encodeURIComponent(user.email)}/${encodeURIComponent(token)}`;
                reset_token.create( {token: token, usermail: user.email, expirationDate : Date.now() + 3600000 }).then(() => {

                    const apiInstance = new sib.TransactionalEmailsApi();
                    const reciever = [{

                        'email': email,
                    }];
                    apiInstance.sendTransacEmail({
                        'sender': { 
                            
                            'name': 'Expense Tracker',
                            'email': 'jafferhussain11@gmail.com'
                        },
                        'to': reciever,
                        'subject': 'Reset Password',
                        'htmlContent': `<p>Hi ${user.username},</p>
                        <p>You have requested to reset your password.</p>
                        <p>Please click on the following link to reset your password.</p>
                        <p>${resetPasswordLink}</p>
                        <p>Thank you,</p>
                        <p>Expense Tracker</p>`,
                    
                    }).then(function(data) {

                        res.status(200).json({message: 'Please check your email to reset your password'});
                    }, function(error) {

                        console.error(error);
                        res.status(403).json({message: error.message});
                    });
                }).catch(err => {

                    throw new Error(err.message);
                } )
            }).catch(err => {

                throw new Error(err.message);
            })


    }catch(err){

        res.status(403).json({message: err.message});
    }
}
        

            
exports.postResetPassword = (req, res, next) => {

     try {

        const email = req.body.email;
        const newPassword = req.body.password;
        const token = req.body.token;
        reset_token.findOne({where: {token: token, usermail: email}}).then(token => {

            console.log(token.expirationDate);
            if(token.expirationDate < Date.now()){

                return res.status(200).json({message: 'Token expired'});
            }
            User.findOne({where: {email: email}}).then(user => {

                bcrypt.hash(newPassword, 12).then(hashedPassword => {

                    user.password = hashedPassword;
                    user.save().then(() => {
                            
                            res.status(200).json({message: 'Password updated successfully'});
                    }).catch(err => {
                            
                            throw new Error(err.message);
                    })

                }).catch(err => {

                    throw new Error(err.message);
                })
                
        }).catch(err => {

            throw new Error(err.message);
        })
        }).catch(err => {

            throw new Error(err.message);
        })
    }catch(err){
            
            res.status(403).json({message: err.message});
        }
}
    