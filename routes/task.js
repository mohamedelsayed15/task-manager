const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')
const TaskPic = require('../models/taskPicture')
const multer = require('multer')
const sharp = require('sharp')
//=========================================================
const upload = multer({
    
    limits: {
        fileSize: 3145728 , //1024 * 1024* 3 //3mb
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
// create a task
router.post('/createTask',auth,upload.single('taskPic'),async (req, res) => { 
    try {

        const task = await new Task({
            // ... means everything in req.body
            ...req.body,
            owner:req.user._id
        })

        await task.save()

        if (req.file) {  

            const buffer = await sharp(req.file.buffer).png().toBuffer()

            const taskPic = await new TaskPic({

                taskPicture: buffer,
                owner: task._id

            })
            await taskPic.save()
        }

        res.status(201).send()
    } catch (e) { 
        console.log(e)
        res.status(400).send(e)
    }
})
// VERY IMPORTANT NOTE PLS NOTE THAT PLSSSSSS
// we have NUMBER OF 2 END POINTS WITH "GET" 
//one gets id  in parameters and the other doesnt
// what happens when u have the one with id in parameters above the other one
// the application will go and find the one with id as match and then 
// TAKE THE ID AS "myTasks" which will cause an error
// so U MAKE THE ONE WITH ID BELOW THE OTHER ONE, TY PLS DONT MAKE THIS MISTAKE AGAIN
//===================================================================================
// query ?completed='true'
// query ?limit=10&skip=30
// query ?sortBy=createdAt:asc
// query ?sortBy=createdAt&order=-1
// tasks queries 
router.get('/myTasks', auth, async (req, res) => { //NOTE ME
    try {
        const match = {}

        if (req.query.completed) { 

        match.completed = req.query.completed === 'true'

    }
        const sort = {}

        if (req.query.sortBy) { 

            //we use bracket notation because we deal with a string in sortby
            // so if we wanna assign a string value to object we use []

            if (req.query.order !== '1') { req.query.order = -1 }
            
            sort[req.query.sortBy] = parseInt(req.query.order)

        }

        await req.user.populate({
            path: 'tasks',
            match, 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })

        //filter tasks to get only ids and their titels 

        const filteredTasks = req.user.tasks.map( task => {

            return { _id: task._id, title: task.title }
        })

        res.send(filteredTasks)

    } catch (e) { 
        res.status(500).send()
        console.log(e)
    }
})
//get a task by id
router.get('/:_id', auth, async (req, res) => { //NOTE ME
    try {

        const task = await Task.findOne({ _id: req.params._id, owner: req.user._id })

        if (!task) { return res.status(404).send({ Error: "not found" }) }

        res.status(200).send(task)

    } catch (e) {
        res.send(e)
    }
})
//task image
router.get('/taskImage/:_id', auth, async (req, res) => { //related to request above
    try {

        const task = await Task.findOne({ _id: req.params._id, owner: req.user._id })

        if (!task) { return res.status(404).send({ Error: "not found" }) }

        await task.populate({

            path :'taskPic'
        })

        res.set("Content-type", "image/png")
        res.status(200).send( task.taskPic.taskPicture)

    } catch (e) {
        res.send(e)
    }
})
//Edit task
router.patch('/alterTask/:_id', auth,upload.single('taskPic'),async (req, res) => {
    try{
        const updates = Object.keys(req.body)
        const allowedUpdates = ["title","description", "completed"]
        const validupdates = updates.every(update => allowedUpdates.includes(update))
        if (validupdates === false) { return res.status(404).send({ ERROR: "invalid updates!" }) }

        const task = await Task.findOne({ _id: req.params._id, owner: req.user._id })

        if (!task) { return res.status(404).send({ ERROR: "task were not found" }) }

        updates.forEach(update => task[update] = req.body[update])

        await task.save()

        if (req.file) {  

            const buffer = await sharp(req.file.buffer).png().toBuffer()

            await task.populate({

                path :'taskPic'
            })
            task.taskPic.taskPicture = buffer
    
            await task.taskPic.save()
        }

        res.send(task)

    } catch (e) {
        res.send(e)
    }
})
//delete task
router.delete('/:_id',auth ,async (req, res) => {
    try {

        const task =  await Task.findByIdAndDelete(req.params._id)

        if (!task) { return res.status(404).send({ ERROR: "task were not found" }) }

        await TaskPic.deletedOne({ owner: req.params._id })

        res.send(task)

    } catch (e) { 
        res.status(500).send(e)
    }
})
//=========================================================
module.exports = router
