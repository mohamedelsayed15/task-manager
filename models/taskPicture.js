const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    taskPicture: { type: Buffer },

    owner: { type: mongoose.Schema.Types.ObjectId, required: true , ref: 'Task'}

})

const TaskPic = mongoose.model('TaskPic', schema)

module.exports= TaskPic