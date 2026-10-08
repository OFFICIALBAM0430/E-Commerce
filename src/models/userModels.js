const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: null
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    },
}, { timestamps: true, versionKey: false });

const User = mongoose.model("User", userSchema);

module.exports = User;