import Actions from '~/store/actions.type'

export default function({ store, redirect, $axios, req }) {
  if (!req.cookies.TOKEN || !req.cookies.USER_ID) {
    redirect('/auth')
    return
  }

  $axios.setHeader('Authorization', `Bearer ${req.cookies.TOKEN}`)

  if (!store.user) {
    store.dispatch(Actions.CHECK_USER)
  }
}
