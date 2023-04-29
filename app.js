const bodyParser = require('body-parser')

const express = require('express')
require('dotenv').config();

const cors = require('cors')
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'frontend')));


app.use(cors());

const User = require('./models/userModel')
const Expense = require('./models/expenseModel')
const Order = require('./models/orderModel')

app.use(bodyParser.json({extended: false}))

const sequelize = require('./utility/database');

const signUpRoutes = require('./routes/signupRoutes')
const loginRoutes =  require('./routes/loginRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const purchaseRoutes = require('./routes/purchaseRoutes')
const premiumRoutes = require('./routes/premiumRoutes')

app.use('/user',signUpRoutes);
app.use('/user',loginRoutes)
app.use('/expense',expenseRoutes)
app.use('/purchase',purchaseRoutes)
app.use('/premium',premiumRoutes)

Expense.belongsTo(User)
User.hasMany(Expense);

Order.belongsTo(User)
User.hasMany(Order);



sequelize.sync()
.then(()=>{
    app.listen(3000)

}).catch(err=>console.log(err))