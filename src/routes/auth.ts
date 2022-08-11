import express from 'express'
import passport from 'passport'
const router = express.Router()

router.get(
  '/student/google',
  passport.authenticate('student-google', {
    successRedirect: '/student/home',
    failureRedirect: '/auth/failure'
  })
)
router.get('/student', (req, res) => {
  res.redirect('/auth/student/google')
})

router.get(
  '/tutor/google',
  passport.authenticate('student-google', {
    successRedirect: '/tutor/home',
    failureRedirect: '/auth/failure'
  })
)

router.get(
  '/admin/google',
  passport.authenticate('admin-google', {
    successRedirect: '/admin/panel',
    failureRedirect: '/auth/failure'
  })
)

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

export { router }
