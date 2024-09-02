const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const ReminderCares = sequelize.define('ReminderCares', {
    idcustomer: {
        type: DataTypes.INTEGER 
    },
    idbookingdetail :{
        type: DataTypes.INTEGER 
    },
    idschedule :{
        type: DataTypes.INTEGER 
    },
    idbooking: {
        type: DataTypes.INTEGER 
    },
    session: {
        type: DataTypes.INTEGER 
    },
    sessionreminder: {
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
    timedate:{
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
}); 
module.exports = ReminderCares;
