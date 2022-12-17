const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

/*note about mongodb if u are altering schema
once it was built u gonna have to delete the collection*/
const schema = new mongoose.Schema({

    name: {type: String,required: true,trim: true},
    email: {type: String, required: true,lowercase:true, unique: true,
            validate(value)
            {
            if (!validator.isEmail(value))
            { throw new Error('invalid email format') }
            }},
    password: {// note we cant use trim :true as it might be a part of the password
        type: String, required: true, minlength: 7, 

        validate(value) {
            if (value.toLowerCase().includes('password')) { throw new Error('password')}
         }},
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) { throw new Error('age must be a positive number') }
        }
    },
    token: [{
        token: {
            type: String,
            required: true
        }
    }]
})
//login by credentials
schema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })

    if (!user) { throw new Error('unable to find user') }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) { throw new Error('unable to find user') }

    return user
}
//hashing password before use save()
schema.pre('save', async function (next) { // provided by mongoose

    // isModified is provided by mongoose
    if (this.isModified('password')) { 

        this.password = await bcrypt.hash(this.password,8)
    }  
    next()
})
schema.methods.genAuthToken = async function () { 
    
    const token = await jwt.sign({ id: this._id.toString() }, 'hi')
    this.token = this.token.concat({ token })
    await this.save()
    

    return token
}
const User = mongoose.model('User', schema)

module.exports= User