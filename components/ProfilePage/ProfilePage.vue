<template>
  <div class="profilePage">
    <template v-if="user && chinchillas">
      <span class="profilePage__title">Пользователь {{ userId }}</span>
      <span class="profilePage__title">Login {{ user.login }}</span>
      <span class="profilePage__title">Имя {{ user.first_name }}</span>
      <span class="profilePage__title">Фамилия {{ user.last_name }}</span>
      <span class="profilePage__title">Отчество {{ user.patronymic }}</span>
      <span class="profilePage__title">Email {{ user.email }}</span>
      <span class="profilePage__title">Телефон {{ user.phone }}</span>
      <nuxt-link v-if="isOwner" to="/profile/chinchillas/create"
        >Создать шиншиллу</nuxt-link
      >
      <CardSection :items="chinchillas" />
    </template>
    <BaseSpinner v-else />
  </div>
</template>

<script>
import CardSection from '../CardSection/CardSection.vue'
import BaseSpinner from '../BaseSpinner/BaseSpinner.vue'

export default {
  name: 'ProfilePage',

  components: { BaseSpinner, CardSection },

  props: {
    userId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      user: null,
      chinchillas: null,
      isOwner: this.userId === +localStorage.user_id
    }
  },

  created() {
    this.$axios
      .$get(`user/details/${this.userId}`)
      .then((user) => (this.user = user))
    this.$axios
      .$get(`chinchilla/get/${this.userId}`)
      .then((chinchillas) => (this.chinchillas = chinchillas))
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
  position: relative;

  &__title {
    @include buttonReset;
    font-size: 24px;
  }
}
</style>
