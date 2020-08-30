<template>
  <ProfilePage v-if="userId && active" :user-id="userId" />
  <div v-else></div>
</template>

<script>
import ProfilePage from '~/components/ProfilePage/ProfilePage.vue'

export default {
  components: {
    ProfilePage,
  },

  layout: 'profileLayout',

  middleware: 'auth',

  data() {
    return {
      active: true,
    }
  },

  computed: {
    userId() {
      return +this.$route.query.id || +this.$cookies.get('USER_ID')
    },
  },

  watch: {
    $route() {
      this.active = false
      this.$nextTick(() => {
        this.active = true
      })
    },
  },
}
</script>
