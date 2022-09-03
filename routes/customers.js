const express = require('express');
const Joi = require('joi') 
const mongoose = require('mongoose');
const router = express.Router();






// Joi function for customers name validation
function validateCustomerName(customer){
    const schema = Joi.object(
        {
            name: Joi.string().min(3).required(),
            phone: Joi.string().min(3).required(),
            isGold: Joi.boolean()
        }
    );
    return schema.validate(customer);

}


const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },

});

const Customers = mongoose.model('Customers', customerSchema);


//GET METHODS
router.get('/', async (req,res) => {
    const customers = await Customers.find().sort('name');
    res.send(customers);
});


router.get('/:id', async (req,res) => {
    const customer = await Customers.findById(req.params.id);
    console.log(customer);
    if(!customer) return res.status(404).send('customer with given ID not found');

    res.send(customer);
});



//POST METHODS
router.post('/', async (req,res) => {
    // validate the new customer's name
    // if invalid return 400 - Bad request
    const { error } = validateCustomerName(req.body);  // result.error
    if(error)   return res.status(400).send(error.details[0].message);
        
    

    //if validation goes ok - create new object - push it to the database
    let customer = new Customers({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
     });
    customer = await customer.save();
    res.send(customer);

});


//PUT METHODS
// Put request for updating a customer's name on the server's list
router.put('/:id', async (req,res) => {
    // validate new given name
    // if invalid return 400 - Bad request
    const { error } = validateCustomerName(req.body);  // result.error
    if(error)   return res.status(400).send(error.details[0].message);


    const customer = await Customers.findByIdAndUpdate(req.params.id, { name: req.body.name}, { new: true});
    if(!customer) return res.status(404).send('customer with given ID not found');

    res.send(customer);


})


//DELETE METHOD
router.delete('/:id', async (req, res) => {
    const customer = await Customers.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(404).send('customer with given ID not found');
    res.send(customer);
});



module.exports = router;
