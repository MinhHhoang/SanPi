const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Employees = sequelize.define('Employees', {
    full_name: {
        type: DataTypes.STRING 
    },
    password: {
        type: DataTypes.STRING 
    },
    email: {
        type: DataTypes.STRING 
    },
    phone : {
        type: DataTypes.STRING 
    },
    role_id: {
        type: DataTypes.STRING
    },
    active: {
        type: DataTypes.TINYINT(1)
    },
}); 
module.exports = Employees;
