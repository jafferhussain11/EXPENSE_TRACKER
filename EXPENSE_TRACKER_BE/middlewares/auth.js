const jwt = require('jsonwebtoken');

const User = require('../models/users');

exports.isAuth = (req,res,next) => {
    
    const token = req.get('Authorization');
    let decodedToken;
    try{
        
        decodedToken = jwt.verify(token,'secret');
        if(!decodedToken){
            const error = new Error('Not authenticated');
            error.statusCode = 401;
            throw error;
        }
        User.findByPk(decodedToken.userId).then(user => {

            req.user = user;
            next();
        })
    }
    catch(err){

        res.status(401).json({ message: 'Not authorized !' });

        
    }

}