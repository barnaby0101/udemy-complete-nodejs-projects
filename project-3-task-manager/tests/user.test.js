const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user")
const { userOneId, userOne, setUpDatabase } = require("./fixtures/db")

// setup

beforeEach(setUpDatabase);

// tests

test("Should sign up a new user", async () => {
    const response = await request(app).post("/users").send({
        name: "Barnaby",
        email: "bathieme@hotmail.com",
        password: "YouAreThatPig777!"
    }).expect(201)
    // assert the db was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    // assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: "Barnaby",
            email: "bathieme@hotmail.com", 
        },
        token: user.tokens[0].token
    });
    // test pw hashing
    expect(user.password).not.toBe("YouAreThatPig777!");
})

test("Should log in existing user", async () => {
    const response = await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
    // validate new token was saved to db
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
})

test("Should fail login for bad user", async () => {
    await request(app).post("users/login").send({
        email: "wrong value",
        password: userOne.password
    }).expect(404);
})

test("Should fail login with bad pw", async () => {
    await request(app).post("/users/login").send({
        email: userOne.email,
        password: "badpassword"
    }).expect(400);
})

test("Should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
})

test("Should not get profile for unauthenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401);
})

test("Should delete account for user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    // validate user was deleted
    const user = await User.findById(userOneId)
    expect(user).toBeNull();
})

test("Should not delete account for unauthenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})

test("Should upload avatar image", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/profile-pic.jpg")
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
})

test("Should update valid user fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Padma Lakshmi"
        })
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.name).toBe("Padma Lakshmi");
})

test("Should not update invalid user fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            pet: "turtle"
        })
        .expect(400);
})