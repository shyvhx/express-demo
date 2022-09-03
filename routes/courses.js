const express = require('express');
const Joi = require('joi')  //class - Pascal naming
const mongoose = require('mongoose');



const router = express.Router();


// Joi function for course name validation
function validateCourse(course){
    const schema = Joi.object(
        {
            name: Joi.string().min(3).required(),
        }
    );
    return schema.validate(course);

}


const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },

});
const Course = mongoose.model('Course', courseSchema);

//GET METHODS
router.get('/', async (req,res) => {
    const courses = await Course.find().sort('name');
    res.send(courses);
});


router.get('/:id', async (req,res) => {
    const course = await Course.findById(req.params.id);
    console.log(course);
    if(!course) return res.status(404).send('Course with given ID not found');

    res.send(course);
});



//POST METHODS
router.post('/', async (req,res) => {
    console.log(req.body.name)
    // validate the new course's name
    // if invalid return 400 - Bad request
    const { error } = validateCourse(req.body);  // result.error
    if(error)   return res.status(400).send(error.details[0].message);
        
    

    //if validation goes ok - create new object - push it to the server list
    let course = new Course({ name: req.body.name, });
    course = await course.save();
    res.send(course);

});







//PUT METHODS
// Put request for updating a course's name on the server's list
router.put('/:id', async (req,res) => {
    // validate new given name
    // if invalid return 400 - Bad request
    const { error } = validateCourse(req.body);  // result.error
    if(error)   return res.status(400).send(error.details[0].message);


    const course = await Course.findByIdAndUpdate(req.params.id, { name: req.body.name}, { new: true});
    if(!course) return res.status(404).send('Course with given ID not found');

    res.send(course);


})


//DELETE METHOD
router.delete('/:id', async (req, res) => {
    const course = await Course.findByIdAndRemove(req.params.id);
    if(!course) return res.status(404).send('Course with given ID not found');
    res.send(course);
});

module.exports = router; 
