import schedule from 'node-schedule'
import db from './db'

function scheduleDates() {
  schedule.scheduleJob('0 17 * * 1', function () {
    db.createDates()
    db.migrateWeeklyToDates()
  })
}

function purgeOldDates() {
  schedule.scheduleJob('*/15 * * * 1-5', function () {
    db.purgeOldAvailability()
  })
}

export default {
  scheduleDates,
  purgeOldDates
}
