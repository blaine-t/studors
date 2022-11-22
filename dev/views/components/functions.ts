function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0')
}

// Spaghetti code, TODO: FIX
function formatDate(date: Date, userFriendly: boolean, duration: number) {
  let hour = date.getHours()
  let state = ''
  let hourString = ''
  if (userFriendly) {
    if (hour >= 12) {
      state = ' PM'
      if (hour > 12) {
        hour -= 12
      }
    } else {
      state = ' AM'
    }
    hourString = String(hour)
  } else {
    hourString = padTo2Digits(hour)
  }

  let dateString = ''
  if (!userFriendly) {
    dateString = [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate())
    ].join('-')
  } else {
    dateString = date.toDateString() + ' at'
  }

  const durationDate = new Date()
  let durationState = ''
  if (duration != 0) {
    durationDate.setHours(date.getHours(), date.getMinutes() + duration * 60)
    if (durationDate.getHours() >= 12) {
      durationState = ' PM'
      if (durationDate.getHours() > 12) {
        durationDate.setHours(durationDate.getHours() - 12)
      }
    } else {
      durationState = ' AM'
    }
    if (state === durationState) {
      state = ''
    }
    return (
      dateString +
      ' ' +
      [hourString, padTo2Digits(date.getMinutes())].join(':') +
      state +
      ' - ' +
      [durationDate.getHours(), padTo2Digits(durationDate.getMinutes())].join(
        ':'
      ) +
      durationState
    )
  }
  return (
    dateString +
    ' ' +
    [hourString, padTo2Digits(date.getMinutes())].join(':') +
    state
  )
}

function formatTime(input: string) {
  let hour = Number(input)
  let state = 'AM'
  if (hour >= 12) {
    state = 'PM'
    if (hour > 12) {
      hour -= 12
    }
  }
  const res =
    padTo2Digits(Math.floor(hour)) +
    ':' +
    padTo2Digits((hour % 1) * 60) +
    ' ' +
    state
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
