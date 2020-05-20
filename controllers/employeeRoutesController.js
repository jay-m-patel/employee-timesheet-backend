const jwt = require("jsonwebtoken")



const User = require("./../models/User.js")
const funcDailyTasks = require("./../models/funcDailytasks.js")
const datauri = require("./../utilities/bufferToString.js")

let DailyTasksList

let todayDate = Date().slice(0,15).replace(" ","_").replace(" ","_").replace(" ","_")


module.exports.addInTime = async (req, res, next) => {
    let {
        employeeEmailObjId,
        taskId,
        inTime,
        assignedTo,
        user
    } = req.body


    try {
        if(!(user.email == assignedTo[0].employeeEmail)) throw new Error("unauthorized")
        DailyTasksList = await funcDailyTasks(user.email)

        await DailyTasksList.findOneAndUpdate({
            date: todayDate,
        },{
            $set: {"tasks.$[task].assignedTo.$[to].in": inTime}
        },{
            arrayFilters: [{"task._id": taskId}, {"to._id": employeeEmailObjId}],
            new: true
        })

    
        next()
    } catch(err) {
        console.log(err)
        next({err: err})
    }

}

module.exports.addOutTime = async (req, res, next) => {
    console.log(req.body, "req.body addOutTime")

    let {
        employeeEmailObjId,
        employeeEmail,
        taskId,
        outTime,
        assignedTo,
        user
    } = req.body

    try {
        if(!(user.email == assignedTo[0].employeeEmail)) throw new Error("unauthorized")
        DailyTasksList = await funcDailyTasks(user.email)

        await DailyTasksList.findOneAndUpdate({
            date: todayDate,
        },{
            $set: {"tasks.$[task].assignedTo.$[to].out": outTime}
        },{
            arrayFilters: [{"task._id": taskId}, {"to._id": employeeEmailObjId}],
            new: true
        })
    


        const funcMonthlyAttendance = require("./../models/funcMonthlyAttendance.js")
        const MonthlyAttendance = await funcMonthlyAttendance(user.email) 
        let month = (new Date()).toLocaleString('default', {month: "long", year: "numeric"})

        DailyTasksList.findOne({date: todayDate}, (err, today) => {
            if(err) return next({err: err})
            today.tasks.forEach(task => {
                if(task._id == taskId) {
                    task.assignedTo.forEach(async employee => {
                        if(employee.employeeEmail == employeeEmail) {
                            let hours = Number(((employee.out.split(":")[0] - employee.in.split(":")[0]) + (employee.out.split(":")[1] - employee.in.split(":")[1])/60).toFixed(2))
                            await MonthlyAttendance.findOne({month: month}, (err, monthlyAttendance) => {
                                if(err) return console.log(err)
                                let found = 0
                                monthlyAttendance.employees.forEach(employee => {
                                    if(employee.email == employeeEmail) {
                                        employee.hours = Number(employee.hours) + hours
                                        employee.tasks = Number(employee.tasks) + 1
                                        found = 1
                                    }
                                })
                                if(found == 0) {
                                    monthlyAttendance.employees.push({
                                        email: employeeEmail,
                                        tasks: 1,
                                        hours: hours
                                    })
                                }
                                monthlyAttendance.save().catch(err => console.log(err))
                            })
                        }
                    })
                }
            })
        })



        next()
    } catch(err) {
        console.log(err)
        next({err: err})
    }
}


module.exports.submitReportImage = async (req, res, next) => {
    console.log(req.body, 'req.body at submitReportImage 1')

    try {
    
        let {user} = req.body
        let {taskId} = req.params
      
        console.log(req.file, "req.file")
      
        let {
            originalname,
            buffer
        } = req.file


        const cloudinary = require("./../config/cloudinaryConfig.js")

        cloudinary.uploader.upload(datauri(originalname, buffer))
        .then(async response => {

            console.log(response, "response from cloudinary uploader")
            

            DailyTasksList = await funcDailyTasks(user.email)
            
            await DailyTasksList.findOneAndUpdate({
                date: todayDate,
                
            },{
                 $push: {"tasks.$[task].report": response.secure_url}
            },{
                arrayFilters: [{"task._id": taskId}],
                new: true
            })
            
            
            
            next()


        })
        .catch(reject => console.log(reject))
    
    } catch(err) {
        next({err: err})
    }

}