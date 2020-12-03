const trippModel = require('../models/tripp');
const userModel = require('../models/user');

module.exports = {
    getAll(req, res, next) {
        trippModel.find({}).then(tripps => {
            if (tripps) {
                res.render('tripp-pages/sharedTripps', { tripps });
                return;
            }
            res.render('tripp-pages/noSharedTripps');
        })
    },

    getCreate(req, res) {
        res.render('tripp-pages/offerTripp');
    },

    postCreate(req, res, next) {
        const { startAndEndPoint, dateTime, carImage, seats, description } = req.body;
        const user = req.user;

        let arr1 = startAndEndPoint.split(' - ');
        let startPoint = arr1[0];
        let еndPoint = arr1[1];

        let arr2 = dateTime.split(' - ');
        let date = arr2[0];
        let time = arr2[1];

        userModel.findById(user._id).populate('tripp').then(usr => {
            trippModel.create({ startPoint, еndPoint, date, time, seats: +seats, description, carImage, creator: user._id })
                .then(() => {
                    res.redirect('/getAll');
                    return;
                }).catch(next);
        })
    },

    getDetails(req, res, next) {
        const id = req.params.id;
        const userId = req.user._id;
        Promise.all([
            trippModel.findById(id).populate('user'),
            userModel.findById(userId),
        ])
            .then(([tripp, user]) => {
                userModel.findById(tripp.creator).then(usr => {
                    let isCreator = user.id == tripp.creator ? true : false;
                    let isJoined = tripp.buddies.includes(user.email) ? true : false;
                    let driverName = usr.email;

                    if (isCreator) {
                        res.render('tripp-pages/driverTrippDetails', { tripp, driverName });
                    }
                    else {
                        if (isJoined) {
                            res.render('tripp-pages/alreadyJoinedTrippDetails', { tripp, driverName });
                        }
                        else {
                            if (tripp.seats === 0) {
                                res.render('tripp-pages/noAvailableTrippDetails', { tripp, driverName });
                            }
                            else {
                                res.render('tripp-pages/availableTrippDetails', { tripp, driverName });
                            }
                        }

                    }
                })

            }).catch(next);
    },

    getDelete(req, res, next) {
        const id = req.params.id;
        trippModel.deleteOne({ _id: id }).then(() => {
            res.redirect('/getAll');
        }).catch(next);
    },

    getJoin(req, res, next) {
        const id = req.params.id;
        const user = req.user;
        return Promise.all([
            trippModel.findById(id),
            userModel.findById(user._id)
        ])
            .then(([tripp, usr]) => {
                trippModel.updateOne({ _id: id }, { $push: { buddies: usr.email }, $set: { seats: Number(tripp.seats - 1) } })
                    .then(() => {
                        res.redirect('/details/' + id);
                        return;
                    })
            }).catch(next);
    },
};
