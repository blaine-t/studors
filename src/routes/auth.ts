import express from 'express'
import passport from 'passport'
const router = express.Router()

router.get(
  '/student/google',
  passport.authenticate('student-google', {
    successRedirect: '/student/home',
    failureRedirect: '/student/google'
  })
)
router.get('/student', (req, res) => {
  res.redirect('/auth/student/google')
})

router.get(
  '/tutor/google',
  passport.authenticate('tutor-google', {
    successRedirect: '/tutor/home',
    failureRedirect: '/tutor/google'
  })
)
router.get('/tutor', (req, res) => {
  res.redirect('/auth/tutor/google')
})

router.get(
  '/admin/google',
  passport.authenticate('admin-google', {
    successRedirect: '/admin/panel',
    failureRedirect: '/admin/google'
  })
)
router.get('/admin', (req, res) => {
  res.redirect('/auth/admin/google')
})

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

export { router }
