const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailverified: {
        type: Boolean,
        default: false
    },
    isEmployer: {
        type: Boolean,
        required: true
    },
    employerEmail: {
        type: String,
        required: function() {
            return this.isEmployer != true
        }
    },
    allowedByEmployer: {
        type: Boolean,
        required: function() {
            return this.isEmployer != true
        }        
    },
    isLoggedIn: {
        type: Boolean
    },
    DBname: {
        type: String
    }

})


const User = mongoose.model("users", userSchema)

module.exports = User