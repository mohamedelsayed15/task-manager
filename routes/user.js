const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const multer = require('multer')
const Pic = require('../models/profilePicture')
const sharp = require('sharp')
const {afterDeletion,sendWelcomeEmail} = require('../emails/account')
//=============================================
//Signup
router.post('/createUser', async (req, res) => { 
    try {
        const user = await new User(req.body)

        await user.save()

        sendWelcomeEmail(user.email,user.name)

        const token = await user.genAuthToken()
        
        res.status(201).send({ user, token })

    }catch (e) {
        res.status(400).send(e)
        console.error(e)
    }
})
//Login
router.post('/login', async (req,res) => { 
    try { 
        const user = await User.findByCredentials(req.body.email, req.body.password) 

        const token = await user.genAuthToken()
        
        res.send({ user, token })
        
    } catch (e) { 
        res.status(404).send({ Error: "couldnt find user" })
    }
})
//Logout
router.post('/logout', auth, async (req, res) => {
    try { 
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)

        await req.user.save()

        res.send('logged out')

    } catch (e) {
        res.send(e)
    }
})
//Profile
router.get('/me', auth, async (req, res) => { 
    try {
        res.send(req.user )
    } catch (e) { 
        res.send(e)
    } 
})
//Update user
router.patch('/update/me',auth ,async (req, res) => { 
    try {
        const updates = Object.keys(req.body) // transferes the names of properties of an object into an array
        const allowedUpdates = ['name', 'password', 'email', 'age']
        // every will return false if any of the returns is false
        const validUpdate = updates.every((update) => {
            // here we take the body and check if each is in the allowed updates
            return allowedUpdates.includes(update)})
        
        if (validUpdate === false) { return res.status(404).send({ ERROR: "Invalid Updates!" })}

        updates.forEach(update => req.user[update] = req.body[update])

        await req.user.save()

        res.send(req.user)

    } catch (e) { 
        res.status(500).send(e)
    }
})
//Logout from all 
router.post('/supermeLogout', auth, async (req, res) => {
    try { 

        req.user.tokens = []

        await req.user.save()

        res.send('logged out')

    } catch (e) {
        res.send(e)
    }
}) 
//multer
const upload = multer({
    //dest: 'profilePicture',
    limits: {
        fileSize: 5242880 , //1024 * 1024* 5 //5mb
        files: 1,
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|png|gif|jpeg)$/))
        {
            cb(new Error('file is not supported'), false) //reject
        }
        cb(null,true)//accept
    }
})
//Profile picture
router.post('/me/profilePicture', auth, upload.single('profilePicture'), async (req, res) => {
    
    if(!req.file) { return res.send({ Error: 'no file were uploaded' }) }
    
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    console.log(buffer)
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
        res.send(e)
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
        /*
        //first approach 
        await Task.deleteMany({ owner: req.user._id })
        const user = await User.findByIdAndDelete(req.user._id)
        */
        await req.user.remove() //*Pre remove to delete tasks on user model*

        afterDeletion(req.user.email,req.user.name)

        res.send(req.user)

    } catch (e) { 
        res.status(500).send(e)
    }
})
//================================================= 
module.exports = router