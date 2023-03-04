//-------------NPM Modules-------------
const express = require('express')
//-----------DB connection-------------
require('./util/mongoose')
//---------------Routes----------------
const taskRoutes = require('./routes/task')
const userRoutes = require('./routes/user')
//--------------Express----------------
const app = express();
app.use(express.json({ limit: "3kb" })) //parser//json data size limitation
//-------------endpoints--------------
app.use('/user', userRoutes)
app.use('/task', taskRoutes)

app.use('/*', (req, res) => { //Default

    res.status(404).send('task-app api')
})

module.exports = app