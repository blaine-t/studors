import express from 'express'
import { UploadedFile } from 'express-fileupload'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
const router = express.Router()

router.get('/', (req, res) => {
  res.render('pages/upload')
})

router.post('/', (req, res) => {
  if (req.files) {
    const file = req.files.file as UploadedFile
    const newFileName = Date.now() + '-' + uuidv4() + '.webp'
    sharp(file.data)
      .resize(200, 200)
      .toFile('public/profiles/' + newFileName)
    res.send(newFileName)
  }
})

export { router }
