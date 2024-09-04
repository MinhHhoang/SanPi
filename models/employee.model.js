const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Employees = sequelize.define('Employees', {
    password: {
        type: DataTypes.STRING 
    },
    email: {
        type: DataTypes.STRING 
    },
    role_id: {
        type: DataTypes.STRING
    },
}); 
module.exports = Employees;
