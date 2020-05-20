const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: Number,
        required: true
    },
    expireAt: {
        type: Date,
        index: { expires: '10m' },
    },

})

otpSchema.pre('save', function(next) {
    this.expireAt = new Date()
    next()
})

const Otp = mongoose.model("otps", otpSchema)

module.exports = Otp