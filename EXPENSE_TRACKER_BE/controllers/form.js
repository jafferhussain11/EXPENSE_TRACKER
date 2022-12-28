const { where } = require('sequelize');
const Expense = require('../models/expense');

let curuser;
exports.getExpenses = async (req, res, next) => {

    //res.json({message: 'hello'});
    try{

        console.log(`req.userid : ${req.user.id}`);
        curuser = req.user.id;
        await Expense.findAll( { where :{UserId:req.user.id}}).then(expenses => {

            //console.log(expenses);
            res.status(200).json({Expenses: expenses});
        });
    }catch(err){
        console.log(err);
    }
    
}
exports.insertExpense = async (req, res, next) => {

    try{
        
        
        const expenseval = req.body.expenseval;
        const description = req.body.desc;
        const category = req.body.cat;

        if(!expenseval || !description || !category){
            
            throw new Error('All fields are required');
        
        }else{

            console.log(curuser)
            const data = await Expense.create({expenseval: expenseval, description: description, category: category, UserId : curuser}).then(expense => {

                res.status(200).json({value: expense});
            });

        }
    }catch(err){

        res.status(400).json({message: err.message});
    }
};
exports.deleteExpense = async (req, res, next) => {

    try{
        const id = req.params.id;
        const expense = await Expense.findByPk(id); //returns an sequelize object with that id
        if(!expense){

            throw new Error('expense not found');
        }else{

            await expense.destroy();
            res.status(200).json({message: 'expense deleted'});
        }
    }catch(err){

        res.status(400).json({message: err.message});
    }
};

exports.get404 = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
};