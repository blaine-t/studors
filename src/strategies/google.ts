import passport from 'passport'
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback
} from 'passport-google-oauth20'
import db from '../lib/db'

passport.serializeUser((userObj, done) => {
  done(null, userObj)
})

passport.deserializeUser((userObj: Express.User, done) => {
  done(null, userObj)
})

passport.use(
  'student-google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'clientIDNotFound',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'clientSecretNotFound',
      callbackURL:
        process.env.GOOGLE_STUDENT_REDIRECT_URL || 'studentRedirectNotFound',
      scope: ['email', 'profile']
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      // If there is already a student with this ID
      const studentProfile = await db.authUser('students', profile.id)
      if (studentProfile) {
        done(null, studentProfile)
      }
      // If there is not a student with this ID
      else {
        db.createUser(
          'students',
          profile.id,
          profile._json.given_name || 'Example',
          profile._json.family_name || 'Student',
          profile._json.picture || 'https://via.placeholder.com/96',
          profile._json.email || 'example@class.lps.org'
        )
        const studentProfile = await db.authUser('students', profile.id)
        done(null, studentProfile)
      }
      done(null, false)
    }
  )
)

passport.use(
  'tutor-google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'clientIDNotFound',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'clientSecretNotFound',
      callbackURL:
        process.env.GOOGLE_TUTOR_REDIRECT_URL || 'tutorRedirectNotFound',
      scope: ['email', 'profile']
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      // If there is already a student with this ID
      const tutorProfile = await db.authUser('tutors', profile.id)
      if (tutorProfile) {
        done(null, tutorProfile)
      }
      // If there is not a student with this ID
      else {
        db.createUser(
          'tutors',
          profile.id,
          profile._json.given_name || 'Example',
          profile._json.family_name || 'Tutor',
          profile._json.picture || 'https://via.placeholder.com/96',
          profile._json.email || 'exampleTutor@class.lps.org'
        )
        done(null, false)
      }
    }
  )
)

passport.use(
  'admin-google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'clientIDNotFound',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'clientSecretNotFound',
      callbackURL:
        process.env.GOOGLE_ADMIN_REDIRECT_URL || 'adminRedirectNotFound',
      scope: ['email', 'profile']
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      // If there is already a student with this ID
      const adminProfile = await db.authUser('admins', profile.id)
      if (adminProfile) {
        done(null, adminProfile)
      }
      // If there is not a student with this ID
      else if (profile._json.email != undefined) {
        if ((await db.checkUser('admins', profile._json.email)) != undefined) {
          db.createUser(
            'admins',
            profile.id,
            profile._json.given_name || 'Example',
            profile._json.family_name || 'Admin',
            profile._json.picture || 'https://via.placeholder.com/96',
            profile._json.email
          )
        }
        done(null, false)
      }
    }
  )
)
