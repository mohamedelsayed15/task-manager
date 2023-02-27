const mongoose = require('mongoose')

try {
    mongoose.connect(process.env.MONGODB_CONNECTION)

} catch (e) { 
    console.log(e)
}