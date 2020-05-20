const User = require("./../models/User.js")

let DailyTasksList

const funcDailyTasks = require("./../models/funcDailytasks.js")

let todayDate = Date().slice(0,15).replace(" ","_").replace(" ","_").replace(" ","_")

const notifyEmployee = require("./../utilities/notifyEmployee.js")


class AssignmentClass {
    constructor(assignTo, title, details) {
        
        this.assignedTo = assignTo.map(employeeEmail => {
            return {employeeEmail: employeeEmail}
        })
        this.title = title
        this.details = details
    }
}


module.exports.assignNewTask = async (req, res, next) => {
    let {
        user,
        assignTo,
        title,
        details
    } = req.body
    if(!user.isEmployer) return next({name:"unauthorized", message: "unauthorized"})

    for(i = assignTo.length - 1; i > 0; i--) {
        assignTo = assignTo.replace(" ","")
    }
    assignTo = assignTo.split(",")
  

    DailyTasksList = await funcDailyTasks(user.email)


    try {

        let employees = await User.find({employerEmail: user.email})
        employees = employees.filter(employee => employee.allowedByEmployer)
        employees = employees.map(employee => employee.email)

        let errMessageArr = []
        for(employeeEmail of assignTo) {
            if(!employees.includes(employeeEmail)) errMessageArr.push(`No such allowed employee having email ${employeeEmail}`)
        }
        if(errMessageArr.length) return next({name: "bad data", message: errMessageArr})



        notifyEmployee(assignTo, title, details)
        
        DailyTasksList.findOneAndUpdate({date: todayDate}, {$push: {tasks: new AssignmentClass(assignTo, title, details)}}, {new: true}, (err, doc) => {

            if(err) {
                console.log(err, "err while pushing assignment")
                return next({err: err})
            }
            next()

        })


    } catch(err) {

        next({err: err})
    }

}


module.exports.selectDate = async (req, res, next) => {

    let {user, token} = req.body
    let {date} = req.query


    
    try {
        DailyTasksList = await funcDailyTasks(user.email)

        let selectedDateTasks = await DailyTasksList.findOne({date: date})

        res.json({
            user: user,
            selectedDateTasks: selectedDateTasks,
            token: token
        })
    } catch(err) {
        next({err: err})
    }
   

    



}