import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import db from '../lib/db'
import sanitize from '../lib/sanitize'

function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    if (res.locals.user.pos === 'student') {
      if (res.locals.user.grade < 9 && req.path != '/settings') {
        res.redirect('settings')
        return
      }
      next()
      return
    }
  }
  res.redirect('/auth/student')
}

router.use(checkAuthentication)

router.get('/home', (req, res) => {
  res.render('pages/student/home')
})

router.get('/find', async (req, res) => {
  const subjects = await db.listSubjects()
  const availability = await db.listAvailability()
  res.render('pages/student/find', {
    subjects: subjects,
    availability: availability,
    error: ''
  })
})

// Need to implement save
router.post('/find', async (req, res) => {
  const session = await db.createSession(
    res.locals.user.id,
    req.body.tutorpicker,
    new Date(req.body.time),
    req.body.subjectpicker,
    parseInt(req.body.durationpicker) / 60
  )
  if (session) {
    res.redirect('upcoming')
    return
  }
  // If didn't save properly
  const subjects = await db.listSubjects()
  const availability = await db.listAvailability()
  res.render('pages/student/find', {
    subjects: subjects,
    availability: availability,
    error: 'Unable to save session. Try again'
  })
})

router.get('/request', (req, res) => {
  res.render('pages/student/request')
})

router.get('/settings', (req, res) => {
  res.render('pages/student/settings', { error: '' })
})

router.post('/settings', (req, res) => {
  const sanitizedPhone = sanitize.phone(req.body.phone)
  if (
    ((req.body.phone.match(
      '^[(]?([2-9][0-8][0-9])[)]?[-|\\s]?([2-9][0-9]{2})[-|\\s]?([0-9]{4})$'
    ) &&
      sanitizedPhone) ||
      req.body.phone.match('^$')) &&
    (req.body.grade.match('[9]') || req.body.grade.match('[1][0-2]'))
  ) {
    let phone = ''
    if (sanitizedPhone) {
      phone = sanitizedPhone
    }
    db.updateUser(
      'students',
      res.locals.user.id,
      phone,
      req.body.grade,
      req.body.dark_theme || false
    )
    res.locals.user.phone = phone
    res.locals.user.grade = req.body.grade
    res.locals.user.dark_theme = req.body.dark_theme
    res.redirect('home')
    return
  }
  res.render('pages/student/settings', {
    error: 'Invalid grade or phone number'
  })
})

router.get('/upcoming', (req, res) => {
  res.render('pages/student/upcoming')
})

router.get('/history', (req, res) => {
  res.render('pages/student/history')
})

export { router }
