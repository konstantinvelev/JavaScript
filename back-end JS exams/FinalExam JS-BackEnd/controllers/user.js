const userModel = require('../models/user');
const courseModel = require('../models/course');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const config = require('../config/config');
const signToken = promisify(jwt.sign);
//const { jwt } = require('../ustils/jwt');
const { jwtSecret, authCookieName } = config;

module.exports = {
    getRegister(req, res) {
        res.render('user/register');
    },
    postRegister(req, res, next) {
        const { username, password, rePassword } = req.body;

        function onlyLetters(str) {
            return str.match("^[A-Za-z0-9]+$");
        }

        if (password !== rePassword) {
            res.render('user/register', { errorMessege: 'Passwords don\'t match!' });
            return;
        }
        if (password.length < 5) {
            res.render('user/register', { errorMessege: 'The password should be at least 5 characters long' });
            return;
        }
        if (!onlyLetters(password)) {
            res.render('user/register', { errorMessege: 'The password should consist only english letters and digits' });
            return;
        }
        if (username.length < 5) {
            res.render('user/register', { errorMessege: 'The username should be at least 5 characters long' });
            return;
        }
        if (!onlyLetters(username)) {
            res.render('user/register', { errorMessege: 'The username should consist only english letters and digits' });
            return;
        }

        userModel.create({ username, password })
            .then(user => {
                return signToken({ userId: user._id, username: user.username }, jwtSecret);
            })
            .then(jwtToken => {
                res.cookie(authCookieName, jwtToken, { httpOnly: true });
                res.redirect('/');
            })
            .catch(next);
    },
    getLogin(req, res) {
        res.render('user/login');
    },
    postLogin(req, res, next) {
        const { username, password } = req.body;
        let er = false;
        function onlyLetters(str) {
            return str.match("^[A-Za-z0-9]+$");
        }
        if (password.length < 5) {
            res.render('user/login', { errorMessege: 'The password should be at least 5 characters long' });
            return;
        }
        if (!onlyLetters(password)) {
            res.render('user/login', { errorMessege: 'The password should consist only english letters and digits' });
            return;
        }
        if (username.length < 5) {
            res.render('user/login', { errorMessege: 'The username should be at least 5 characters long' });
            return;
        }
        if (!onlyLetters(username)) {
            res.render('user/login', { errorMessege: 'The username should consist only english letters and digits' });
            return;
        }

        userModel.findOne({ username })
            .then(user => {
                if (!user.comparePasswords(password)) {
                    res.render('user/login', { errorMessage: 'Wrong password' });
                    return;
                }
                return signToken({ userId: user._id, userUsername: user.username }, jwtSecret);
            }).then(jwtToken => {
                if (jwtToken === undefined) {
                    ;
                }
                else {
                    res.cookie(authCookieName, jwtToken, { httpOnly: true });
                    res.redirect('/');
                }
            }).catch(next);
    },
    getLogout(req, res) {
        res.clearCookie(authCookieName);
        res.redirect('/login');
    },

    getProfile(req, res) {
        const id = req.params.id;

        userModel.findById(id).then(user => {
            courseModel.find({}).then(course => {
                let total = 0;
                course.forEach(e => {
                    total += Number(e.pirce)
                });
                res.render('profile', { user, usercourses: user.coursesBought.length, course, totalProfit: total });
            })
        })
    }

}

