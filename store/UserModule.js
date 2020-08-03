import Actions from '~/store/actions.type'

export default {
  state: {
    user: null,
  },
  actions: {
    [Actions.CHECK_USER]({ state }, callback) {
      this.$axios.$get('user/details').then((data) => {
        state.user = data.user
        if (callback) callback(data.user)
      })
    },
  },
}
