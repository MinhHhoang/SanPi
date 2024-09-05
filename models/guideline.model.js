const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Guidelines = sequelize.define('Guidelines', {
    title: {
        type: DataTypes.STRING 
    },
    image: {
        type: DataTypes.STRING 
    },
    content: {
        type: DataTypes.STRING 
    },
    video_url :{
        type: DataTypes.STRING
    }
}); 
module.exports = Guidelines;
