const playModel = require('../models/play');
const userModel = require('../models/user');

module.exports = {

    getAll(req, res, next) {
        const user = req.user;
        if (user === undefined) {
            playModel.find({}).then(plays => {
                let topThree = plays;
                topThree.sort((a, b) => Number(b.usersLiked.length) - Number(a.usersLiked.length)).slice(0, 2);
                res.render('user-home', { topThree })
            }).catch(next);
        }
        else {
            playModel.find({}).then(plays => {
                plays = plays
                    .sort((a, b) => b.createdAt - a.createdAt);
                res.render('user-home', { plays })
            }).catch(next);
        }
    },

    sortByData(req, res, next) {
        playModel.find({}).then(plays => {
            plays = plays
                .sort((a, b) => b.createdAt - a.createdAt);
            res.render('user-home', { plays })
        }).catch(next);

    },
    sortByLikes(req, res, next) {
        playModel.find({}).then(plays => {
            plays = plays
                .sort((a, b) => Number(b.usersLiked.length) - Number(a.usersLiked.length));
            res.render('user-home', { plays })
        }).catch(next);

    },

    getCreate(req, res) {
        res.render('theater-pages/create-theater');
    },

    postCreate(req, res, next) {
        const { title, imageUrl, description, checkbox } = req.body;
        const user = req.user;

        let isCheked = false;
        if (Boolean(checkbox)) {
            isCheked = true;
        }

        playModel.create({ title, imageUrl, description, isPublic: isCheked, createdAt: (new Date()).toString(), creator: user._id })
            .then(() => res.redirect('/'))
            .catch(next);
    },

    getDetails(req, res, next) {
        const id = req.params.id;
        const userId = req.user._id;
        return playModel.findById(id).populate('user').then(play => {
            userModel.findById(userId).then(user => {
                res.render('theater-pages/theater-details', {
                    play,
                    likes: play.usersLiked.length,
                    isCreator: user.id == play.creator ? true : false,
                    isLiked: user.likedPlays.includes(id) ? true : false
                });
            })
        }).catch(next);
    },

    getDelete(req, res, next) {
        const id = req.params.id;
        playModel.deleteOne({ _id: id }).then(() => {
            res.redirect('/');
        }).catch(next);
    },

    getEdit(req, res, next) {
        const id = req.params.id;
        playModel.findById(id).then(play => {
            res.render('theater-pages/edit-theater', { play })
        }).catch(next);
    },

    postEdit(req, res, next) {
        const id = req.params.id;
        const { title, imageUrl, description, checkbox } = req.body;

        let isCheked = false;
        if (Boolean(checkbox)) {
            isCheked = true;
        }

        playModel.update({ _id: id }, { title, imageUrl, description, isPublic: isCheked })
            .then(() => res.redirect('/details/' + id))
            .catch(next);
    },

    getLike(req, res, next) {
        const id = req.params.id;
        const user = req.user;

        Promise.all([
            playModel.update({ _id: id }, { $push: { usersLiked: user._id } }),
            userModel.update({ _id: user._id }, { $push: { likedPlays: id } })
        ]).then(() => {
            res.redirect('/details/' + id);
        }).catch(next);
    },
};
