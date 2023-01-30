const Razorpay = require('razorpay');
const Expense = require('../models/expense');
const Order = require('../models/orders');
const User = require('../models/users');
const AWS = require('aws-sdk');

const Sequelize = require('sequelize');


exports.purchasePremium = (req,res,next) => {

    try{
        
        var instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret : process.env.RAZORPAY_SECRET

        })

        var options = {
            amount: 2500,  // amount in the smallest currency unit
            currency: "INR",
            
          };

        instance.orders.create(options, function(err, order) {
            
            if(err){

                console.log(err);
                
                throw new Error(err.message);
            }
            else{
                
                // console.log(order);
                const newOrder = new Order({
                    orderid: order.id,
                    status: 'PENDING',
                    userId: req.user._id

                });
                newOrder.save()
                .then(() => {
                    res.status(200).json({orderId: order.id});
                })
                .catch(err => {
                    throw new Error(err.message);
                })
            }
        });
     
    }catch(err){

        res.status(403).json({message: err.message});
    }
}
        

exports.verifyPayment = async (req,res,next) => {

    try{
        
        const paymentId = req.body.razorpay_payment_id;
        const orderId = req.body.razorpay_order_id;
        if(!paymentId){

           const order =  await Order.findOne({orderId: orderId});
           await order.update({status: 'FAILED'});
           return res.status(200).json({success : false , message: 'payment failed'});
                
        
        }
        else{
                
            const order = await Order.findOne({orderId: orderId})
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

exports.getLeaderboard = async (req, res, next) => {
    try {

      const aggregateQuery = [
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $group: {
            _id: "$user._id",
            username: { $first: "$user.username" },
            totalAmount: { $sum: "$expenseval" }
          }
        },
        {
          $sort: { totalAmount: -1 }
        }
      ];
  
      const leaderboard = await Expense.aggregate(aggregateQuery);
      return res.status(200).json({ leaderboard });

    } 
    
    catch (err) {
      return res.status(403).json({ message: err.message });
    }
  };

   
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

        const expenses = await Expense.find({userId: req.user._id})
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
            Expense.find({userId :req.user._id}).then(expenses => {

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