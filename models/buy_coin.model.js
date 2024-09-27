const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const { password } = require('../config/database.config');
const Customers = require('./customer.model');

const BuyCoins = sequelize.define('BuyCoins', {
    sku: {
        type: DataTypes.STRING 
    },
    status_order: {
        type: DataTypes.STRING 
    },
    type_coin: {
        type: DataTypes.STRING 
    },
    wallet_coin: {
        type: DataTypes.STRING 
    },
    count_coin : {
        type: DataTypes.INTEGER 
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
BuyCoins.belongsTo(Customers, { foreignKey: 'customer_id' });
Customers.hasMany(BuyCoins, { foreignKey: 'customer_id' });

module.exports = BuyCoins;
