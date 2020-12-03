module.exports ={
    getHome(req, res, next) {
        const user = req.user;
        if (user === undefined) {
            res.render('user-pages/home');
        }
        else {
            res.render('tripp-pages/home')
        }
    },
}