const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


const User = require('./../models/User.js')
const Otp = require('./../models/Otp.js')
const funcDailyTasks = require('./../models/funcDailytasks.js')

let DailyTasksList

let todayDate = Date().slice(0,15).replace(" ","_").replace(" ","_").replace(" ","_")
console.log(todayDate, 'todayDate', typeof(todayDate))


const sendOTP = require('./../utilities/sendOtp.js')
const getNewDBname = require('./../utilities/getNewDBname.js')
const sendMonthlyAttendance = require("./../utilities/sendMonthlyAttendance.js")

class UserClass {
    constructor(name, email, password, isEmployer, employerEmail) {
        this.name = name
        this.email = email
        this.password = password
        this.isEmployer = isEmployer
        this.employerEmail = employerEmail
    }
}


const cookieOptions = {maxAge: 1000 * 60 * 60 * 12, httpOnly: true, path: '/', sameSite: "none"}


module.exports.dashboard = async (req, res, next) => {
    let {user} = req.body
    let {email} = user
  
    

    
    delete user._doc.password


    try {

        const funcMonthlyAttendance = require("./../models/funcMonthlyAttendance.js")
        const MonthlyAttendance = await funcMonthlyAttendance(email) 
        let month = (new Date()).toLocaleString('default', {month: "long", year: "numeric"})

        MonthlyAttendance.findOne({month: month}, async (err, monthlyAttendance) => {
            if(err) return next({err: err})
            if(!monthlyAttendance) {
                await MonthlyAttendance.find({monthCompleted: false}, async (err, docs) => {
                    if(err) return next({err: err})
                    docs.forEach(async doc => {
                        doc.monthCompleted = true
                        if(!doc.sentToEmployer) {
                            console.log("sending monthly attendance to employer")
                            sendMonthlyAttendance(email, doc)
                            doc.sentToEmployer = true
                        }
                        await doc.save().catch(err => next({err: err}))
                    })

                    monthlyAttendance = new MonthlyAttendance()
                    monthlyAttendance.save()
                })
            }  
        })




        // console.log(email, 'email before going to DailyTaskList')
        DailyTasksList = await funcDailyTasks(email)
        
        DailyTasksList.findOne({date: todayDate}, (err, todaysTasks) => {
            if(err) return next({err: err})
            if(!todaysTasks) {
                let dateObj = {date: todayDate}
                todaysTasks = new DailyTasksList(dateObj)
                todaysTasks.save()
                // .then(response => {                
                // })
                .catch(reject => console.log(reject))
            }


            if(user.isEmployer) {
                User.find({employerEmail: email}, async (err, employees) => {
                    if(err) return next(err)

                    let employeesWaiting = employees.filter(employee => !employee.allowedByEmployer)
                    employeesWaiting = employeesWaiting.map(employee => {
                        return {
                            name: employee.name,
                            email: employee.email
                        }
                    })

                    let allowedEmployees = employees.filter(employee => employee.allowedByEmployer)
                    allowedEmployees = allowedEmployees.map(employee => {
                        return {
                            name: employee.name,
                            email: employee.email
                        }
                    })
                    

                    res.json({
                        user: user,
                        allowedEmployees: allowedEmployees,
                        employeesWaiting: employeesWaiting,
                        token: req.body.token,
                        todaysTasks: todaysTasks
                    })
    
    
                })
            } else {
    
                
                User.findOne({email: user.employerEmail}, (err, employer) => {
                    if(err) return next(err)


                    res.json({
                        user: user,
                        employerName: employer.name,
                        token: req.body.token,
                        todaysTasks: todaysTasks
                    })

                })
    
            }

        })

    } catch(err) {
        console.log(err, 'err')
        next({err: {name: "invalidData", message: "unauthorized"}})
    }


}

