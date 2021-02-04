const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Vikram",
    email: "vikram@example.com",
    password: "YouAreThatPig01!",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: "Sean Bates",
    email: "sean@example.com",
    password: "TestValueHere!@",
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "First test task",
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Second test task",
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Third test task",
    completed: true,
    owner: userTwoId
}

const setUpDatabase = async () => {
        // delete all users and tasks in test db before running any test
        await User.deleteMany();
        await Task.deleteMany();
        // create test users
        await new User(userOne).save();
        await new User(userTwo).save();
        await new Task(taskOne).save();
        await new Task(taskTwo).save();
        await new Task(taskThree).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setUpDatabase
}