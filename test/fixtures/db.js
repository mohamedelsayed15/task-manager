const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Pic = require('../../models/profilePicture')
const User = require('../../models/user')
const Task = require('../../models/task')
const TaskPic = require('../../models/taskPicture')
//====================================================
const userOneId = new mongoose.Types.ObjectId()

const userOne = {
        _id : userOneId,
        name:"mohamed",
        email: "mo.elsayed654@gmail.com",
        password: "15d198799",
        age: 15,
        tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT)
        }]
}
const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
        _id : userTwoId,
        name:"mohamed",
        email: "mo.elsayed621654@gmail.com",
        password: "15d198799",
        age: 15,
        tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT)
        }]
}
const taskOne = {

    _id: new mongoose.Types.ObjectId(),
    title: "1999999",
    description: '55555555',
    owner :userOneId
}
const taskTwo = {

    _id: new mongoose.Types.ObjectId(),
    title: "2888888",
    description: '666666',
    owner :userOneId
}
const taskThree = {

    _id: new mongoose.Types.ObjectId(),
    title: "2888888",
    description: '666666',
    owner :userTwoId
}
const setupDB = async () => {
    await User.deleteMany()
    await Pic.deleteMany()
    await Task.deleteMany()
    await TaskPic.deleteMany()

    await new User(userOne).save()
    await new User(userTwo).save()

    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}
module.exports = {
    setupDB,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    userTwoId,
    userOne,
    userOneId
}