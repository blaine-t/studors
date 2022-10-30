// Gets the previous Sunday
function getSunday(date = new Date()) {
  const previousSunday = new Date()

  previousSunday.setDate(date.getDate() - date.getDay())

  previousSunday.setHours(0, 0, 0, 0)

  return previousSunday
}

export default {
  getSunday
}
