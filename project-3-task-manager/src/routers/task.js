const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

// create task
router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,            // copy over all from req.body
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

// get /tasks?completed=true
// get /tasks?Limit=10&skip=20
// get /tasks&sortBy=createdAt_asc
router.get("/tasks", auth, async (req, res)  => {
    const match = {};
    const sort = {};

    if (req.query.completed) {  // by completed
        match.completed = (req.query.completed === "true");
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split("_");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        await req.user.populate("tasks").execPopulate({
            path: "tasks",
            match,
            options: {          // pagination
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.send(req.user.tasks);        
    } catch (e) {
        res.status(500).send();
    }
})

// get task by ID
router.get("/tasks/:id", auth, async (req, res)  => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
})

// update task
router.patch("/tasks/:id", auth, async (req, res) => {
    // verify requested update is allowed
    const updates = Object.keys(req.body);
    const allowedUpdates = ["completed", "description"];
    if (!updates.every((update) => allowedUpdates.includes(update))) {
        return res.status(400).send({error: "Invalid update." });
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) { return res.status(404).send(); }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;