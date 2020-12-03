const userModel = require('../models/user');
const trippModel = require('../models/tripp');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const config = require('../config/config');
const signToken = promisify(jwt.sign);

const { jwtSecret, authCookieName } = config;

module.exports = {
    getRegister(req, res) {
        res.render('user-pages/register');
    },
    postRegister(req, res, next) {
        const { email, password, rePassword } = req.body;

        if (password !== rePassword) {
            res.render('user-pages/register', { errorMessege: 'Passwords don\'t match!' });
            return;
        }
        if (password.length < 6) {
            res.render('user-pages/register', { errorMessege: 'The password should be at least 6 characters long!' });
            return;
        }
        userModel.create({ email, password })
            .then(user => {
                return signToken({ userId: user._id }, jwtSecret);
            })
            .then(jwtToken => {
                res.cookie(authCookieName, jwtToken,);
                res.render('tripp-pages/home', { loggedEmail: email });
            })
            .catch(next);
    },
    getLogin(req, res) {
        res.render('user-pages/login');
    },
    postLogin(req, res, next) {
        const { email, password } = req.body;
        let er = false;

        userModel.findOne({ email })
            .then(user => Promise.all([user, user ? user.comparePasswords(password) : false]))
            .then(([user, match]) => {
                if (!match) {
                    er = true;
                    return;
                }
                return signToken({ userId: user._id }, jwtSecret);
            })
            .then(jwtToken => {
                if (er) {
                    res.render('user-pages/login', { errorMessage: 'Wrong email or password!' });
                    return;
                }
                res.render('tripp-pages/home', { loggedEmail: email });
                res.cookie(authCookieName, jwtToken);
            })
            .catch(next);
    },
    getLogout(req, res) {
        res.clearCookie(authCookieName);
        res.redirect('/login');
    },

};

