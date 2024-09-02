const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Customers = sequelize.define('Customers', {
    full_name: {
        type: DataTypes.STRING 
    },
    email: {
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
    },
    active: {
        type: DataTypes.TINYINT(1)
    },
}); 
module.exports = Customers;
