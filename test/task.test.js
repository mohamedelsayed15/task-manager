const request = require('supertest')
const app = require('../testRun')
const User = require('../models/user')
const Task = require('../models/task')
const TaskPic = require('../models/taskPicture')
const {
    setupDB,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    userTwoId,
    userOne,
    userOneId
} = require('./fixtures/db')
//==================================================
beforeEach(setupDB)

test('create task for user',async () => { 

    const response = await request(app)
        .post('/task/createTask')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
        "title":"name"  ,
        "description": "11111111",
        }).expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})
test('get user tasks', async () => { 
    
    const response = await request(app)
        .get('/task/myTasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect (response.body.length).toBe(2)
})
test('fail to delete first user task from second user', async () => { 

    const response = await request(app)
        .delete(`task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(405)

    const task = await Task.findById(taskOne._id)
    expect(task.completed).toBe(false)
})