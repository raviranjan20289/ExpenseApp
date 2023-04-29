const Sequelize = require('sequelize');

const sequelize = require('../utility/database');

const User = sequelize.define('user',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING
    } ,
    email:{
        type: Sequelize.STRING,
        unique: true,
    },
    password: Sequelize.STRING,
    premiumUser: Sequelize.BOOLEAN

})

module.exports = User;