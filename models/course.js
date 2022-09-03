const Joi = require('joi') 
const mongoose = require('mongoose');


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



exports.Course = Course;
exports.validateCourse = validateCourse;