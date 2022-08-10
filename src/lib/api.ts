import db from './db'

async function acceptHoursRequest(apiKey: string) {
  //Checks if API key is not a string and then tells user invalid type
  if (typeof apiKey !== 'string') {
    // If API key is undefined then tell user to supply one
    if (apiKey === undefined) {
      return { supply: 'API KEY' }
    }
    return { invalid: 'TYPE' }
  }
  // Return the hours worked by tutors
  if ((await db.confirmApiKey(apiKey)) != null) {
    return await db.getHours()
  }
  // If API key is supplied but isn't right report unauthorized
  return { user: 'UNAUTHORIZED' }
}

export default {
  acceptHoursRequest
}
