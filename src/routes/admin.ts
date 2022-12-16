import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import { v4 as uuidv4 } from 'uuid'

import db from '../lib/db'
import sanitize from '../lib/sanitize'

import functions from '../lib/functions'

import * as datef from 'date-fns'

/**
 * Ensures that the user is authenticated and signed up, if not signed up redirect to settings and if not authed then redirect to auth page
 * @param req Request
 * @param res Response
 * @param next Next Step
 * @returns Nothing
 */
function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    if (res.locals.user.pos === 'admin') {
      if (res.locals.user.grade < 9 && req.path != '/settings') {
        res.redirect('/admin/settings')
        return
      }
      next()
      return
    }
  }
  res.redirect('/auth/admin')
}

// Use above function in routing
router.use(checkAuthentication)

router.get('/', (req, res) => {
  res.redirect('/admin/panel')
  return
})

router.get('/panel', (req, res) => {
  res.render('pages/admin/panel', {
    darkMode: res.locals.user.dark_theme,
    pos: 'Admin'
  })
})

router.get('/list', async (req, res) => {
  // Sequential because parallel connections harm runtime in tests
  const students = await db.listUsers('students')
  const tutors = await db.listUsers('tutors')
  const admins = await db.listUsers('admins')
  const studentAllowed = await db.listAllowed('students')
  const tutorAllowed = await db.listAllowed('tutors')
  const adminAllowed = await db.listAllowed('admins')
  const subjects = await db.listSubjects()
  const increments = await db.listIncrements()
  const holidays = await db.listHolidays()
  const pastSessions = await db.listSessions(false, 'admins', 'Any', false)
  const upcomingSessions = await db.listSessions(true, 'admins', 'Any', false)
  res.render('pages/admin/list', {
    students: students,
    tutors: tutors,
    admins: admins,
    studentAllowed: studentAllowed,
    tutorAllowed: tutorAllowed,
    adminAllowed: adminAllowed,
    subjects: subjects,
    increments: increments,
    holidays: holidays,
    pastSessions: pastSessions,
    upcomingSessions: upcomingSessions,
    datef: datef,
    darkMode: res.locals.user.dark_theme,
    pos: 'Admin'
  })
})

router.get('/settings', (req, res) => {
  res.render('pages/admin/settings', {
    error: '',
    darkMode: true, // Check box handles
    pos: 'Admin'
  })
})

// On API key reset distribute a new API key and redirect back to settings
router.post('/apiReset', (req, res) => {
  const newApiKey = uuidv4()
  db.updateApiKey(res.locals.user.id, newApiKey)
  res.locals.user.api_key = newApiKey
  res.redirect('settings')
})

// Take in data given by user in settings
router.post('/settings', (req, res) => {
  // Sanitize user given data
  const sanitizedPhone = sanitize.phone(req.body.phone)
  const sanitizedGrade = sanitize.grade(req.body.grade, 'admin')
  let sanitizedDarkTheme = false
  if (req.body.dark_theme != undefined && req.body.dark_theme === 'on') {
    sanitizedDarkTheme = true
  }
  if (typeof sanitizedPhone == 'string' && sanitizedGrade) {
    // Update user info if pass sanitization
    db.updateUser(
      'admins',
      res.locals.user.id,
      sanitizedPhone,
      req.body.grade,
      sanitizedDarkTheme
    )
    // Update user cookies
    res.locals.user.phone = sanitizedPhone
    res.locals.user.grade = req.body.grade
    res.locals.user.dark_theme = req.body.dark_theme
    // Redirect to panel page
    res.redirect('panel')
    return
  }
  // Tabulate error
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
  // Rerender settings page with error
  res.render('pages/admin/settings', {
    error: error,
    darkMode: true, // Check box handles
    pos: 'Admin'
  })
})

router.get('/manage', async (req, res) => {
  // Create the placeholders for the removal options on the panel
  const domains = (await db.listAllowed('students')) || []
  const tutors = (await db.listAllowed('tutors')) || []
  const admins = (await db.listAllowed('admins')) || []
  const subjects = (await db.listSubjects()) || []
  let domainString = ''
  let tutorString = ''
  let adminString = ''
  let subjectString = ''
  for (let i = 0; i < domains.length; i++) {
    domainString += domains[i]['email'] + ', '
  }
  domainString = domainString.replace(/, $/, '')

  for (let i = 0; i < tutors.length; i++) {
    tutorString += tutors[i]['email'] + ', '
  }
  tutorString = tutorString.replace(/, $/, '')

  for (let i = 0; i < admins.length; i++) {
    adminString += admins[i]['email'] + ', '
  }
  adminString = adminString.replace(/, $/, '')

  for (let i = 0; i < subjects.length; i++) {
    subjectString += subjects[i]['subject'] + ', '
  }
  subjectString = subjectString.replace(/, $/, '')

  res.render('pages/admin/manage', {
    domains: domainString,
    tutors: tutorString,
    admins: adminString,
    subjects: subjectString,
    error: '',
    darkMode: res.locals.user.dark_theme,
    pos: 'Admin'
  })
})

