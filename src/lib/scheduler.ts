import schedule from 'node-schedule'

import db from './db'
import functions from './functions'

/**
 * At 1700 on Monday of every week generate this weeks and next weeks schedule
 */
function scheduleDates() {
  schedule.scheduleJob('* * * * *', async function () {
    await db.truncateTable('availabilitymap')
    const currentDate = new Date()
    const nextWeekDate = new Date()
    nextWeekDate.setDate(currentDate.getDate() + 7)
    const currentSunday = new Date(functions.getSunday(currentDate))
    const nextSunday = new Date(functions.getSunday(nextWeekDate))
    const lastSunday = new Date(nextSunday)
    lastSunday.setDate(nextSunday.getDate() + 7)
    await db.createDates(currentSunday)
    db.migrateWeeklyToDates(currentSunday)
    await db.createDates(nextSunday)
    db.migrateWeeklyToDates(nextSunday)
  })
}

/**
 * Every 15 minutes during the weekdays purge old times
 */
function purgeOldDates() {
  schedule.scheduleJob('*/15 * * * 1-5', function () {
    db.purgeOldAvailability()
  })
}

export default {
  scheduleDates,
  purgeOldDates
}
