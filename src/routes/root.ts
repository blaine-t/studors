import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
  res.render('pages/root/index', { darkMode: false })
})

router.get('/about', (req, res) => {
  res.locals.user = req.user
  let darkMode = false
  try {
    darkMode = res.locals.user.dark_theme
  } catch {}
  res.render('pages/root/about', { darkMode: darkMode })
})

router.get('/mission', (req, res) => {
  res.locals.user = req.user
  let darkMode = false
  try {
    darkMode = res.locals.user.dark_theme
  } catch {}
  res.render('pages/root/mission', { darkMode: darkMode })
})

router.get('/contact', (req, res) => {
  res.locals.user = req.user
  let darkMode = false
  try {
    darkMode = res.locals.user.dark_theme
  } catch {}
  res.render('pages/root/contact', { darkMode: darkMode })
})

export { router }
