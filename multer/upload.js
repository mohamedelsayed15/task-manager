const multer = require('multer')

//multer
const upload = multer({
    //dest: 'profilePicture',
    limits: {
        fileSize: 5242880 , //1024 * 1024* 5 //5mb
        files: 1,
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|png|gif|jpeg)$/))
        {
            cb(new Error('file is not supported'), false) //reject
        }
        cb(null,true)//accept
    }
})
module.exports = upload