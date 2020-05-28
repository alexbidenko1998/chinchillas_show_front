import Actions from '~/store/actions.type'

export default function({ store, redirect, $axios }) {
  if (typeof localStorage !== 'undefined') {
    if (!localStorage.token || !localStorage.user_id) {
      redirect('/auth')
      return
    }

    $axios.setHeader('Authorization', `Bearer ${localStorage.token}`)

    if (!store.user) {
      store.dispatch(Actions.CHECK_USER)
    }
  }
}
