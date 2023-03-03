const jwt = require('jsonwebtoken')
const User = require('../models/user')
//==========================================
const checkPasswordToken = async (req, res, next) => { 
    try {

        const token = req.params.token

        const decoded = jwt.verify(token,process.env.JWT_VERIFY_ME_FOR_PASSWORD)

        const user = await User.findById(decoded._id)

        if (!user) {throw new Error()}

        if (user.verificationToken !== token) {throw new Error() }

        if (user.verifiedEmail !== true) { user.verifiedEmail = true }

        user.password = req.body.newPassword

        user.verificationToken = null

        user.tokens = []

        await user.save()

        next()

    } catch (e) {  
        console.log(e)
        res.status(401).send({Error : "Your not authenticated"})
    }
}
module.exports = checkPasswordToken