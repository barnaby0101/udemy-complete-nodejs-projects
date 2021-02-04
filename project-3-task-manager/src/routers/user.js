const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancellationEmail } = require("../emails/account");
const router = new express.Router();

// sign up
router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        // sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
        console.log("User created.")
    } catch (e) {
        res.status(400).send(e);
    }
});

// upload profile pic
const upload = multer({
    limits: {
        fileSize: 1000000   // max 1 mb
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.jpg|jpeg|png/)) {
            return cb(new Error("Please upload a jpg, jpeg, or png."));
        }
        cb(null, true);
    }
})

router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    // form-data key must be `avatar`, requirements for value defined above
    // resize to 250 x 250 and convert to png
    const buffer = await sharp(req.file.buffer).resize( { width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();     
}, (error, req, res, next) => {
    res.status(400).send({ Error: error.message });
})

// delete profile pic
router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = null;
    await req.user.save();
    res.send();
})

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar ) {
            throw new Error();
        }

        res.set("Content-Type", "image/png")
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
})

// log in
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
})

// log out current account
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token; 
        })
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

// log out all sessions
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = new Array;
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

// get my info
router.get("/users/me", auth, async (req, res)  => {
    res.send(req.user);
})

// get user by id
// router.get("/users/:id", auth, async (req, res)  => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send();
//     }
// })

// update me
router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);

    // verify requested update is allowed
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid update." });
    }

    // note in the following operation we can't use Mongoose's
    // findByIdAndUpdate() because it bypasses middleware

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})

// delete my profile
router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        // sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
})

// // delete user by ID
// router.delete("/users/:id", auth, async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send();
//     }
// })

module.exports = router;