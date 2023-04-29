const Sequelize = require('sequelize')

const sequelize = new Sequelize('expense11','root','connectnode',{
    dialect:'mysql',
    host: 'localhost'
})

module.exports = sequelize ;