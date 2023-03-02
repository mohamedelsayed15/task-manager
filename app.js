//-------------NPM Modules-------------
const express = require('express')
//-----------DB connection-------------
require('./util/mongoose')
//---------------Routes----------------
const taskRoutes = require('./routes/task')
const userRoutes = require('./routes/user')
//--------------Express----------------
const app = express();
app.use(express.json({ limit: "3kb" })); //parser//json data size limitation
//-------------endpoints--------------
app.use('/user', userRoutes)
app.use('/task', taskRoutes)

app.use('/*', (req, res) => { //Default

    res.status(404).send('task-app api')
})

/* notes

status codes (201 created)(401 unauthorized)(404 not found) (409 duplication of data)

status codes defaults (200 accepted) (400 bad request)

npx nodemon app  

to install dev dependencies npm i jest --save-dev (saved as a developer dependency)

npm install // command installs modules (dependencies) in package.json file 

npm run test // command that starts the project the way it is in package.json "test": "jest"

//keyboard shortcuts for VS Code

Ctrl+K+C comment multiple line ===== Ctrl+K+U uncomment
Ctrl+D select next occurrence  ===== Ctrl+shift+L select all occurrence

*/
app.listen(process.env.PORT, () => { 

    console.log(`server is up on port :${process.env.PORT}`)

})