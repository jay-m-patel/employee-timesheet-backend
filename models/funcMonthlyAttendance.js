const mongoose = require("mongoose")
const User = require("./User.js")

module.exports = async email => {

    let {DBname} = await User.findOne({email: email})
// `mongodb://jay:${process.env.mongoDBAtlasPassword}@cluster0-shard-00-00-oz65c.mongodb.net:27017,cluster0-shard-00-01-oz65c.mongodb.net:27017,cluster0-shard-00-02-oz65c.mongodb.net:27017/${DBname}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`    
// `mongodb+srv://jay:${process.env.mongoDBAtlasPassword}@cluster0-oz65c.mongodb.net/${DBname}?retryWrites=true&w=majority`
    let employerDB = await mongoose.createConnection(`mongodb://jay:${process.env.mongoDBAtlasPassword}@cluster0-shard-00-00-oz65c.mongodb.net:27017,cluster0-shard-00-01-oz65c.mongodb.net:27017,cluster0-shard-00-02-oz65c.mongodb.net:27017/${DBname}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false        
    })

    const monthlyAttendanceSchema = new mongoose.Schema({
        month: {
            type: String,
            default: (new Date()).toLocaleString('default', {month: "long", year: "numeric"})
        },
        employees: [{
            email: String,
            tasks: Number,
            hours: Number
        }],
        monthCompleted: {
            type: Boolean,
            default: false
        },
        sentToEmployer: Boolean
    })


    return employerDB.model('monthlyattendances', monthlyAttendanceSchema)

}