const bodyParser = require('body-parser')

const express = require('express')

const cors = require('cors')
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'frontend')));


app.use(cors());

const User = require('./models/userModel')
const Expense = require('./models/expenseModel')

app.use(bodyParser.json({extended: false}))

const sequelize = require('./utility/database');

const signUpRoutes = require('./routes/signupRoutes')
const loginRoutes =  require('./routes/loginRoutes')
const expenseRoutes = require('./routes/expenseRoutes')

app.use('/user',signUpRoutes);
app.use('/user',loginRoutes)
app.use('/expense',expenseRoutes)

Expense.belongsTo(User)
User.hasMany(Expense);


sequelize.sync()
.then(()=>{
    app.listen(3000)

}).catch(err=>console.log(err))