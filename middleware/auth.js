const jwt = require("jsonwebtoken")
const User = require("./../models/User.js")

module.exports.auth = async (req, res, next) => {

    try {
        let token = req.headers.authorization.split(" ")[1]
        if(token == "undefined") token = req.cookies.token  
    

        let decoded = await jwt.verify(token, process.env.jwtPrivateKey)
        let email = decoded.email

        let user = await User.findOne({email: email})
        req.body.user = user
        req.body.token = token
        if(user.isLoggedIn) next()
        else next({name: "unauthorized", message: "Log in, again."}) 

    } catch (err) {
        next({err: {name: "invalidData", message: "unauthorized"}})
    }

}