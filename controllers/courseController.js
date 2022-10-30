const { checkUser } = require('../middlewares/guards');
const { createCourse, getCourseById, deleteCourse, editCourse, enrollUsers } = require('../services/courseService');
const { parseError } = require('../util/parser');


let courseController = require('express').Router();

courseController.get('/create',  checkUser(), (req, res) => {
    res.render('create', { user: req.user });
});

courseController.post('/create',  checkUser(), async (req, res) => {
    let course = {
        title: req.body.title,
        description: req.body.description,
        imgUrl: req.body.imgUrl,
        duration: req.body.duration,
        owner: req.user._id,
    }
    try {
        await createCourse(course);
        res.redirect('/');
    } catch (error) {
        res.render('/create', {
            errors: parseError(error),
            body: course,
        })
    }
});

courseController.get('/:id/details', async (req, res) => {
    // console.log(req.user);
    const course = await getCourseById(req.params.id);
    let user = req.user;
    course.enrolled = course.users.map(x => x.toString()).includes(req.user._id.toString());

    if(course.owner == req.user._id){
        user.isOwner = true;
    }
    // console.log('>>> ', course.title);
    res.render('details', {
        user,
        course
    });
});

courseController.get('/:id/delete', async (req, res) => {
    const course = await getCourseById(req.params.id);
    if(course.owner == req.user._id){
        await deleteCourse(req.params.id);
        // user.isOwner = true;
    }
    res.redirect('/');
});

courseController.get('/:id/edit', async (req, res) => {
    const course = await getCourseById(req.params.id);
    if(course.owner.toString() != req.user._id.toString()){
        return res.redirect('/');
    }
    res.render('edit', { user: req.user, course });
    // await editCourse(req.params._id, course);
});

courseController.post('/:id/edit', async (req, res) => {
    const course = await getCourseById(req.params.id);

    if(course.owner.toString() != req.user._id.toString()){
        return res.redirect('/');
    }
    
    try{
        await editCourse(req.params.id, req.body);
        res.redirect(`/course/${req.params.id}/details`);
    }catch(error){
        // let errors = parseError(error);
        res.render('edit', {user: req.user, course: req.body , errors: parseError(error) } )
    }
});


courseController.get('/:id/enroll', async (req, res) => {
    const course = await getCourseById(req.params.id);

    if(course.owner.toString() != req.user._id.toString() &&
        course.users.map(x => x.toString()).includes(req.user._id.toString()) == false ){
            await enrollUsers(req.user._id, req.params.id);
        }
        
     res.redirect(`/course/${req.params.id}/details`);
})
module.exports = courseController;