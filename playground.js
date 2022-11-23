const bcrypt = require('bcryptjs')
const { schema } = require('./models/user')
schema.pre('save', async function (next) {
    
    if (this.isModfied('password')) {

        this.password = await bcrypt.hash(this.password, 8)
        next()
    }
})
schema.statics.findByCredentials = async (email, password) => {

    const user = User.findOne({ email })
    if (!user) { throw new Error('cant log in') }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) { throw new Error('cant log in') }
    else { return user}
}