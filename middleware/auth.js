import Actions from '~/store/actions.type'

export default function ({ store, redirect, app, route }) {
  if (!app.$cookies.get('TOKEN') || !app.$cookies.get('USER_ID')) {
    redirect('/auth')
    return
  }

  const check = (user) => {
    if (route.path.startsWith('/profile') && !(user && user.admitted))
      redirect('/await')
    else if (
      route.path.startsWith('/admin') &&
      !(user && ['admin', 'moderator'].includes(user.type))
    )
      redirect('/')
  }
  if (!store.user) {
    store.dispatch(Actions.CHECK_USER, check)
  } else check(store.user)
}
