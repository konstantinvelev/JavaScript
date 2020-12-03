const userModel = require('../models/user');
const offerModel = require('../models/offer');
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
        const { email, fullName, password, rePassword } = req.body;

        if (password !== rePassword) {
            res.render('register', { errorMessege: 'Passwords don\'t match!' });
            return
        }

        userModel.create({ email, password })
            .then(user => {
                return signToken({ userId: user._id }, jwtSecret);
            })
            .then(jwtToken => {
                res.cookie(authCookieName, jwtToken, { httpOnly: true });
                localStorage.fullName = fullName;
                res.redirect('/', { fullName });
            })
            .catch(next);
    },
    getLogin(req, res) {
        res.render('login');
    },
    postLogin(req, res, next) {
        const { email, password } = req.body;

        userModel.findOne({ email })
            .then(user => Promise.all([user, user ? user.comparePasswords(password) : false]))
            .then(([user, match]) => {
                if (!match) {
                    res.render('/login', { errorMessege: 'Wrong email or password!' });
                    return;
                }
                return signToken({ userId: user._id, fullName: user.fullName }, jwtSecret);
            })
            .then(jwtToken => {
                res.cookie(authCookieName, jwtToken, { httpOnly: true });
                res.redirect('/', { fullName: user.fullName });
            })
            .catch(next);
    },
    getLogout(req, res) {
        res.clearCookie(authCookieName);
        res.redirect('/login');
    },

    getProfile(req, res) {
        const id = req.params.id;

        userModel.findById(id).then(user => {
            offerModel.find({}).then(shoes => {
                let total = 0;
                shoes.forEach(e => {
                    total += Number(e.pirce)
                });
                res.render('profile', { user, userOffers: user.offersBought.length, shoes,totalProfit: total });
            })
        })
    }

}

