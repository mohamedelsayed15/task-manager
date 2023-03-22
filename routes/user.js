const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const checkEmailToken = require('../middleware/verifyEmail')
const checkPasswordToken = require('../middleware/verifyForPassword')
const Pic = require('../models/profilePicture')
const upload = require('../multer/upload')
const sharp = require('sharp')
const { afterDeletion,
    sendWelcomeEmail,
    sendVerificationEmail,
    sendVerificationPassword } = require('../emails/mg')
const {
    signUpValidator,
    logInValidator,
    updateUserValidator
} = require('../joi-validators/user-validator-with-joi')
const e = require('express')

//=============================================
//Signup
router.post('/createUser', async (req, res) => { 
    try {
        //validates confirm password
        const value = await signUpValidator.validateAsync(req.body, {
            abortEarly: false
        })

        const user = await new User({
            name: value.name,
            email: value.email,
            password: value.password,
            DOB: value.DOB
        })

        const verificationToken = await user.generateEmailToken()

        await user.save()

        sendWelcomeEmail(user.email,user.name)

        const token = await user.genAuthToken()

        sendVerificationEmail(user.email , user.name , verificationToken )

        res.status(201).send({
            message: "Please check your mail",
            user,
            token
        })

    } catch (e) {
        console.log(e)
        if (e.code) { return res.status(409).send({ Error: "Account with this email already exists" })}
        res.status(400).send(e)
    }
})
//check email verification
router.get('/verifyMe/:token', checkEmailToken, (req, res) => {
    try { 

        res.send('verified')

    }catch (e) { 

        res.send(e)
    }
})
//request reset password
router.post('/resetMyPassword', async (req, res) => { 
    try {

        const user = await User.findOne({ email: req.body.email })

        if (!user) { return res.status(400).send({ error: "couldn't find user" })}

        const verificationToken = await user.generatePasswordToken()

        sendVerificationPassword(user.email, user.name, verificationToken)

        res.send({message:"Please check your mail"})

    } catch (e) {
        res.status(404).send(e)
    }
})
//endpoint for checking user request to reset password
router.patch('/verifyMe/:token', checkPasswordToken,(req, res) => {
    try { 

        res.send({message:"Your password has been reset"})

    }catch (e) { 

        res.status(400).send(e)
    }
})
//Login
router.post('/login', async (req,res) => { 
    try {

        const value = await logInValidator.validateAsync(req.body, {
            abortEarly: false
        })

        const user = await User.findByCredentials(value.email, value.password)

        if (!user) { return res.status(401).send({ error: "couldn't find user" })}

        const token = await user.genAuthToken()

        res.send({ user, token })

    } catch (e) {
        res.status(400).send(e)
    }
})
//Profile
router.get('/me', auth, async (req, res) => {
    try {

        res.send(req.user)

    } catch (e) { 
        res.status(400).send(e)
    } 
})
//Update user
router.patch('/update/me',auth ,async (req, res) => {
    try {
        const value = await updateUserValidator.validateAsync(req.body, {
            abortEarly: false
        })

        const updates = Object.keys(value)

        updates.forEach(update => req.user[update] = value[update])

        await req.user.save()

        res.send(req.user)

    } catch (e) { 
        res.status(400).send(e)
    }
})
//Logout
router.post('/logout', auth, async (req, res) => {
    try { 
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)

        await req.user.save()

        res.send('logged out')

    } catch (e) {

        res.status(400).send(e)

    }
})
//Logout from all 
router.post('/logoutAll', auth, async (req, res) => {
    try { 

        req.user.tokens = []

        await req.user.save()

        res.send('logged out')

    } catch (e) {

        res.status(400).send(e)

    }
}) 
//Profile picture
router.post('/me/profilePicture', auth, upload.single('profilePicture'), async (req, res) => {
    
    if(!req.file) { return res.status(400).send({ Error: 'no file were uploaded' }) }
    
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()

        await req.user.populate({

            path: 'pic'
        })
        if (!req.user.pic) {
    
            const pic = await new Pic({
                profilePicture: buffer,
                owner: req.user._id
            })
            await pic.save()
        }else {
            req.user.pic.profilePicture = buffer

            await req.user.pic.save()
        }

        res.send()
    
},(error, req, res, next) => {

    res.status(400).send({ Error: error.message })
})
// get profile picture
router.get('/profilePicture/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        await user.populate({

            path: 'pic'
        }) 

        res.set("Content-type", "image/png")

        res.send(user.pic.profilePicture)

    } catch (e) { 

        res.status(400).send(e)

    } 
})
//delete profile picture
router.get('/delete/profilePicture', auth, async (req, res) => {

    const pic = await Pic.findOneAndDelete({ owner: req.user._id })

    res.send({message:"deleted"})

}, (error, req, res, next) => { 

    res.status(400).send({ Error: error.message })

})
//Delete user
router.delete('/me',auth,async (req, res) => {
    try {

        await req.user.remove() //*Pre remove to delete tasks on user model*

        afterDeletion(req.user.email,req.user.name)

        res.send(req.user)

    } catch (e) { 
        console.log(e)
        res.status(500).send(e)
    }
})
//================================================= 
module.exports = router