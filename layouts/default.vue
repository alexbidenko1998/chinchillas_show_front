<template>
  <v-app class="defaultLayout">
    <PublicHeader />
    <main class="defaultLayout__content">
      <nuxt />
    </main>
    <PublicFooter />
  </v-app>
</template>

<script>
import PublicHeader from '~/components/PublicHeader/PublicHeader.vue'
import PublicFooter from '~/components/PublicFooter/PublicFooter.vue'

export default {
  components: {
    PublicHeader,
    PublicFooter
  }
}
</script>

<style lang="scss">
.defaultLayout {
  padding-top: 64px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__content {
    flex: 1;
    display: flex;
  }
}
</style>
