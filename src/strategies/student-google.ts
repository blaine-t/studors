import passport from 'passport'
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback
} from 'passport-google-oauth20'
import db from '../lib/db'

passport.use(
  'student-google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_STUDENT_REDIRECT_URL!,
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
        done(null, false)
      }
    }
  )
)

passport.serializeUser((userObj, done) => {
  console.log(userObj)
  done(null, userObj)
})

passport.deserializeUser((userObj: Express.User, done) => {
  done(null, userObj)
})