module.exports.postLogin = (req, res, next) => {
    let {
        email,
        password
    } = req.body

    User.findOne({email: email}, async (err, user) => {
        if(err) return next(err)
        if(!user) return next({err: {name: "invalidData", message: "unauthorized"}})
        // if(user.isLoggedIn) return next({name: "bad request", message: "Logged in already"})

        if(bcrypt.compareSync(password, user.password)) {
            let token = jwt.sign({email: email}, process.env.jwtPrivateKey, {expiresIn: 1000 * 60 * 60 * 12})
            res.cookie("token", token, cookieOptions)

            // console.log(token, 'token postLogin')
   
            user.isLoggedIn = true

            user.save().then(user => {
                delete user._doc.password

                req.body = {}
                req.body.user = user
                req.body.token = token
                next()
               
            })
            
        } else {

            next({err: {name: "invalidData", message: "unauthorized"}})
        }

    })
   
}

module.exports.postRegisterEmployer = async (req, res, next) => {
    let {
        name,
        email,
        password,
        rePassword
    } = req.body

    if(password != rePassword) return next({err: {name: "invalidData", message: "Re-write the same password!!!"}})

    let hash = bcrypt.hashSync(password, 10)

    let newUser = new UserClass(name, email, hash, true)

    newUser.isLoggedIn = true


    newUser = new User(newUser)

    newUser.save().then((user) => {

        try {
            let token = jwt.sign({email: email}, process.env.jwtPrivateKey, {expiresIn: 1000 * 60 * 60 * 12})
            res.cookie("token", token, cookieOptions)
            
            console.log(token, 'token postRegisterEmployer')
            req.body = {}

            delete user._doc.password
            req.body.user = user
            req.body.token = token

            next()
        } catch(err) {
            return next(err)
        }

    }).catch((err) => {
        console.log(err)
        next(err)
    })
}

module.exports.makeEmployerDB = (req, res, next) => {
    let {name, email} = req.body.user
    User.find({isEmployer: true}, (err, res) => {
        if(err) return next(err)
        let DBlist = res.map(employer => employer.DBname)

        let newDBname = getNewDBname(name, email, DBlist)

        User.findOneAndUpdate({email: email}, {DBname: newDBname}, {new: true}, (err, user) => {
            if(err) return next(err)

            next()
        })

    })
    
}


module.exports.postRegisterEmployee = (req, res, next) => {
    let {
        employerEmail,
        name,
        email,
        password,
        rePassword
    } = req.body

    if(password != rePassword) return next({err: {name: "invalidData",message: "Re-write the same password!!!"}})

    User.findOne({email: employerEmail}, (err, employer) => {
        if(err) return next(next)
        if(!employer) return next({err:{name: "invalidData",message: "Company's email does not exist."}})

        let hash = bcrypt.hashSync(password, 10)

        let newUser = new UserClass(name, email, hash, false, employerEmail)
        
        newUser.isLoggedIn = true
        newUser.allowedByEmployer = false
        newUser.DBname = employer.DBname
    
        newUser = new User(newUser)
        newUser.save().then((user) => {
    
            try {
                let token = jwt.sign({email: email}, process.env.jwtPrivateKey, {expiresIn: 1000 * 60 * 60 * 12})
                res.cookie("token", token, cookieOptions)
                
                console.log(token, 'token postRegisterEmployee')
                req.body = {}

                delete user._doc.password
                req.body.user = user
                req.body.token = token

                next()
            } catch(err) {
                return next(err)
            }
        }).catch((err) => {
            console.log(err)
            next(err)
        })
    })
}

