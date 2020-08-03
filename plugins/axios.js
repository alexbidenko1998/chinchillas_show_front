export default function ({ $axios, $cookies }) {
  if ($cookies.get('TOKEN')) $axios.setToken($cookies.get('TOKEN'), 'Bearer')
}
