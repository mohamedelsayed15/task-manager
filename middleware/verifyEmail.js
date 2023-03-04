const jwt = require('jsonwebtoken')
const User = require('../models/user')
//==========================================
const checkEmailToken = async (req, res, next) => { 
    try {

        const token = req.params.token

        const decoded = jwt.verify(token,process.env.JWT_VERIFY_ME)

        const user = await User.findById(decoded._id)

        if (!user) { throw new Error()}

        if (user.verificationToken !== token) { throw new Error()}

        user.verifiedEmail = true

        user.verificationToken = null

        await user.save()

        next()

    } catch (e) {
        console.log(e)
        res.status(401).send({Error : "Your not authenticated"})
    }
}
module.exports = checkEmailToken