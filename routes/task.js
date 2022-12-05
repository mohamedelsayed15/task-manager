const express = require('express')
const router = express.Router()
const Task = require('../models/task')
//=========================================================
router.post('/createTask', async (req, res) => { 
    try {
        const task = await new Task(req.body)
        await task.save()
        res.status(200).send({
            message: 'done'
        })
    } catch (e) { 
        res.status(400).send(e)
    }
})
router.get('/getTasks', async (req, res) => { 
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) { 
        res.status(500).send() 
    }
})
router.get('/taskID/:id', async (req, res) => { 
    try {
        const task = await Task.findById(req.params.id)
        if (!task) { res.status(404).send() }
        res.send(task)

    } catch (e) { 
        res.status(500).send()
    }
})
router.patch('/:id', async (req, res) => {
   try{
        const updates = Object.keys(req.body)
        const allowedUpdates = ["description", "completed"]
        const validupdates = updates.every(update => allowedUpdates.includes(update))
        if (validupdates=== false ) { return res.status(404).send( { ERROR: "invalid updates!" }) }
        const task = await Task.findById(req.params.id)

        updates.forEach(update => task[update] = req.body[update])

        await task.save()
        if (!task) { return res.status(404).send({ ERROR: "task were not found" }) }
        res.send(task)
    } catch (e) {
        res.send(e)
        console.error(e)
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) { 
            return res.status(404).send({ERROR: "task were not found"})
        }
        res.send(task)
    } catch (e) { 
        res.status(500).send(e)
    }
})
//=========================================================
module.exports = router
