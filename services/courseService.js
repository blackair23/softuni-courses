const Course = require('../models/Course');


async function getCourseById(id) {
    return  Course.findById(id).lean();
}

async function getAllByDate(search) {
    let query = {};
    if(search) {
        query.title = new RegExp(search, 'i');
    }
    return await Course.find(query).sort({ createdAt: 1 }).lean();

    // console.log(result);
}

async function getAllByEnrol() {
    return await Course.find({}).sort({ users: -1 }).limit(3).lean();
    // console.log(result);
}

async function createCourse(course) {
    return await Course.create(course);
}

async function deleteCourse(id) {
    await Course.findByIdAndDelete(id);
}

async function editCourse(id, course) {
    const existing = await Course.findById(id);
    // console.log('course >>> ',course)
    // console.log('existing >>> ', existing);

    existing.title = course.title;
    existing.description = course.description;
    existing.imgUrl = course.imgUrl;
    existing.duration = course.duration;

    return existing.save();
}

async function enrollUsers(idUser, idCourse) {
    const existing = await Course.findById(idCourse);

    existing.users.push(idUser);

    return existing.save();
}

module.exports = {
    getAllByDate,
    createCourse,
    getAllByEnrol,
    getCourseById,
    deleteCourse,
    editCourse,
    enrollUsers,
}