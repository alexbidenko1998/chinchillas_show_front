<template>
  <v-app class="defaultLayout">
    <PublicHeader :user="user" />
    <main class="defaultLayout__content">
      <nuxt />
    </main>
    <PublicFooter />
  </v-app>
</template>

<script>
import Actions from '../store/actions.type'
import PublicHeader from '~/components/PublicHeader/PublicHeader.vue'
import PublicFooter from '~/components/PublicFooter/PublicFooter.vue'

export default {
  components: {
    PublicHeader,
    PublicFooter,
  },

  computed: {
    user() {
      return this.$store.state.UserModule.user
    },
  },

  created() {
    this.$store.dispatch('UserModule/' + Actions.CHECK_USER)
  },
}
</script>

<style lang="scss">
.defaultLayout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__content {
    flex: 1;
    display: flex;
  }
}
</style>
