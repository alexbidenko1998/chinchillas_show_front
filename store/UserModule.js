import Actions from '~/store/actions.type'

export default {
  state: {
    user: null,
  },
  actions: {
    [Actions.CHECK_USER]({ state }) {
      this.$axios.$get('user/details').then((user) => (state.user = user))
    },
  },
}
