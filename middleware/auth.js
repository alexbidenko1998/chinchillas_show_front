// import Actions from '~/store/actions.type'

export default function({ store, redirect }) {
  if (
    typeof localStorage !== 'undefined' &&
    (!localStorage.token || !localStorage.user_id)
  ) {
    redirect('/auth')
    // return
  }

  // if (!store.user) {
  //   store.dispatch(Actions.CHECK_USER, localStorage.user_id)
  // }
}
