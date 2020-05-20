
const express = require("express")

const router = express.Router()

const {auth} = require("./../../middleware/auth.js")
const {dashboard} =require("./../../controllers/userControllers.js")
const {assignNewTask, selectDate} = require("./../../controllers/employerRoutesController")



router.post('/employer/assignNewTask', auth, assignNewTask, dashboard)
router.get('/employer/selectDate/', auth, selectDate)


module.exports = router