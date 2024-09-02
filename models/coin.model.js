const sequelize = require('./connection');
const { DataTypes } = require('sequelize');

const Coins = sequelize.define('Coins', {
    name: {
        type: DataTypes.STRING 
    },
    sodu: {
        type: DataTypes.INTEGER
    },
    address_pay: {
        type: DataTypes.STRING 
    }
}); 
module.exports = Coins;
