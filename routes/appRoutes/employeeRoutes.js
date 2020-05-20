const express = require("express")

const router = express.Router()

const {auth} = require("./../../middleware/auth.js")
const {multerUpload} = require("./../../middleware/multerUpload.js")
const {dashboard} =require("./../../controllers/userControllers.js")
const {addInTime, addOutTime, submitReportImage} = require("./../../controllers/employeeRoutesController.js")



router.patch('/employee/addInTime', auth, addInTime, dashboard)

router.patch('/employee/addOutTime', auth, addOutTime, dashboard)

router.post('/employee/submitReportImage/:taskId', multerUpload.single('imageUploadInput'), auth, submitReportImage, dashboard)

module.exports = router