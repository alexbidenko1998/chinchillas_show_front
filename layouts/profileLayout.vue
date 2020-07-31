<template>
  <v-app class="profileLayout">
    <ProfileHeader />
    <main class="profileLayout__content">
      <nuxt />
    </main>
    <ProfileFooter />
  </v-app>
</template>

<script>
import ProfileHeader from '~/components/ProfileHeader/ProfileHeader.vue'
import ProfileFooter from '~/components/ProfileFooter/ProfileFooter.vue'

export default {
  components: {
    ProfileHeader,
    ProfileFooter,
  },

  middleware: 'auth',
}
</script>

<style lang="scss">
.profileLayout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__content {
    flex: 1;
    display: flex;
  }
}
</style>
