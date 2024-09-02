const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Settings = sequelize.define('Settings', {
    logo: {
        type: DataTypes.STRING 
    },
    numberPhone: {
        type: DataTypes.STRING 
    },
    nameBanner: {
        type: DataTypes.STRING 
    },
    colorone: {
        type: DataTypes.STRING 
    },
    colortwo: {
        type: DataTypes.STRING 
    },
    colorthree: {
        type: DataTypes.STRING 
    },
    reminderbefore: {
        type: DataTypes.INTEGER 
    },
    remindercarebelow: {
        type: DataTypes.INTEGER 
    },
    remindercaretop: {
        type: DataTypes.INTEGER 
    }
}); 
module.exports = Settings;
