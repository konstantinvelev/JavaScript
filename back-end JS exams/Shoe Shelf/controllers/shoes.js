const shoesModel = require('../models/offer');
const userModel = require('../models/user');

module.exports = {
    getShoes(req, res, next) {
        shoesModel.find({}).populate('offers')
            .then(shoes => {
                res.render('home', { shoes })
            })
            .catch(next);
    },
    getCreateShoes(req, res) {
        res.render('create');
    },
    postCreateShoes(req, res, next) {
        const { name, price, imageUrl, description, brand } = req.body;
        const user = req.user;
        shoesModel.create({
            name,
            price: +price,
            imageUrl,
            description,
            brand,
            createdAt: (new Date()).toString(),
            creator: user._id
        })
            .then(() => res.redirect('/'))
            .catch(next);
    },
    getDetails(req, res, next) {
        const id = req.params.id;
        const user = req.user;
        return shoesModel.findById(id).populate('user').then(shoe => {
            userModel.findById(user._id).then(entity => {
                res.render('details', {
                    shoe,
                    buiersCount: shoe.buyers.length,
                    isCreator: entity.id == shoe.creator ? true : false,
                    isBought: entity.offersBought.includes(id) ? true : false
                });
            })
        }).catch(next);
    },

    getDelete(req, res, next) {
        const id = req.params.id;
        shoesModel.deleteOne({ _id: id }).then(() => {
            res.redirect('/');
        }).catch(next);
    },

    getEdit(req, res, next) {
        const id = req.params.id;
        shoesModel.findById(id).then(shoe => {
            res.render('edit', { shoe })
        }).catch(next);
    },

    postEdit(req, res, next) {
        const id = req.params.id;
        const { name, price, imageUrl, description, brand } = req.body;

        shoesModel.update({ _id: id }, { name, price: +price, imageUrl, description, brand })
            .then(() => res.redirect('/details/' + id))
            .catch(next);
    },

    getBuy(req, res, next) {
        const id = req.params.id;
        const user = req.user;

        Promise.all([
            shoesModel.update({ _id: id }, { $push: { buyers: user._id } }),
            userModel.update({ _id: user._id }, { $push: { offersBought: id } })
          ]).then(() => {
                res.redirect('/details/' + id);
            }).catch(next);
    },
};
