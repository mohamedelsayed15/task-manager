const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')


const schema = new mongoose.Schema({

    name: {type: String,required: true,trim: true},
    email: {type: String, required: true,lowercase:true, unique: true,
            validate(value)
            {
            if (!validator.isEmail(value))
            { throw new Error('invalid email format') }
            }},
    password: {
        type: String, required: true, trim: true, minlength: 7,

        validate(value) {
            if (value.toLowerCase().includes('password')) { throw new Error('password')}
         }},
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) { throw new Error('age must be a positive number') }
        }
    }
})
schema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })

    if (!user) { throw new Error('unable to find user') }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) { throw new Error('Unable to login') }

    return user
}
schema.pre('save', async function (next) { 


    console.log(this.isModified('password'))
    if (this.isModified('password')) { 

        this.password = await bcrypt.hash(this.password,8)
    }
    

    next()
})
const User = mongoose.model('User', schema)

module.exports= User