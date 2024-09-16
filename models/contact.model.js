const sequelize = require('./connection');
const { DataTypes } = require('sequelize');

const Contacts = sequelize.define('Contacts', {
    full_name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    sdt: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
});
module.exports = Contacts;
