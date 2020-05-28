<template>
  <ProfilePage :user-id="userId" />
</template>

<script>
import ProfilePage from '~/components/ProfilePage/ProfilePage.vue'

export default {
  layout: 'profileLayout',

  components: {
    ProfilePage
  },

  data() {
    return {
      userId: +this.$route.params.userId
    }
  }
}
</script>
