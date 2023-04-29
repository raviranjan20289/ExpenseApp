const bodyParser = require('body-parser')

const express = require('express')

const cors = require('cors')
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'frontend')));


app.use(cors());

app.use(bodyParser.json({extended: false}))

const sequelize = require('./utility/database');

const signUpRoutes = require('./routes/signupRoutes')

app.use('/user',signUpRoutes);

sequelize.sync()
.then(()=>{
    app.listen(3000)

}).catch(err=>console.log(err))