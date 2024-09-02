const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Guidelines = sequelize.define('Guidelines', {
    title: {
        type: DataTypes.INTEGER 
    },
    image: {
        type: DataTypes.STRING 
    },
    content: {
        type: DataTypes.STRING 
    },
    video_url :{
        type: DataTypes.INTEGER
    },
    type_coin : {
        type: DataTypes.STRING 
    },
}); 
module.exports = Guidelines;
