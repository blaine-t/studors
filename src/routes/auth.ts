import express from 'express'
import passport from 'passport'
const router = express.Router()

router.get('/student', (req, res) => {
  res.redirect('/auth/student/google')
})

router.get(
  '/student/google',
  passport.authenticate('student-google', {
    successRedirect: '/student/home',
    failureRedirect: '/auth/failure'
  })
)

router.get('/tutor', (req, res) => {
  res.redirect('/auth/tutor/google')
})

router.get(
  '/tutor/google',
  passport.authenticate('tutor-google', {
    successRedirect: '/tutor/home',
    failureRedirect: '/auth/failure'
  })
)

router.get('/admin', (req, res) => {
  res.redirect('/auth/admin/google')
})

router.get(
  '/admin/google',
  passport.authenticate('admin-google', {
    successRedirect: '/admin/panel',
    failureRedirect: '/auth/failure'
  })
)

router.get('/failure', (req, res) => {
  res.render('pages/auth/failure')
})

// Change this to a post request
router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/') //Inside a callback… bulletproof!
  })
})

export { router }
