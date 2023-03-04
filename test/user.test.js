const request = require('supertest')
const app = require('../testRun')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/user')
//=====================================
const userId = new mongoose.Types.ObjectId()

const userOne = {
        "_id" : userId,
        "name":"mohamed",
        "email": "mo.elsayed621654@gmail.com",
        "password": "15d198799",
        "age": 15,
        "tokens": [{
        "token": jwt.sign({ _id: userId }, process.env.JWT)
        }]
        
}
beforeEach(async () => { 
    await User.deleteMany()
    await new User(userOne).save()
})

test('Sign up', async () => { 

    await request(app).post('/user/createUser').send({ 
        "name":"mohamed",
        "email": "mo.elsayed621@gmail.com",
        "password": "15d198799",
        "age": 15
    }).expect(201)
})
test('login', async () => { 

    await request(app).post('/user/login').send({ 

        "email": userOne.email,
        "password": userOne.password,

    }).expect(200)
})
test('login not found', async () => { 

    await request(app).post('/user/login').send({ 

        "email": 'any data',
        "password": "any data",

    }).expect(401)
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
})
