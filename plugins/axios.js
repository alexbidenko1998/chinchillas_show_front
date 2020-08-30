export default function ({ $axios, $cookies, store }) {
  if ($cookies.get('TOKEN')) $axios.setToken($cookies.get('TOKEN'), 'Bearer')
  $axios.setHeader('Country-Code', store.state.UserModule.country)
}
