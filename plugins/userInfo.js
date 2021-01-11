import requestIp from 'request-ip'
import Mutations from '~/store/mutations.type'

export default async ({ store, req }) => {
  if (process.server) {
    const ip = requestIp.getClientIp(req)
    const response = await fetch(`http://www.geoplugin.net/json.gp?ip=${ip}`)
    store.commit(
      'UserModule/' + Mutations.SET_COUNTRY,
      ip === '127.0.0.1' ? 'RU' : (await response.json()).geoplugin_countryCode
    )
  }
}
