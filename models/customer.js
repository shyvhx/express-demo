const Joi = require('joi') 
const mongoose = require('mongoose');

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






exports.Customers = Customers;
exports.validateCustomerName = validateCustomerName;