// Take in data given by user in manage panel
router.post('/manage', async (req, res) => {
  // Declare the different regexs used to verify info
  const domainRegex =
    '^(@[\\w\\-.]+\\.[A-Za-z]{2,4}[\\W]*[,\\s]{1}[\\W]*)*(@[\\w\\-.]+\\.[A-Za-z]+)[\\W]*$'
  const emailRegex =
    '^[\\W]*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4}[\\W]*[,\\s]{1}[\\W]*)*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4})[\\W]*$'
  const anyRegex = '^[\\w ,]+$'
  // Tabulate errors and process provided data
  let error = ''
  error += allowUserInput(
    req.body.allowedStudentDomain,
    domainRegex,
    'students',
    'Failed to save allowed student domains\n'
  )
  error += allowUserInput(
    req.body.allowedTutors,
    emailRegex,
    'tutors',
    'Failed to save allowed tutors\n'
  )
  error += allowUserInput(
    req.body.allowedAdmins,
    emailRegex,
    'admins',
    'Failed to save allowed admins\n'
  )
  error += allowUserInput(
    req.body.addSub,
    anyRegex,
    'subjects',
    'Failed to save subjects\n'
  )
  error += revokeUserInput(
    req.body.remSub,
    anyRegex,
    'subjects',
    'Failed to save removed subjects\n'
  )
  error += revokeUserInput(
    req.body.revokedStudentDomain,
    domainRegex,
    'students',
    'Failed to save removed student domains\n'
  )
  error += revokeUserInput(
    req.body.revokedTutors,
    emailRegex,
    'tutors',
    'Failed to save removed tutors\n'
  )
  error += revokeUserInput(
    req.body.revokedAdmins,
    emailRegex,
    'admins',
    'Failed to save removed admins\n'
  )

  // Check check boxes and drop downs for info and add or remove from DB
  if (req.body.add_hol) {
    db.createHoliday(req.body.add_hol)
  }
  if (req.body.rem_hol) {
    db.deleteHoliday(req.body.rem_hol)
  }

  if (req.body.add_inc_h != '-') {
    db.createIncrement(
      Number(req.body.add_inc_h) + Number(req.body.add_inc_m / 60)
    )
  }
  if (req.body.rem_inc_h != '-') {
    db.removeIncrement(
      Number(req.body.rem_inc_h) + Number(req.body.rem_inc_m / 60)
    )
  }

  if (req.body.adv_term) {
    db.advanceTerm()
  }
  if (req.body.inc_grade != undefined) {
    db.incrementGrade()
  }
  if (req.body.rem_students != undefined) {
    db.truncateTable('students')
  } else if (req.body.rem_student_grade != undefined) {
    db.removeOldUsers('students')
  }
  if (req.body.rem_tutors != undefined) {
    db.truncateTable('tutors')
  } else if (req.body.rem_tutor_grade != undefined) {
    db.removeOldUsers('tutors')
  }

  // If there was error then load the manage page with error
  if (error != '') {
    res.render('pages/admin/manage', {
      error: error,
      darkMode: res.locals.user.dark_theme,
      pos: 'Admin' || false
    })
    return
  }
  // Else redirect to panel
  res.redirect('panel')
})

export { router }

/**
 * Filter and tabulate allow requests
 * @param request User submitted info
 * @param regex Regex to evaluate user info with
 * @param database students, tutors, admins, subjects
 * @param error error string to manipulate
 * @returns error string
 */
function allowUserInput(
  request: string,
  regex: string,
  database: string,
  error: string
) {
  if (request.match(regex)) {
    let split = /[, ]+/
    if (database === 'subjects') {
      split = /[,]+/
    }
    const array = request.split(split).map((element: string) => element.trim())

    let string = ''
    for (let i = 0; i < array.length; i++) {
      if (database === 'subjects') {
        string += "('" + functions.toTitleCase(array[i]) + "'),"
      } else {
        string += "('" + array[i].toLowerCase() + "'),"
      }
    }
    string = string.replace(/,$/, '')
    if (database === 'subjects') {
      db.createSubject(string)
    } else {
      db.allowUser(database, string)
    }
    return ''
  }
  if (!request.match('^$')) {
    return error
  }
  return ''
}

/**
 * Filter and tabulate revoke requests
 * @param request User submitted info
 * @param regex Regex to evaluate user info with
 * @param database students, tutors, admins, subjects
 * @param error error string to manipulate
 * @returns error string
 */
function revokeUserInput(
  request: string,
  regex: string,
  database: string,
  error: string
) {
  if (request.match(regex)) {
    let split = /[, ]+/
    if (database === 'subjects') {
      split = /[,]+/
    }
    const array = request.split(split).map((element: string) => element.trim())
    let string = '('
    for (let i = 0; i < array.length; i++) {
      if (database === 'subjects') {
        string += "('" + functions.toTitleCase(array[i]) + "'),"
      } else {
        string += "('" + array[i].toLowerCase() + "'),"
      }
    }
    string = string.replace(/,$/, ')')
    if (database === 'subjects') {
      db.removeSubject(string)
    } else {
      db.revokeUser(database, string)
    }
    return ''
  }
  if (!request.match('^$')) {
    return error
  }
  return ''
}
