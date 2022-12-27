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

exports.login = async (req, res, next) => {

    try {
            
            const email = req.body.email;
            const password = req.body.password;

    
            if(!email || !password){

                throw new Error('All fields are required');
            }
            
            await User.findOne({where: {email: email}}).then(user => {

                if(user){

                    const checkpass = user.password;
                    if(checkpass === password){

                        res.status(200).json({message: 'user logged in', value: user});
                    }else{

                        res.status(401).json({message: 'User not Authorized'});

                    }
                }
                else{

                    res.status(404).json({message: 'User not found'});
                        
                }
            

            });
            
          
    
    } catch (err) {
        
        console.log(err.message);
        return res.status(500).json({message: err.message});
    }
}
