const expenseModel = require('../models/expense');
const userModel = require('../models/user');

module.exports = {

    getAll(req, res, next) {
        const user = req.user;
        if (user === undefined) {
            res.render('home');
        }
        else {
            expenseModel.find({}).then((expenses) => {
                res.render('expenses', { expenses });
            }).catch(next);
        }
    },

    getCreate(req, res) {
        res.render('new-expense');
    },

    postCreate(req, res, next) {
        const { merchant, total, category, description, report } = req.body;
        const user = req.user;

        let isCheked = false;
        if (report === 'on') {
            isCheked = true;
        }

        expenseModel.create({ merchant, total, category, description, report: isCheked, date: (new Date()).toString(), user: user._id })
            .then(() => res.redirect('/'))
            .catch(next);
    },

    getDetails(req, res, next) {
        const id = req.params.id;
        const userId = req.user._id;

        return expenseModel.findById(id).populate('user').then(expense => {
            userModel.findById(userId).then(user => {
                res.render('report', {
                    expense
                });
            })
        }).catch(next);
    },

    getDelete(req, res, next) {
        const id = req.params.id;
        expenseModel.deleteOne({ _id: id }).then(() => {
            res.redirect('/');
        }).catch(next);
    },

    postEdit(req, res, next) {
        const id = req.params.id;
        const user = req.user;
        const { newNumber } = req.body;

        expenseModel.updateOne({ _id: user._id }, { $set: { amount: (amount + newNumber) } })
            .then(() => res.redirect('/'))
            .catch(next);
    },

};
