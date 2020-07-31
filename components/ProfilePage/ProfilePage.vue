<template>
  <div class="profilePage">
    <ProfileInfo
      v-if="user"
      :user="user"
      :is-owner="isOwner"
      @update="user = $event"
    />
    <v-btn v-if="isOwner" to="/profile/chinchillas/create" nuxt
      >Создать шиншиллу</v-btn
    >
    <CardSection
      v-if="chinchillas"
      :title="isOwner ? 'Ваши шиншиллы' : 'Шиншиллы'"
      :items="chinchillas"
    />
  </div>
</template>

<script>
import CardSection from '../CardSection/CardSection.vue'
import ProfileInfo from '../ProfileInfo/ProfileInfo.vue'

export default {
  name: 'ProfilePage',

  components: { CardSection, ProfileInfo },

  props: {
    userId: {
      type: Number,
      required: true,
    },
  },

  async fetch() {
    this.user = await this.$axios.$get(`user/details/${this.userId}`)
    this.chinchillas = await this.$axios.$get(`chinchilla/get/${this.userId}`)
  },

  data() {
    return {
      user: null,
      chinchillas: null,
      isOwner: this.userId === +this.$cookies.get('USER_ID'),
    }
  },
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
