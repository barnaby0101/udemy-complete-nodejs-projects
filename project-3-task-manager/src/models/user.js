const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter a valid email.")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number.")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password"))  {
                throw new Error("Your password cannot contain the word \"password\".");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }], 
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

// note .methods are available on instances
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
    this.tokens = this.tokens.concat({ token });        // add token to an array of objects
    await this.save();
    return token;
}

// remove hashed pw and token from return data
userSchema.methods.toJSON = function () {
    const userObject = this.toObject(); // Mongoose method for returning user as object
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

// note .statics are available on models
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email}); 

    if (!user) {
        throw new Error("Unable to log in.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to log in.")
    }

    return user;
}

// hash the plaintext pw before saving
userSchema.pre("save", async function (next) {  
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    next();
})

// delete user's tasks when user is deleted
userSchema.pre("remove", async function (next) {
    await Task.deleteMany({
        owner: this._id
    })
    next();
})

const User = mongoose.model("User", userSchema)

module.exports = User;