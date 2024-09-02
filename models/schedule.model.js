const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Schedules = sequelize.define('Schedules', {
    idcustomer: {
        type: DataTypes.INTEGER 
    },
    idbookingdetail :{
        type: DataTypes.INTEGER 
    },
    idbooking: {
        type: DataTypes.INTEGER 
    },
    session: {
        type: DataTypes.INTEGER 
    },
    phone: {
        type: DataTypes.STRING 
    },
    factoryid :{
        type: DataTypes.INTEGER
    },
    note : {
        type: DataTypes.STRING 
    },
    serviceid: {
        type: DataTypes.STRING 
    },
    timehour: {
        type: DataTypes.STRING
    },
    timedate:{
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
}); 
module.exports = Schedules;
