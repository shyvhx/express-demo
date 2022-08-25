
const express = require('express');
const helmet = require('helmet')
const logger = require('./logger.js')
const Joi = require('joi')  //class - Pascal naming
const app = express();
const morgan = require('morgan')


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}....`))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
//app.use(logger);
app.use(helmet());
app.use(morgan('tiny'));

// Joi function for course name validation
function validateCourse(course){
    const schema = Joi.object(
        {
            name: Joi.string().min(3).required(),
        }
    );
    return schema.validate(course);

}



const courses = [
    { id:1, name: 'course1'},
    { id:2, name: 'course2'},
    { id:3, name: 'course3'},

];






//GET METHODS
app.get('/', (req,res) => {
    res.send('Hello');
});



app.get('/api/courses', (req,res) => {
    res.send(courses);
});


app.get('/api/courses/:id', (req,res) => {
    const course = courses.find( c => c.id === parseInt(req.params.id) );
    if(!course) return res.status(404).send('Course with given ID not found');
    res.send(course);



});




//POST METHODS
app.post('/api/courses', (req,res) => {

    // validate the new course's name
    // if invalid return 400 - Bad request
    const { error } = validateCourse(req.body);  // result.error
    if(error)   return res.status(400).send(error.details[0].message);
        
    


    //if validation goes ok - create new object - push it to the server list
    const course = { id: courses.length+1,
    name: req.body.name, 
    };
    courses.push(course);
    res.send(course);

});


//PUT METHODS


// Put request for updating a course's name on the server's list
app.put('/api/courses/:id', (req,res) => {
    //CHECK IF COURSE WITH GIVEN ID EXISTS. IF NOT RETURN 404 BAD REQUEST
    const course = courses.find( c => c.id === parseInt(req.params.id) );
    if(!course) return res.status(404).send('Course with given ID not found');

    // validate new given name
    // if invalid return 400 - Bad request
    const { error } = validateCourse(req.body);  // result.error
    if(error)   return res.status(400).send(error.details[0].message);

    // update course
    course.name = req.body.name;
    res.send(course);


})


//DELETE METHOD
app.delete('/api/courses/:id', (req, res) => {
    //Look up the course
    const course = courses.find( c => c.id === parseInt(req.params.id) );
    //If it does not exist return 404
    if(!course) return res.status(404).send('Course with given ID not found');
    

    //delete
    const index = courses.indexOf(course);
    courses.splice(index,1);



    res.send(course);

});