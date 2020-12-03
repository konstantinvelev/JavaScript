const courseController = require('../controllers/course');
const userController = require('../controllers/user');
const homeController = require('../controllers/home');
const checkAuth = require('../middlewares/check-auth');


module.exports= (app) =>{

    app.get('/', homeController.getHome);
    
    app.get('/create', checkAuth(true),courseController.getCreatecourse);
    app.post('/create', checkAuth(true),courseController.postCreatecourse);

    app.get('/edit/:id', checkAuth(true),courseController.getEdit);
    app.post('/edit/:id', checkAuth(true),courseController.postEdit);
    
    app.get('/details/:id', checkAuth(true),courseController.getDetails);
    app.get('/enroll/:id', checkAuth(true),courseController.getEnroll);
    app.get('/delete/:id', checkAuth(true),courseController.getDelete);
    
    app.get('/register', checkAuth(false),userController.getRegister);
    app.post('/register', checkAuth(false),userController.postRegister);

    app.get('/login', checkAuth(false),userController.getLogin);
    app.post('/login', checkAuth(false),userController.postLogin);
    
    app.get('/logout', checkAuth(true),userController.getLogout);

    
    // app.get('*', function(req,res){
    //     res.render('404');
    // })
};