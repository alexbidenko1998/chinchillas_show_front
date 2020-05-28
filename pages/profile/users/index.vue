<template>
  <div class="usersPage">
    <nuxt-link
      v-for="user in users"
      :key="user.id"
      class="usersPage__title"
      :to="`/profile/${user.id}`"
    >
      {{ user.id }}: {{ user.login }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'UsersPage',

  layout: 'profileLayout',

  data() {
    return {
      users: []
    }
  },

  created() {
    this.$axios.$get('user/search').then((users) => (this.users = users))
  }
}
</script>

<style lang="scss">
.usersPage {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;

  &__title {
    @include buttonReset;
    font-size: 24px;
  }
}
</style>
