import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import db from '../lib/db'

import functions from '../../views/components/functions'
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
  const sanitizedGrade = sanitize.grade(req.body.grade, 'student')
  let sanitizedDarkTheme = true
  if (req.body.dark_theme != undefined) {
    sanitizedDarkTheme = sanitize.boolean(req.body.dark_theme)
  }
  if (
    typeof sanitizedPhone == 'string' &&
    sanitizedGrade &&
    sanitizedDarkTheme
  ) {
    db.updateUser(
      'students',
      res.locals.user.id,
      sanitizedPhone,
      req.body.grade,
      req.body.dark_theme || false
    )
    res.locals.user.phone = sanitizedPhone
    res.locals.user.grade = req.body.grade
    res.locals.user.dark_theme = req.body.dark_theme
    res.redirect('home')
    return
  }
  let error = 'Invalid '
  if (!sanitizedGrade) {
    error += 'grade'
  }
  if (!sanitizedGrade && typeof sanitizedPhone == 'boolean') {
    error += ' and '
  }
  if (typeof sanitizedPhone == 'boolean') {
    error += 'phone number'
  }
  res.render('pages/student/settings', {
    error: error
  })
})

router.get('/upcoming', async (req, res) => {
  const upcomingSessions = await db.listSessions(
    true,
    'students',
    res.locals.user.id
  )
  res.render('pages/student/upcoming', {
    upcomingSessions: upcomingSessions,
    functions: functions
  })
})

router.get('/history', async (req, res) => {
  const pastSessions = await db.listSessions(
    false,
    'students',
    res.locals.user.id
  )
  res.render('pages/student/history', {
    pastSessions: pastSessions,
    functions: functions
  })
})

export { router }
