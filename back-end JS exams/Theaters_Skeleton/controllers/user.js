const userModel = require('../models/user');
const playModel = require('../models/play');
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
        const { username, password, repeatPassword } = req.body;

        if (password !== repeatPassword) {
            res.render('register', { errorMessege: 'Passwords don\'t match!' });
            return;
        }
        if (username.length < 3) {
            res.render('register', { errorMessege: 'The username should be at least 3 characters' });
            return;
        }
        if (password.length < 3) {
            res.render('register', { errorMessege: 'The password should be at least 3 characters' });
            return;
        }
        userModel.create({ username, password })
            .then(user => {
                return signToken({ userId: user._id }, jwtSecret);
            })
            .then(jwtToken => {
                res.cookie(authCookieName, jwtToken,);
                res.redirect('/');
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
                    res.render('login', { errorMessage: 'Wrong username or password!' });
                    er = true;
                    return;
                }
                return signToken({ userId: user._id }, jwtSecret);
            })
            .then(jwtToken => {
                if (er) {
                    return;
                }

                res.redirect('/');
                res.cookie(authCookieName, jwtToken);
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
    //         playModel.find({}).then(shoes => {
    //             let total = 0;
    //             shoes.forEach(e => {
    //                 total += Number(e.pirce)
    //             });
    //             res.render('profile', { user, userOffers: user.offersBought.length, shoes,totalProfit: total });
    //         })
    //     })
    //}

};

