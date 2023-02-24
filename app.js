//-------------NPM Moduels-------------
const express = require('express')
require('./util/mongoose')
//-------------------------------------
/* notes
npx nodemon app  
npm install // command installs modules (depenencies) in package.json file 
npm run start // command that starts the project the way it is in package.json "start": "node app.js"
//keyboard short cuts for VS Code
Ctrl+K+C comment muliple line
Ctrl+K+U uncomment
Ctrl+D select next occurance
Ctrl+shift+L select all occurance
*/
//-------------------------------------
const taskRoutes = require('./routes/task')
const userRoutes = require('./routes/user')
const app = express();
const port = 3000
app.use(express.json({limit : "500kb"})); //parser
//-------------------------------------


// will the code go through the rest of the the file if request doesnt start with /user?
app.use('/user', userRoutes)
app.use('/task', taskRoutes)
app.use(userRoutes)
app.use(taskRoutes)


//--------------------------------------------------------
app.use('/*', (req, res) => { //ERROR 404

    res.status(404).send('request was not found')
})
app.listen(port, () => { 

    console.log(`server is up on port :${port}`)

})
const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
    try {
        const task = await Task.findById("63f7ce0c5f25a1cd9100c898")
        await task.populate('owner')
        console.log(task.owner)

        const user = await User.findById("63f7e2631fd842a8907bd66c")
        await user.populate('tasks')
        console.log(user.tasks)
    } catch (e) {
        //console.log(e)
    }
}
main()