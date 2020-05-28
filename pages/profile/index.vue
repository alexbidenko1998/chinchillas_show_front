<template>
  <ProfilePage v-if="userId" :user-id="userId" />
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
      userId: typeof localStorage === 'undefined' ? 0 : +localStorage.user_id
    }
  }
}
</script>
