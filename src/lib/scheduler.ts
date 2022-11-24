import schedule from 'node-schedule'

import db from './db'
import { previousSunday, nextSunday } from 'date-fns'

/**
 * At 1700 on Monday of every week generate this weeks and next weeks schedule
 */
function scheduleDates() {
  schedule.scheduleJob('* * * * *', async function () {
    await db.truncateTable('availabilitymap')
    await db.createDates(previousSunday(Date.now()))
    db.migrateWeeklyToDates(previousSunday(Date.now()))
    await db.createDates(nextSunday(Date.now()))
    db.migrateWeeklyToDates(nextSunday(Date.now()))
  })
}

export default {
  scheduleDates
}
