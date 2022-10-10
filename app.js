//-------------NPM Moduels-------------
const express = require('express')
require('./util/mongoose')
//-------------------------------------
const taskRoutes = require('./routes/task')
const userRoutes = require('./routes/user')
const app = express();
const port = process.env.PORT||3000
app.use(express.json()); //parser
//-------------------------------------
app.use('/user', userRoutes)
app.use('/task',taskRoutes)

//--------------------------------------------------------
app.use('/*', (req, res) => { //ERROR 404

    res.status(404).send('request were not found')
})
app.listen(port, () => { 

    console.log(`server is up on port :${port}`)

})
