const mongoose = require('mongoose')

try {
    mongoose.connect('mongodb://127.0.0.1:27017/task-manger-api')

} catch (e) { 
    console.log(e)
}