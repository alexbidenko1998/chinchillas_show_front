<template>
  <div class="profilePage">
    <ProfileInfo
      v-if="user"
      :user="user"
      :is-owner="isOwner"
      @update="user = $event"
    />
    <CardSection
      v-for="(list, key) in chinchillas"
      :key="key"
      :title="
        (statuses.find((el) => el.key === key) || { label: 'Без статуса' })
          .label
      "
      :items="list"
    />
    <v-fab-transition>
      <v-btn
        v-if="isOwner"
        color="primary"
        style="background-color: #d79b00"
        dark
        fixed
        bottom
        right
        fab
        nuxt
        to="/profile/chinchillas/create"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
import CardSection from '../CardSection/CardSection.vue'
import ProfileInfo from '../ProfileInfo/ProfileInfo.vue'
import statuses from '~/assets/datas/statuses.json'

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
    const list = await this.$axios.$get(`chinchilla/get/${this.userId}`)
    this.chinchillas = list.reduce((arr, el) => {
      if (!el.status || el.status.name === 'breeding')
        arr[el.sex] = [el, ...(arr[el.sex] ?? [])]
      else arr[el.status.name] = [el, ...(arr[el.status.name] ?? [])]
      return arr
    }, {})
  },

  data() {
    return {
      user: null,
      chinchillas: null,
      isOwner: this.userId === +this.$cookies.get('USER_ID'),
      statuses: [
        { key: 'm', label: 'Самцы' },
        { key: 'f', label: 'Самки' },
        ...statuses,
      ],
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
