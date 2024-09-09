const sequelize = require('./connection');
const { DataTypes } = require('sequelize');

const Coins = sequelize.define('Coins', {
    name: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    giaban: {
        type: DataTypes.INTEGER
    }, 
    giamua: {
        type: DataTypes.INTEGER
    },
    sodu: {
        type: DataTypes.INTEGER
    },
    address_pay: {
        type: DataTypes.STRING
    }
});
module.exports = Coins;
