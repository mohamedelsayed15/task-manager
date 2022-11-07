const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/user')

//=============================================

router.post('/createUser', async (req, res) => { 
    try {

        const user = await new User(req.body)
        await user.save()
        res.send(user)
    }
    catch (e) {
        res.status(400).send(e)
        console.error(e)
    }
})
router.post('/login', async (req,res) => { 
    try { 
        const user = await User.findByCredentials(req.body.email, req.body.password)
        
        res.send(user)

    } catch (e) { 
        res.status(400).send(e)
        console.error(e)
    }
})
router.get('/getUsers', async (req, res) => { 

    try {
        const users = await User.find({})
        res.send(users) 
    } catch (e) { 
        res.status(500).send()
    }
})
router.get('/:id', async (req, res) => { 

    try {
        const user = await User.findById(req.params.id)
        if (!user) { res.status(404).send() }
        res.send(user)
    } catch (e) { 
        res.status(500).send(e)
    }
})
router.patch('/update/:id', async (req, res) => { 
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'password', 'email', 'age']
        const validUpdate = updates.every((update) => {
            return allowedUpdates.includes(update)
        })
        if (validUpdate === false) { 
            return res.status(404).send({ ERROR: "Invalid Updates!" })
        }
        // const user = await User.findByIdAndUpdate(req.params.id, req.body,
        //     {
        //         new: true, // returns the updated data
        //         runValidators:true // runs validation for the update
        //     })
        const user = await User.findById(req.params.id)

        updates.forEach( update => user[update]=req.body[update] )


        await user.save()

        if (!user) {return res.status(404).send('user were not found') }
        res.send(user)
    } catch (e) { 
        res.status(500).send(e)
        console.error(e)
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const user = await  User.findByIdAndDelete(req.params.id)
        if (!user) { return res.status(404).send({ ERROR: "user were not found" }) }
        res.send(user)

    } catch (e) { 
        res.status(500).send(e)

    }
 })
//================================================= 
module.exports = router