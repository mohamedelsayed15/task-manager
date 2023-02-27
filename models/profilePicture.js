const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    profilePicture: { type: Buffer },

    owner: { type: mongoose.Schema.Types.ObjectId, required: true , ref: 'User'}

})

const Pic = mongoose.model('Pic', schema)

module.exports= Pic