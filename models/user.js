const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const Pic = require('../models/profilePicture')
//==================================================
const schema = new mongoose.Schema({

    name: { type: String, required: true, trim: true },

    email: {type: String, required: true,index: { unique: true }, lowercase: true, 

        validate(value) {

            if (!validator.isEmail(value)) { throw new Error('invalid email format')}
        }
    },
    password: {// note we cant use trim :true as it might be a part of the password
        type: String, required: true, minlength: 7,

        validate(value) {
            if (value.toLowerCase().includes('password')) { throw new Error('password')}
        }
    },
    DOB: {
        type: Date,
        required: true,
        trim:true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    verificationToken: { type: String },

    verifiedEmail: { type: Boolean , default :false }

}, {
    timestamps: true
})
//virtual tasks field for .populate()
schema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField:'owner'
})
//virtual pic field for .populate()
schema.virtual('pic', {
    ref: 'Pic',
    localField: '_id',
    foreignField: 'owner',
    justOne: true
})
//login by credentials
schema.statics.findByCredentials = async (email, password) => {

        const user = await User.findOne({ email })

        if (!user) { return null }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) { return null }

        return user

}
//filtering user data 
//toJSON retrieves the object the shape u want
schema.methods.toJSON = function () {
    
        const  userObject = this.toObject()
        delete userObject.password
        delete userObject.tokens
        delete userObject.verificationToken
        delete userObject.verifiedEmail
    
        return userObject
}
//hashing password before use save()
schema.pre('save', async function (next) { // provided by mongoose

    // isModified is provided by mongoose
    if (this.isModified('password')) { 

        this.password = await bcrypt.hash(this.password,8)
    }
    next()
})
//deleting tasks before a user is removed
schema.pre('remove', async function (next) { 

    await Task.deleteMany({ owner: this._id })

    await Pic.deleteOne({ owner: this._id })
    
    next()
})
//authentication token generation
schema.methods.genAuthToken = async function () { 

    const token = await jwt.sign({ _id: this._id.toString() }, process.env.JWT)

    this.tokens = this.tokens.concat({ token })

    await this.save()

    return token
}
//token for E-mail verification
schema.methods.generateEmailToken = async function () { 

    const token = await jwt.sign({ _id: this._id.toString() }, process.env.JWT_VERIFY_ME,{ expiresIn: '1h' })

    this.verificationToken = token

    await this.save()

    return token
}
schema.methods.generatePasswordToken = async function () { 

    const token = await jwt.sign({ _id: this._id.toString() }, process.env.JWT_VERIFY_ME_FOR_PASSWORD,{ expiresIn: '1h' })

    this.verificationToken = token

    await this.save()

    return token
}
//===============================================================
const User = mongoose.model('User', schema)
module.exports= User