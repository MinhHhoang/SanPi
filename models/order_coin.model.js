const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const { password } = require('../config/database.config');

const OrderCoins = sequelize.define('OrderCoins', {
    sku: {
        type: DataTypes.STRING 
    },
    status_order: {
        type: DataTypes.STRING 
    },
    type_order: {
        type: DataTypes.STRING 
    },
    type_coin: {
        type: DataTypes.STRING 
    },
    wallet_coin: {
        type: DataTypes.STRING 
    },
    price_coin_current : {
        type: DataTypes.INTEGER 
    },
    count_coin : {
        type: DataTypes.INTEGER 
    },
    total_money: {
        type: DataTypes.INTEGER 
    },
    stk: {
        type: DataTypes.STRING 
    },
    image_bill: {
        type: DataTypes.STRING 
    },
    stk_name: {
        type: DataTypes.STRING 
    },
    stk_bank: {
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

// Define relationships here
OrderCoins.belongsTo(Customers, { foreignKey: 'customer_id' });
Customers.hasMany(OrderCoins, { foreignKey: 'customer_id' });

module.exports = OrderCoins;
