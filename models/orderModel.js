const Sequelize = require('sequelize');

const sequelize = require('../utility/database');

const Order = sequelize.define('order',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentId:{
        type: Sequelize.STRING,
        unique: true,
    } ,
    orderId:{
        type: Sequelize.STRING,
        unique: true,
    },
    status: Sequelize.STRING

})

module.exports = Order;