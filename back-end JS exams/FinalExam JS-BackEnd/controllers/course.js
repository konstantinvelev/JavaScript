const courseModel = require('../models/course');
const userModel = require('../models/user');

module.exports = {
    getCreatecourse(req, res) {
        res.render('course/create');
    },
    postCreatecourse(req, res, next) {
        const { title, description, imageUrl, duration } = req.body;
        const user = req.user;

        if (title.length < 4) {
            res.render('course/create', { errorMessage: 'The title should be at least 4 characters' });
            return;
        }
        if (description.length < 20) {
            res.render('course/create', { errorMessage: 'The description should be at least 20 characters long' });
            return;
        }
        if (description.length > 50) {
            res.render('course/create', { errorMessage: 'The description should be small than 50 characters long' });
            return;
        }

        if (!imageUrl.startsWith('http') || !imageUrl.startsWith('https')) {
            res.render('course/create', { errorMessage: 'The imageUrl should starts with http or https' });
            return;
        }

        courseModel.create({
            title,
            description,
            imageUrl,
            duration: duration,
            createdAt: (new Date().toLocaleDateString).toString(),
            creator: user._id
        })
            .then(() => res.redirect('/'))
            .catch(next);
    },
    getDetails(req, res, next) {
        const id = req.params.id;
        const user = req.user;
        return courseModel.findById(id).populate('user').then(course => {
            userModel.findById(user._id).then(usr => {
                res.render('course/details', {
                    course,
                    isCreator: course.creator === user._id ? true : false,
                    isEnrolled: course.usersEnrolled.includes(usr._id) ? true : false
                });
            })
        }).catch(next);
    },

    getDelete(req, res, next) {
        const id = req.params.id;
        courseModel.deleteOne({ _id: id }).then(() => {
            res.redirect('/');
        }).catch(next);
    },

    getEdit(req, res, next) {
        const id = req.params.id;
        courseModel.findById(id).then(course => {
            res.render('course/edit', { course })
        }).catch(next);
    },

    postEdit(req, res, next) {
        const id = req.params.id;
        const { title, description, imageUrl, duration } = req.body;

        if (title.length < 4) {
            courseModel.findById(id).then(course => {
                res.render('course/edit', { course, errorMessage: 'The title should be at least 4 characters' })
            }).catch(next);
            return;
        }
        if (description.length < 20) {
            courseModel.findById(id).then(course => {
                res.render('course/edit', { course, errorMessage: 'The description should be at least 20 characters long' })
            }).catch(next);
            return;
        }

        if (!imageUrl.startsWith('http') || !imageUrl.startsWith('https')) {
            courseModel.findById(id).then(course => {
                res.render('course/edit', { course, errorMessage: 'The imageUrl should starts with http or https' })
            }).catch(next);
            return;
        }

        courseModel.update({ _id: id }, { title, description, imageUrl, duration })
            .then(() => res.redirect('/details/' + id))
            .catch(next);

    },

    getEnroll(req, res, next) {
        const id = req.params.id;
        const user = req.user;

        courseModel.updateOne({ _id: id }, { $push: { usersEnrolled: user._id } }).then(() => {
            courseModel.findById(id).then(course => {
                userModel.updateOne({ _id: course.creator }, { $push: { enrolledCourses: id } }).then(()=>{
                    res.redirect('/details/' + id);
                })
            })
        }).catch(next);
    },
};
