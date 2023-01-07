const { where } = require('sequelize');
const Expense = require('../models/expense');

let curuser;
exports.getExpenses = async (req, res, next) => {

    //res.json({message: 'hello'});
    try{

        const page = Number(req.query.page);
        curuser = req.user.id;
        if(page < 1 ){

            res.status(400).json({message: ' page not found'});
        }
        let totalItems;
        await Expense.count({where: {UserId: req.user.id}})
        .then(count => {

        totalItems = count;
        const perPage = 10;
        const totalPage = Math.ceil(totalItems/perPage);
        Expense.findAll({where: {UserId: req.user.id}, offset: (page-1)*perPage, limit: perPage})
        
        .then(expenses => {

            res.status(200).json({Expenses: expenses, 
                                  totalItems: totalItems,
                                  currentPage: page,
                                  hasNextPage: perPage*page < totalItems,
                                  hasPreviousPage: page > 1,
                                  nextPage: page + 1,
                                  previousPage: page - 1,
                                  lastPage: totalPage,
                                  totalPages: totalPage});
                            })
        .catch(err => {throw new Error(err)});
        })
        .catch(err => {throw new Error(err)});

    }catch(err){

        res.status(400).json({message: err.message});
    }
};

exports.insertExpense = async (req, res, next) => {

    try{
        
        
        const expenseval = req.body.expenseval;
        const description = req.body.desc;
        const category = req.body.cat;
        var totalExpense = req.body.totalExpense;
        totalExpense = totalExpense + expenseval;


        if(!expenseval || !description || !category){
            
            throw new Error('All fields are required');
        
        }else{

            const data = await Expense.create({expenseval: expenseval, description: description, category: category, UserId : curuser}).then(expense => {

                res.status(200).json({success : true, message: 'expense added', value: expense});
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