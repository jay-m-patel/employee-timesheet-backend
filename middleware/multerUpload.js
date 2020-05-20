const multer = require("multer")

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') cb(null, true)
    else {
        console.log(file.mimetype, "mimetype error")
        cb({name: "mimetype error"})
    }
}


module.exports.multerUpload =  multer({
    storage: storage,
    fileFilter: fileFilter
})