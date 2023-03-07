const request = require('supertest')
const app = require('../testRun')
const User = require('../models/user')
const Pic = require('../models/profilePicture')
const {setupDB,userOne,userOneId } = require('./fixtures/db')
//=====================================
beforeEach(setupDB)

test('Sign up', async () => {

    const response = await request(app).post('/user/createUser').send({
        "name": "mohamed",
        "email": "mo.elsaye621@gmail.com",
        "password": "15d198799",
        "age": 15
    }).expect(201)
    const user =  await User.findById(response.body.user._id)
    expect(response.body.user).toMatchObject({
        "name": "mohamed",
        "email": "mo.elsaye621@gmail.com",
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
test('profile image', async () => { 
    await request(app)
        .post('/user/me/profilePicture')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('profilePicture', 'test/fixtures/light.png')
        .expect(200)
    
    const pic = await Pic.findOne({ owner: userOneId })
    expect(pic).not.toBeNull()

})

test('get profile image', async () => { 

    const response = await request(app)
        .get(`/user/profilePicture/${userOneId}`)
        .expect(200)
    
})
test('should fail to update user', async () => { 

    await request(app)
        .patch('/user/update/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ 
        "password": "15d198799",
        "age": 16,
        "location": 'ssssa'
        }).expect(400)
})
test('update user', async () => { 

    await request(app)
        .patch('/user/update/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ 
        "password": "15d198799",
        "age":16
        }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.age).toBe(16)
})
