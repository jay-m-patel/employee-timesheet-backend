const express = require("express")
// const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
// app.use(cors({
//     origin: "https://hardcore-raman-bd4c42.netlify.app/",
//     credentials: true
// }))
// app.use(cors({
//     origin: "*",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true
// }))

var whitelist = ['https://hardcore-raman-bd4c42.netlify.app/']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())


const userRoutes = require("./routes/userRoutes/userRoutes.js")
const employerRoute = require("./routes/appRoutes/employerRoutes.js")
const employeeRoute = require("./routes/appRoutes/employeeRoutes.js")


// dotenv.config({
//     path: "./privateData.env"
// })


require("./db.js")



// app.use((req, res, next) => {
//     // res.setHeader('Access-Control-Allow-Origin', 'null', '*')

//     console.log(req.headers.origin, 'req.headers.origin')
//     var allowedOrigins = ['null', '*', 'http://localhost:1234/', 'http://localhost:8080/', 'https://5e8deaacaba624bb43b8acf0--flamboyant-nobel-fe72e2.netlify.com/'];
//     var origin = req.headers.origin;
//     if(allowedOrigins.indexOf(origin) > -1){
//          res.setHeader('Access-Control-Allow-Origin', origin);
//     }

//     res.setHeader('Access-Control-Allow-Headers', 'authorization, Content-Type')
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
//     res.setHeader('Access-Control-Allow-Credentials', 'true')
//     next()
// })

app.use(userRoutes)
app.use(employerRoute)
app.use(employeeRoute)




app.use((err, req, res, next) => {
    console.log(err, "errorHandler")
    res.json(err)
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Server is running on port ${port}`))