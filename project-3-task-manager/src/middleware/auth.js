const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");       // get token from req header and strip preamble
        const decoded = jwt.verify(token, process.env.JWT_SECRET);    // verify token using secret defined in index.js
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });   // get user with corresponding ID/token

        if (!user) {                // if not valid, abort
            throw new Error();      // fall to catch() below
        }

        req.token = token;  // for future use
        req.user = user;    // ditto
        next();             // validation successful, run route handler

    } catch (e) {
        res.status(401).send( { error: "Please log in. " });    // if validation unsuccessful
    }
}

module.exports = auth;