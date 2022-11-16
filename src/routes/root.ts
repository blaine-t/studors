/* eslint-disable no-empty */

import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
  res.render('pages/root/index', { darkMode: false })
})

router.get('/about', (req, res) => {
  res.locals.user = req.user
  let darkMode = false
  let pos = ''
  try {
    darkMode = res.locals.user.dark_theme
    pos = res.locals.user.pos
    pos = pos.charAt(0).toUpperCase() + pos.slice(1)
  } catch {}
  res.render('pages/root/about', { darkMode: darkMode, pos: pos })
})

router.get('/mission', (req, res) => {
  res.locals.user = req.user
  let darkMode = false
  let pos = ''
  try {
    darkMode = res.locals.user.dark_theme
    pos = res.locals.user.pos
    pos = pos.charAt(0).toUpperCase() + pos.slice(1)
  } catch {}
  res.render('pages/root/mission', { darkMode: darkMode, pos: pos })
})

router.get('/contact', (req, res) => {
  res.locals.user = req.user
  let darkMode = false
  let pos = ''
  try {
    darkMode = res.locals.user.dark_theme
    pos = res.locals.user.pos
    pos = pos.charAt(0).toUpperCase() + pos.slice(1)
  } catch {}
  res.render('pages/root/contact', { darkMode: darkMode, pos: pos })
})

export { router }
