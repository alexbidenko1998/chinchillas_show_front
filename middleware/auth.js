import Actions from '~/store/actions.type'

export default function ({ store, redirect, $axios, app }) {
  if (!app.$cookies.get('TOKEN') || !app.$cookies.get('USER_ID')) {
    redirect('/auth')
    return
  }

  $axios.setToken(app.$cookies.get('TOKEN'), 'Bearer')

  if (!store.user) {
    store.dispatch(Actions.CHECK_USER)
  }
}
