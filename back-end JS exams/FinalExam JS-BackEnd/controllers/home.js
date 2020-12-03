const courseModel = require('../models/course')

module.exports ={
    getHome(req,res){
        const user = req.user;

        if(user === undefined){
            //in every project witch i solve i have to npm i -D handlebars@4.5.0. I don't know why but if i don't install it
       //i can't see the property of objects 
       //if you can't seee it please install it
            courseModel.find({}).then(courses => {
                courses = courses.sort((a,b) => Number(b.usersEnrolled.length) - Number(a.usersEnrolled.length)).slice(0, 3);
                
                courses.forEach(element => {
                    element.enroledCount = element.usersEnrolled.length;
                });
                res.render('home/guest-home', {courses} );
            })
        }
        else
        {
            //in every project witch i solve i have to npm i -D handlebars@4.5.0. I don't know why but if i don't install it
            //i can't see the property of objects 
            //if you can't seee it please install it
            courseModel.find({}).then(courses => {
                courses = courses.sort((a,b) => Number(a.usersEnrolled.length) - Number(b.usersEnrolled.length))
                res.render('home/user-home', {courses});
            })
        }
    }
}