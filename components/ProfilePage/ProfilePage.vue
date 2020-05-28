<template>
  <div class="profilePage">
    <span class="profilePage__title">Пользователь {{ userId }}</span>
    <template v-if="user">
      <span class="profilePage__title">Login {{ user.login }}</span>
      <span class="profilePage__title">Имя {{ user.first_name }}</span>
      <span class="profilePage__title">Фамилия {{ user.last_name }}</span>
      <span class="profilePage__title">Отчество {{ user.patronymic }}</span>
      <span class="profilePage__title">Email {{ user.email }}</span>
      <span class="profilePage__title">Телефон {{ user.phone }}</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',

  props: {
    userId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      user: null
    }
  },

  created() {
    this.$axios
      .$get(`user/details/${this.userId}`)
      .then((user) => (this.user = user))
  }
}
</script>

<style lang="scss">
.profilePage {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;

  &__title {
    @include buttonReset;
    font-size: 24px;
  }
}
</style>
