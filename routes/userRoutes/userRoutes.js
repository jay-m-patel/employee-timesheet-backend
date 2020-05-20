const express = require("express")


const { 
    dashboard,
    postLogin,
    postRegisterEmployer,
    postRegisterEmployee,
    sendOTP,
    verifyEmailByOtp,
    deleteLogout,
    patchAllowEmployee,
    deleteRejectedEmployee,
    makeEmployerDB
} = require("./../../controllers/userControllers.js")

const { auth } = require("./../../middleware/auth.js")

const router = express.Router()


router.get('/', auth, dashboard)

router.post('/login', postLogin, dashboard)

router.post('/register/employer', postRegisterEmployer, makeEmployerDB, sendOTP)

router.post('/register/employee', postRegisterEmployee, sendOTP)

router.post('/verifyEmailByOtp', auth, verifyEmailByOtp, dashboard)

router.delete('/logout', auth, deleteLogout)

router.patch('/employer/allowEmployee', auth, patchAllowEmployee)

router.delete('/employer/rejectEmployee/:employeeEmail', auth, deleteRejectedEmployee)



module.exports = router