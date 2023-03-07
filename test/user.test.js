const request = require('supertest')
const app = require('../testRun')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/user')
//=====================================
const userOneId = new mongoose.Types.ObjectId()

const userOne = {
        "_id" : userOneId,
        "name":"mohamed",
        "email": "mo.elsayed621654@gmail.com",
        "password": "15d198799",
        "age": 15,
        "tokens": [{
        "token": jwt.sign({ _id: userOneId }, process.env.JWT)
        }]
}
beforeEach(async () => { 
    await User.deleteMany()
    await new User(userOne).save()
})

test('Sign up', async () => {

    const response = await request(app).post('/user/createUser').send({
        "name": "mohamed",
        "email": "mo.elsayed621@gmail.com",
        "password": "15d198799",
        "age": 15
    }).expect(201)
    const user =  await User.findById(response.body.user._id)
    expect(response.body.user).toMatchObject({
        "name": "mohamed",
        "email": "mo.elsayed621@gmail.com",
        "age": 15
    })
    expect(response.body.token).toBe(user.tokens[0].token)
})
test('login', async () => { 

    const response = await request(app).post('/user/login').send({ 

        "email": userOne.email,
        "password": userOne.password,

    }).expect(200)
    const user =  await User.findById(response.body.user._id)
    expect(response.body.user).toMatchObject({
        "name": userOne.name,
        "email": userOne.email,
        "age": userOne.age
    })
    expect(response.body.token).toBe(user.tokens[1].token)
})
test('fail to login', async () => { 

    const response = await request(app).post('/user/login').send({ 

        "email": 'any data',
        "password": "any data",

    }).expect(401)

    expect(response.body).toMatchObject({ Error: "couldn't find user" })
})
test('user profile', async () => { 

    await request(app)
        .get('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})
test('fail on authorization user profile', async () => { 

    await request(app)
        .get('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}1`)
        .send()
        .expect(401)
})
test('unauthorized delete account ', async () => { 

    await request(app)
        .delete('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}1`)
        .send()
        .expect(401)
})
test('delete account ', async () => { 

    await request(app)
        .delete('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})