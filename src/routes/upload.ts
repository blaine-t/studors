import express from 'express'
import { UploadedFile } from 'express-fileupload'
const router = express.Router()

router.get('/', (req, res) => {
  res.render('pages/upload')
})

router.post('/', (req, res) => {
  if (req.files) {
    console.log(req.files)
    const file = req.files.file as UploadedFile
    const filename = file.name
    console.log(filename)
    file.mv('public/profiles/' + filename, function (err) {
      if (err) {
        res.send(err)
      } else {
        res.send('File Uploaded')
      }
    })
  }
})

export { router }
