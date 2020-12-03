const playModel = require('../controllers/play');
const userController = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');


module.exports= (app) =>{

    app.get('/', playModel.getAll);
    
    app.get('/create', checkAuth(true),playModel.getCreate);
    app.post('/create', checkAuth(true),playModel.postCreate);

    app.get('/edit/:id', checkAuth(true),playModel.getEdit);
    app.post('/edit/:id', checkAuth(true),playModel.postEdit);
    
    app.get('/details/:id', checkAuth(true), playModel.getDetails);
    app.get('/like/:id', checkAuth(true), playModel.getLike);
    app.get('/delete/:id', checkAuth(true), playModel.getDelete);
    
    app.get('/register', checkAuth(false),userController.getRegister);
    app.post('/register', checkAuth(false),userController.postRegister);

    app.get('/login', checkAuth(false),userController.getLogin);
    app.post('/login', checkAuth(false),userController.postLogin);
    
    app.get('/logout', checkAuth(true),userController.getLogout);

    app.get('/sortByDate', checkAuth(true),playModel.sortByData);
    app.get('/sortByLikes', checkAuth(true),playModel.sortByLikes);
    
    // app.get('*', function(req,res){
    //     res.render('404');
    // })
};