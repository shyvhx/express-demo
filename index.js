const config = require('config');
const express = require('express');
const helmet = require('helmet')
const logger = require('./middleware/logger.js')
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan')
const debug = require('debug')('app:startup');
const courses = require('./routes/courses');
const home = require('./routes/home')
const customers = require('./routes/customers')


app.set('view engine', 'pug');
app.set('views', './views'); //degault


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}....`))


mongoose.connect('mongodb://localhost/express-demo')
    .then(() => console.log('Connected to MongoDB...'))
    .catch( err => console.error('Could not connect to MongoDb'))




app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
//app.use(logger);
app.use(helmet());
app.use('/api/courses', courses)
app.use('/api/customers', customers)
app.use('/',home)


if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`app: ${app.get('env')}`);


// Configuration
console.log('App name:' + config.get('name'));
console.log('Mail server:' + config.get('mail.host'));
//console.log('Mail password' + config.get('mail.password'));

