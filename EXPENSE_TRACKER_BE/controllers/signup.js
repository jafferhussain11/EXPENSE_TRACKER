const User = require('../models/users');

const path = require('path');





exports.signup = async (req, res, next) => {

    try{
        //console.log(req.body); //req body must be parsed by json body parser !
        const username = req.body.name;
        const password = req.body.password;
        const email = req.body.email;

        if(!username || !password || !email){

            throw new Error('All fields are required');
        
        }
        
        const checkmail = await User.findOne({where: {email: email}}).then(user => {

            return user;

        });
        if(checkmail){

            throw new Error('email already exists');
        }

        User.create({
            username: username,
            password: password,
            email: email
        }).then(user => {
                
                res.status(200).json({message: 'user created', value: user});
        });


    }catch(err){
        
        console.log(err.message);
        return res.status(400).json({message: err.message});
    }
}