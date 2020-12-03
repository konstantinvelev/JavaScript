const userModel = require('../models/user');
const expenseModel = require('../models/expense');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const config = require('../config/config');
const signToken = promisify(jwt.sign);

const { jwtSecret, authCookieName } = config;

module.exports = {
    getRegister(req, res) {
        res.render('register');
    },
    postRegister(req, res, next) {
        const { username, password, rePassword, amount } = req.body;
        function onlyLetters(str) {
            return str.match("^[A-Za-z0-9]+$");
        }

        if (password !== rePassword) {
            res.render('register', { errorMessege: 'Passwords don\'t match!' });
            return;
        }
        if ((!onlyLetters(username)) || (username.length < 4)) {
            res.render('register', { errorMessege: 'The username should be at least 4 characters long and should consist only english letters and digits' });
            return;
        }
        if (password.length < 8) {
            res.render('register', { errorMessege: 'The password should be at least 8 characters long' });
            return;
        }
        if (amount < 0) {
            res.render('register', { errorMessege: 'The account amount  should be positive number' });
            return;
        }
        userModel.create({ username, password })
            .then(user => {
                return signToken({ userId: user._id }, jwtSecret);
            })
            .then(jwtToken => {
                expenseModel.find({}).then(expenses => {
                    res.render('expenses', { expenses, userUsername: username });
                    res.cookie(authCookieName, jwtToken);
                })
            })
            .catch(next);
    },
    getLogin(req, res) {
        res.render('login');
    },
    postLogin(req, res, next) {
        const { username, password } = req.body;
        let er = false;

        userModel.findOne({ username })
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
                    res.render('login', { errorMessage: 'Wrong username or password!' });
                    return;
                }

                expenseModel.find({}).then(expenses => {
                    //res.redirect('/getAll');
                    res.render('expenses', { expenses, userUsername: username, isLogged:true });
                    res.cookie(authCookieName, jwtToken);
                })
            })
            .catch(next);
    },
    getLogout(req, res) {
        res.clearCookie(authCookieName);
        res.redirect('/login');
    },

    // getProfile(req, res) {
    //     const id = req.params.id;

    //     userModel.findById(id).then(user => {
    //         expenseModel.find({}).then(shoes => {
    //             let total = 0;
    //             shoes.forEach(e => {
    //                 total += Number(e.pirce)
    //             });
    //             res.render('profile', { user, userOffers: user.offersBought.length, shoes,totalProfit: total });
    //         })
    //     })
    //}

};

