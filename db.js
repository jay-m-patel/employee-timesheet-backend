const mongoose = require("mongoose")
// `mongodb://jay:${process.env.mongoDBAtlasPassword}@cluster0-shard-00-00-oz65c.mongodb.net:27017,cluster0-shard-00-01-oz65c.mongodb.net:27017,cluster0-shard-00-02-oz65c.mongodb.net:27017/usersDB?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
// `mongodb+srv://jay:${process.env.mongoDBAtlasPassword}@cluster0-oz65c.mongodb.net/usersDB?retryWrites=true&w=majority`
mongoose.connect(`mongodb://jay:${process.env.mongoDBAtlasPassword}@cluster0-shard-00-00-oz65c.mongodb.net:27017,cluster0-shard-00-01-oz65c.mongodb.net:27017,cluster0-shard-00-02-oz65c.mongodb.net:27017/usersDB?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log(`Database Connected`))
.catch((err) => console.log(err))