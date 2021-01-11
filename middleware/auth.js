import Actions from '~/store/actions.type'

export default async ({ store, redirect, app, route }) => {
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

  if (!store.state.UserModule.user) {
    await store.dispatch('UserModule/' + Actions.CHECK_USER, check)
  } else check(store.state.UserModule.user)
}
