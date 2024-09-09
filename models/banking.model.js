const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const Customers = require('../models/customer.model');

const Bankings = sequelize.define('Bankings', {
    name_bank: {
        type: DataTypes.STRING 
    },
    stk: {
        type: DataTypes.INTEGER 
    },
    full_name: {
        type: DataTypes.STRING 
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Customers', // Tên của bảng liên kết
            key: 'id'
        }
    }
}); 


// Thiết lập mối quan hệ
Bankings.belongsTo(Customers, { foreignKey: 'customer_id' });
Customers.hasMany(Bankings, { foreignKey: 'customer_id' });

module.exports = Bankings;
