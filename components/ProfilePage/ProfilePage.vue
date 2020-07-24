<template>
  <div class="profilePage">
    <template v-if="user && chinchillas">
      <ProfileInfo :user="user" :is-owner="isOwner" @update="user = $event" />
      <v-btn v-if="isOwner" to="/profile/chinchillas/create" nuxt
        >Создать шиншиллу</v-btn
      >
      <CardSection
        :title="isOwner ? 'Ваши шиншиллы' : 'Шиншиллы'"
        :items="chinchillas"
      />
    </template>
    <BaseSpinner v-else />
  </div>
</template>

<script>
import CardSection from '../CardSection/CardSection.vue'
import ProfileInfo from '../ProfileInfo/ProfileInfo.vue'
import BaseSpinner from '../BaseSpinner/BaseSpinner.vue'

export default {
  name: 'ProfilePage',

  components: { BaseSpinner, CardSection, ProfileInfo },

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
  flex-direction: column;
  position: relative;
  flex: 1;

  &__title {
    @include buttonReset;
    font-size: 24px;
  }
}
</style>
