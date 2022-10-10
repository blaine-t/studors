function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0')
}

function formatDate(date: Date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate())
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds())
    ].join(':')
  )
}

function formatTime(input: string) {
  let hour = Number(input)
  let state = 'AM'
  if (hour > 12) {
    state = 'PM'
    if (hour > 13) {
      hour -= 12
    }
  }
  const res =
    Math.floor(hour) + ':' + padTo2Digits((hour % 1) * 60) + ' ' + state
  return res
}

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt: string) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export default {
  formatDate,
  formatTime,
  toTitleCase
}
