const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("./models/user");
const { schema } = require("./models/user");

schema.statics.findByCredentials = async (email, password) => { 


    const user = await User.findOne({ email })

    if (!user) { throw new Error('couldnt find data') }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) { throw new Error('coundnt find data') }

    return user
    
}