function phone(phone: string) {
  phone = phone.replace(/\D/g, '')
  if (phone.length == 10) {
    phone =
      '(' +
      phone.slice(0, 3) +
      ') ' +
      phone.slice(3, 6) +
      '-' +
      phone.slice(6, 10)
    return phone
  } else {
    return false
  }
}

export default {
  phone
}
