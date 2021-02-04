const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const { 
    userOneId, 
    userOne, 
    taskThree, 
    setUpDatabase 
} = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Should create task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "Create task test value"
        })
        .expect(201)
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull;
    expect(task.completed).toBe(false);
})

test("Should get all userOne tasks", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .expect(200);
    expect(response.body.length).toEqual(2);
})

test("Should fail to allow userOne to delete userTwo task", async () => {
    const response = await request(app)
        .delete(`tasks/${taskThree._id}`)
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .expect(404)
    const task = await Task.findById(taskThree._id)
    expect(task).not.toBeNull();
})