const User = require('../models/users');

const path = require('path');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');



exports.getSignup = (req, res, next) => {

    res.sendFile(path.join(__dirname, '../', 'views', 'signup.html'));

}

exports.signup = async (req, res, next) => {

    try{
        //console.log(req.body); //req body must be parsed by json body parser !
        const username = req.body.name;
        let password = req.body.password;
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
        bcrypt.hash(password, 12).then(hashedPassword => {

            password = hashedPassword;
            User.create({
                username: username,
                password: password,
                email: email
              }).then(user => {
                
                    res.status(200).json({message: 'user created', value: user});
                });
        });


    } catch(err){
        
        return res.status(400).json({message: err.message});
    }
}

exports.getLogin = (req, res, next) => {

    res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));

}

exports.login = async (req, res, next) => {

    try {
            
            const email = req.body.email;
            const password = req.body.password;

    
            if(!email || !password){

                throw new Error('All fields are required');
            }
            
            await User.findOne({where: {email: email}}).then(user => {

                if(user){

                    const checkpass = user.password; // db hashed password
                    
                    bcrypt.compare(password, checkpass,(err, result)=>{

                        if(err){

                            throw new Error(err.message);
                        }
                        if(result){

                                const token = jwt.sign({email: user.email, userId : user.id}, 'secret', {expiresIn: '1h'});
                                res.status(200).json({message: 'login successful', value: user, token: token});

                        }
                        else{

                             res.status(404).json({message: 'passwords do not match'});
                        }
                    })
                }
                else{

                    res.status(404).json({message: 'User not found'});
                        
                }
            

            });
            
          
    
    } catch (err) {
        
        return res.status(500).json({message: err.message});
    }
}

