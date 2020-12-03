const offerController = require('../controllers/shoes');
const userController = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');


module.exports= (app) =>{

    app.get('/', offerController.getShoes);
    
    app.get('/create', checkAuth(true),offerController.getCreateShoes);
    app.post('/create', checkAuth(true),offerController.postCreateShoes);

    app.get('/edit/:id', checkAuth(true),offerController.getEdit);
    app.post('/edit/:id', checkAuth(true),offerController.postEdit);
    
    app.get('/details/:id', checkAuth(true),offerController.getDetails);
    app.get('/buy/:id', checkAuth(true),offerController.getBuy);
    app.get('/delete/:id', checkAuth(true),offerController.getDelete);
    
    app.get('/register', checkAuth(false),userController.getRegister);
    app.post('/register', checkAuth(false),userController.postRegister);

    app.get('/login', checkAuth(false),userController.getLogin);
    app.post('/login', checkAuth(false),userController.postLogin);
    
    app.get('/logout', checkAuth(true),userController.getLogout);

    
    // app.get('*', function(req,res){
    //     res.render('404');
    // })
};