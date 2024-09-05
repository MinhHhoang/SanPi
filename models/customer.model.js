const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const { password } = require('../config/database.config');

const Customers = sequelize.define('Customers', {
    full_name: {
        type: DataTypes.STRING 
    },
    email: {
        type: DataTypes.STRING 
    },
    password: {
        type: DataTypes.STRING 
    },
    image : {
        type: DataTypes.STRING 
    },
    phone : {
        type: DataTypes.STRING 
    },
    ref_email: {
        type: DataTypes.STRING 
    }
}); 
module.exports = Customers;
