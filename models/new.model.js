const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const News = sequelize.define('News', {
    title: {
        type: DataTypes.STRING 
    },
    content: {
        type: DataTypes.STRING 
    },
    image: {
        type: DataTypes.STRING 
    }, 
}); 
module.exports = News;