module.exports.sendOTP = (req, res, next) => {
    console.log(req.body)
    let otp
    let {email,isEmailverified} = req.body.user
    let {token} = req.body

    if(!isEmailverified) {
        otp = Math.floor(Math.random() *10000)
        let newOtpObj = {
            email: email,
            otp: otp            
        }

        newOtpObj = new Otp(newOtpObj)
        newOtpObj.save()
        .then(newOtpObj => {
            
             
            sendOTP(email, otp)

            console.log(token, 'token sendOtp2')


            res.json({
               user: req.body.user,
               token: token,
               OTPsent: true
            })
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
    }
}

module.exports.verifyEmailByOtp = async (req, res, next) => {
    console.log(req.body, 'at cont')
    let {otp, user, token} = req.body
    let email = user.email

    try {
        let userInOtps = await Otp.findOne({email: email})
        console.log(userInOtps)
        if(userInOtps.otp == otp) {
               

            await Otp.findOneAndRemove({otp: otp})
            let filter = {email: email}
            let update = {isEmailverified: true}
            let user = await User.findOneAndUpdate(filter, update, {new: true})
  
            console.log(user)


            delete user._doc.password
            req.body = {}
            req.body.user = user
            req.body.token = token
            next()

           
        } else {
            next({name: "invalidOTP",message: "Enter the otp sent to your email."})
        }
    } catch(err) {
        console.log(err)
        next(err)
    }

    

}

module.exports.deleteLogout = async (req, res, next) => {


    let {email} = req.body.user

    try {
        let user = await User.findOneAndUpdate({email: email}, {isLoggedIn: false}, {new: true})
        
        res.clearCookie("token", cookieOptions)
    
    
        res.json({
            loggedOut: true
        })    
    } catch (err) {
        next(err)
    }
    


}


module.exports.patchAllowEmployee = async (req, res, next) => {
    let {employeeEmail, user} = req.body
    let employee = await User.findOneAndUpdate({email: employeeEmail}, {allowedByEmployer: true}, {new: true}) 
    
    
    DailyTasksList.findOne({date: todayDate}, (err, todaysTasks) => {
        if(err) return next(err)
        console.log(todaysTasks, !todaysTasks, '!todaysTasks')
        if(!todaysTasks) {
            let dateObj = {date: todayDate}
            todaysTasks = new DailyTasksList(dateObj)
            todaysTasks.save()
            // .then(response => {
            // })
            .catch(reject => console.log(reject))
        }
        
        User.find({employerEmail: user.email}, async (err, employees) => {
            if(err) return next(err)
    
            let employeesWaiting = employees.filter(employee => !employee.allowedByEmployer)
            employeesWaiting = employeesWaiting.map(employee => {
                return {
                    name: employee.name,
                    email: employee.email
                }
            })
    
            let allowedEmployees = employees.filter(employee => employee.allowedByEmployer)
            allowedEmployees = allowedEmployees.map(employee => {
                return {
                    name: employee.name,
                    email: employee.email
                }
            })
    
            res.json({
                employeeAllowed: 'success',
                user: user,
                allowedEmployees: allowedEmployees,
                employeesWaiting: employeesWaiting,
                token: req.body.token,
                todaysTasks: todaysTasks
            })

        })

    })
   
}

module.exports.deleteRejectedEmployee = async (req, res, next) => {
    let {employeeEmail} = req.params
    let {user} = req.body
    await User.findOneAndRemove({email: employeeEmail})

    DailyTasksList.findOne({date: todayDate}, (err, todaysTasks) => {
        if(err) return next(err)
        console.log(todaysTasks, !todaysTasks, '!todaysTasks')
        if(!todaysTasks) {
            let dateObj = {date: todayDate}
            todaysTasks = new DailyTasksList(dateObj)
            todaysTasks.save()
            // .then(response => {
            // })
            .catch(reject => console.log(reject))
        }
        
        User.find({employerEmail: user.email}, async (err, employees) => {
            if(err) return next(err)
    
            let employeesWaiting = employees.filter(employee => !employee.allowedByEmployer)
            employeesWaiting = employeesWaiting.map(employee => {
                return {
                    name: employee.name,
                    email: employee.email
                }
            })
    
            let allowedEmployees = employees.filter(employee => employee.allowedByEmployer)
            allowedEmployees = allowedEmployees.map(employee => {
                return {
                    name: employee.name,
                    email: employee.email
                }
            })
    
            res.json({
                employeeRejected: 'success',
                user: user,
                allowedEmployees: allowedEmployees,
                employeesWaiting: employeesWaiting,
                token: req.body.token,
                todaysTasks: todaysTasks
            })
    
    
        })

    })

    
}