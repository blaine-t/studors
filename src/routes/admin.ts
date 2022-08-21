import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import db from '../lib/db'

function checkAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user
    if (res.locals.user.pos === 'admin') {
      next()
      return
    }
  }
  res.redirect('/auth/admin')
}

router.use(checkAuthentication)

router.get('/panel', (req, res) => {
  res.render('pages/admin/panel')
})

router.get('/list', async (req, res) => {
  // Sequential because parrallel connections harm runtime in tests. Confirm later
  const students = await db.listUsers('students')
  const tutors = await db.listUsers('tutors')
  const admins = await db.listUsers('admins')
  const studentDomains = await db.listUsers('allowedstudents')
  const tutorEmails = await db.listUsers('allowedtutors')
  const adminEmails = await db.listUsers('allowedadmins')
  const pastSessions = await db.listSessions(false)
  const upcomingSessions = await db.listSessions(true)
  res.render('pages/admin/list', {
    students: students,
    tutors: tutors,
    admins: admins,
    studentAllowed: studentDomains,
    tutorAllowed: tutorEmails,
    adminAllowed: adminEmails,
    pastSessions: pastSessions,
    upcomingSessions: upcomingSessions
  })
})

router.get('/settings', (req, res) => {
  res.render('pages/admin/settings', { error: '' })
})

router.post('/settings', (req, res) => {
  if (
    req.body.phone.match('^([2-9][0-8][0-9])[-]([2-9][0-9]{2})[-]([0-9]{4})$')
  ) {
    db.updateAdmin(
      res.locals.user.id,
      req.body.phone,
      req.body.dark_theme || false
    )
    res.locals.user.phone = req.body.phone
    res.locals.user.dark_theme = req.body.dark_theme
    res.redirect('panel')
    return
  }
  res.render('pages/admin/settings', { error: 'Failed to save phone number' })
})

router.get('/manage', (req, res) => {
  res.render('pages/admin/manage', { error: '' })
})

router.post('/manage', async (req, res) => {
  const domainRegex =
    '[\\W]*(@[\\w\\-.]+\\.[A-Za-z]+[\\W]*,{1}[\\W]*)*(@[\\w\\-.]+\\.[A-Za-z]+)[\\W]*$'
  const emailRegex =
    '^[\\W]*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4}[\\W]*,{1}[\\W]*)*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4})[\\W]*$'
  let error = ''
  error += checkUserInput(
    req.body.allowedStudentDomain,
    domainRegex,
    true,
    'students',
    'Failed to save allowed student domains\n'
  )
  error += checkUserInput(
    req.body.allowedTutors,
    emailRegex,
    true,
    'tutors',
    'Failed to save allowed tutors\n'
  )
  error += checkUserInput(
    req.body.allowedAdmins,
    emailRegex,
    true,
    'admins',
    'Failed to save allowed admins\n'
  )
  error += checkUserInput(
    req.body.revokedStudentDomain,
    domainRegex,
    false,
    'students',
    'Failed to save removed student domains\n'
  )
  error += checkUserInput(
    req.body.revokedTutors,
    emailRegex,
    false,
    'tutors',
    'Failed to save removed tutors\n'
  )
  error += checkUserInput(
    req.body.revokedAdmins,
    emailRegex,
    false,
    'admins',
    'Failed to save removed admins\n'
  )

  if (req.body.inc_grade != undefined) {
    await db.incrementGrade()
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
  if (req.body.rem_admins) {
    db.truncateTable('admins')
  }

  if (error != '') {
    res.render('pages/admin/manage', { error: error })
    return
  }
  res.redirect('panel')
})

export { router }

function checkUserInput(
  request: string,
  regex: string,
  allow: boolean,
  database: string,
  error: string
) {
  if (request.match(regex)) {
    const array = request.split(',').map((element: string) => element.trim())

    let string = ''
    for (let i = 0; i < array.length; i++) {
      string += "('" + array[i] + "'),"
    }
    string = string.replace(/,$/, '')
    if (allow) {
      db.allowUser(database, string)
      return ''
    }
    db.revokeUser(database, string)
    return ''
  }
  if (!request.match('^$')) {
    return error
  }
  return ''
}
