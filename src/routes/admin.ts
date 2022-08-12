import express from 'express'
const router = express.Router()

router.get('/register', (req, res) => {
  res.render('pages/admin/register')
})

router.get('/panel', (req, res) => {
  if (req.user) {
    res.render('pages/admin/panel', {
      user: req.user
    })
  } else {
    res.redirect('/auth/admin')
  }
})

router.get('/settings', (req, res) => {
  res.render('pages/admin/settings')
})

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

router.get('/login', (req, res) => {
  res.redirect('/')
})

export { router }
