import db from './db'

async function acceptHoursRequest(apiKey: string) {
  if (typeof apiKey !== 'string') {
    if (apiKey === undefined) {
      return { supply: 'API KEY' }
    }
    return { invalid: 'TYPE' }
  }
  if ((await db.confirmApiKey(apiKey)) != null) {
    return await db.getHours()
  }
  return { user: 'UNAUTHORIZED' }
}

export default {
  acceptHoursRequest
}
