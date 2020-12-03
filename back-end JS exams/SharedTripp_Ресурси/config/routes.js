const trippModel = require('../controllers/tripp');
const userController = require('../controllers/user');
const homeController = require('../controllers/home');
const checkAuth = require('../middlewares/check-auth');


module.exports= (app) =>{

    app.get('/', homeController.getHome);
    app.get('/getAll',checkAuth(true), trippModel.getAll);
    
    app.get('/create', checkAuth(true),trippModel.getCreate);
    app.post('/create', checkAuth(true),trippModel.postCreate);

    app.get('/details/:id', checkAuth(true), trippModel.getDetails);
    app.get('/join/:id', checkAuth(true), trippModel.getJoin);
    app.get('/delete/:id', checkAuth(true), trippModel.getDelete);
    
    app.get('/register', checkAuth(false),userController.getRegister);
    app.post('/register', checkAuth(false),userController.postRegister);

    app.get('/login', checkAuth(false),userController.getLogin);
    app.post('/login', checkAuth(false),userController.postLogin);
    
    app.get('/logout', checkAuth(true),userController.getLogout);
    
    app.get('*', function(req,res){
        res.render('404');
    })
};