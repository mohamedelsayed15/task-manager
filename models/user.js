const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')


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
    
    const user = await User.findOne({email})
}
schema.pre('save', async function (next) { 

    if (this.isModified('password')) { 

        this.password = await bcrypt.hash(this.password,8)
    }
    

    next()
})






const User = mongoose.model('User', schema)

module.exports= User