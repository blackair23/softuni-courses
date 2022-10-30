const { getAllByDate, getAllByEnrol } = require('../services/courseService');

let homeController = require('express').Router();

//TODO  replace with real conteoller
homeController.get('/', async (req, res) => {
    console.log('>>> ', req.query);

    let courses = [];
    let page =''
    if(req.user){
        page = 'homeUser'
        courses = await getAllByDate(req.query.search);
    }else {
        page = 'homeGuest'
        courses = await getAllByEnrol();
    }
    res.render(page, {
        title: 'Home Page',
        user: req.user,
        courses,
        search: req.query.search,
    });
}); 

module.exports = {
    homeController
}