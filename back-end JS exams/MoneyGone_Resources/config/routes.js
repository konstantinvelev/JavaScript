const expenseModel = require('../controllers/expense');
const userController = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');


module.exports= (app) =>{

    app.get('/', expenseModel.getAll);
    app.get('/getAll', expenseModel.getAll);
    
    app.get('/create', checkAuth(true),expenseModel.getCreate);
    app.post('/create', checkAuth(true),expenseModel.postCreate);

    app.post('/edit/', checkAuth(true),expenseModel.postEdit);
    
    app.get('/details/:id', checkAuth(true), expenseModel.getDetails);
    app.get('/delete/:id', checkAuth(true), expenseModel.getDelete);
    
    app.get('/register', checkAuth(false),userController.getRegister);
    app.post('/register', checkAuth(false),userController.postRegister);

    app.get('/login', checkAuth(false),userController.getLogin);
    app.post('/login', checkAuth(false),userController.postLogin);
    
    app.get('/logout', checkAuth(true),userController.getLogout);
    
     app.get('*', function(req,res){
        res.render('404');
     })
};