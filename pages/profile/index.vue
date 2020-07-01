<template>
  <ProfilePage v-if="userId && active" :user-id="userId" />
  <div v-else></div>
</template>

<script>
import ProfilePage from '~/components/ProfilePage/ProfilePage.vue'

export default {
  components: {
    ProfilePage
  },

  layout: 'profileLayout',

  data() {
    return {
      active: true
    }
  },

  computed: {
    userId() {
      return (
        +this.$route.query.id ||
        (typeof localStorage === 'undefined' ? 0 : +localStorage.user_id)
      )
    }
  },

  watch: {
    $route() {
      this.active = false
      this.$nextTick(() => {
        this.active = true
      })
    }
  }
}
</script>
