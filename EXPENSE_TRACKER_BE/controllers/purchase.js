const rzp = require('razorpay');
const Order = require('../models/orders');



exports.purchasePremium = (req,res,next) => {

    try{
        
        var instance = new rzp({
        key_id: 'rzp_test_ymshxTVZbrKr6k',
        key_secret : 'LnUsgIaS6LReW9gap0K4yG5n'

        })

         const amount = 2500;
         const currency = 'INR';

        instance.orders.create({amount: amount, currency: currency}, (err, order) => { 

            if(err){

                throw new Error(JSON.stringify(err));
            }
            console.log(order);
            req.user.createOrder({orderid: order.id, status : 'PENDING '}).then(()=>
            {
                return res.status(201).json({order, key_id : instance.key_id});
            }).catch(err => {

                throw new Error(err.message);
            })
        })
    }catch(err){

        console.log(err.message);
        res.status(403).json({message: err.message});
    }
}
        

exports.verifyPayment = async (req,res,next) => {

    try{
        
        console.log('verify payment')
        const paymentId = req.body.razorpay_payment_id;
        const orderId = req.body.razorpay_order_id;
        console.log(paymentId);
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


