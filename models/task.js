const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    title: { type: String, trim: true, required: true },

    description: { type: String, required: true },

    completed: { type: Boolean, default: false },

    owner: { type: mongoose.Schema.Types.ObjectId, required: true , ref: 'User'}

}, {
    timestamps:true
})
//virtual pic field for .populate()
schema.virtual('taskPic', {
    ref: 'TaskPic',
    localField: '_id',
    foreignField: 'owner'
})

const Task = mongoose.model('Task', schema)

module.exports= Task