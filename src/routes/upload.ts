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
    try {
      sharp(file.data)
        .resize(200, 200)
        .toFile('public/profiles/' + newFileName)
        .then(() => res.send(newFileName))
        .catch(() => res.send('Please upload a valid image file'))
    } catch (error) {
      console.log("can't process source image. is it an image? error ", error)
    }
  }
})

export { router }
