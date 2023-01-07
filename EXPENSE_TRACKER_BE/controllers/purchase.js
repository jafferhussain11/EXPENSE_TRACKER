const rzp = require('razorpay');
const Expense = require('../models/expense');
const Order = require('../models/orders');
const User = require('../models/users');
const AWS = require('aws-sdk');

const Sequelize = require('sequelize');


exports.purchasePremium = (req,res,next) => {

    try{
        
        var instance = new rzp({
        key_id: process.env.RAZORPAY_KEY,
        key_secret : process.env.RAZORPAY_SECRET

        })

         const amount = 2500;
         const currency = 'INR';

        instance.orders.create({amount: amount, currency: currency}, (err, order) => { 

            if(err){

                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id, status : 'PENDING '}).then(()=>
            {
                return res.status(201).json({order, key_id : instance.key_id});
            }).catch(err => {

                throw new Error(err.message);
            })
        })
    }catch(err){

        res.status(403).json({message: err.message});
    }
}
        

exports.verifyPayment = async (req,res,next) => {

    try{
        
        const paymentId = req.body.razorpay_payment_id;
        const orderId = req.body.razorpay_order_id;
        if(!paymentId){

           const order =  await Order.findOne({where: {orderId: orderId}});
           await order.update({status: 'FAILED'});
           return res.status(200).json({success : false , message: 'payment failed'});
                
        
        }
        else{
                
            const order = await Order.findOne({where: {orderId: orderId}})
            const prom1 = order.update({paymentid : paymentId ,status: 'COMPLETED',})
            const prom2 = req.user.update({isPremium: true});
            Promise.all([prom1,prom2]).then(() => {

                 return res.status(200).json({success : true , message: 'payment successful'});
                    
            }).catch(err => {
                    
                    throw new Error(err.message);
            })
        }

        
    }catch(err){
            
            res.status(403).json({message: err.message});
    }
}

exports.checkIfPremium = (req,res,next) => {

    try{

        if(req.user.isPremium){

            return res.status(200).json({isPremium : true});
        }
        else{

            return res.status(200).json({isPremium : false});
        }

    }catch(err){

        res.status(403).json({message: err.message});
    }
}

exports.getLeaderboard = (req,res,next) => {
    
    try{

        let leaderboard = [];
        Expense.findAll({
            attributes : ['User.id','User.username', [Sequelize.fn('SUM', Sequelize.col('expenseval')), 'totalAmount']],
            include: [{model: User}],
            group: ['User.id'],
            order: [[Sequelize.literal('totalAmount'), 'DESC']]
        }).then(expenseTotalRows => {
                
            expenseTotalRows.forEach(row => { 
                    
                    leaderboard.push({name: row.User.username
                        , amount: row.dataValues['totalAmount']});
                })
                return res.status(200).json({leaderboard});
            }).catch(err => {

                throw new Error(err.message);
            })
       

    }catch(err){

        res.status(403).json({message: err.message});
    }
}
async function uploadToS3(expensesJson,fileName){

    const BUCKET_NAME = 'expensetrackerlulu';
    const IAM_USER_KEY = process.env.AWS_ACCESS_KEY_ID;
    const IAM_USER_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

    const s3 = new AWS.S3({

        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    });

    const params = {

        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: expensesJson,
        ACL : 'public-read'
    };
    
    return new Promise((resolve,reject) => {
        
        
            s3.upload(params, (err, data) => {
            
                if(err){
                    
                        reject(err);
                
                }
                else{
                
                    resolve(data.Location);
                }
            });
    });

   


}



exports.downloadPremium = async (req,res,next) => {

    try{

        const expenses = await Expense.findAll({where: {UserId: req.user.id}});
        const expensesJson = JSON.stringify(expenses);
        const fileName = req.user.username + '.txt';
        
        const url = await uploadToS3(expensesJson,fileName);

        return res.status(200).json({url});


        
    }
    catch(err){

        res.status(403).json({message: err.message});
    }
}


exports.getMonthlyExpenses = (req,res,next) => {

    try{
            Expense.findAll({where: {UserId: req.user.id}}).then(expenses => {

                res.status(200).json({expenses});
            }).catch(err => {

                throw new Error(err.message);
            })
    }catch(err){

        res.status(403).json({message: err.message});

    }
}






 // Expense.findAll({
        //     group: ['UserId'],
        //     attributes: ['UserId', [Sequelize.fn('SUM', Sequelize.col('expenseval')), 'totalAmount']],
        //     order: [[Sequelize.literal('totalAmount'), 'DESC']]

        //   }).then(expenseTotalRows => {

        //     expenseTotalRows.forEach(row => { 

        //         //console.log(row.dataValues['UserId']);
        //         User.findOne({where: {id: row.dataValues['UserId']}}).then(user => {

        //             leaderboard.push({name: user.dataValues.username, amount: row.dataValues['totalAmount']});
        //             if(leaderboard.length === expenseTotalRows.length){

        //                 return res.status(200).json({leaderboard});
        //             }
        //         }).catch(err => {

        //             throw new Error(err.message);
        //         })
        //     })
        // }).catch(err => {
                
        //         throw new Error(err.message);
        //     })