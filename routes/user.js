const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const Task = require('../models/task')
//=============================================
//Signup
router.post('/createUser', async (req, res) => { 
    try {
        const user = await new User(req.body)

        await user.save()

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
//Profile
router.get('/me', auth, async (req, res) => { 
    
    res.send(req.user)

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
//Delete user
router.delete('/me',auth,async (req, res) => {
    try {
        /*
        //first approach 
        await Task.deleteMany({ owner: req.user._id })
        const user = await User.findByIdAndDelete(req.user._id)
        */
        await req.user.remove() //*Pre remove to delete tasks on user model*

        res.send(req.user)

    } catch (e) { 
        res.status(500).send(e)
    }
})
//================================================= 
module.exports = router