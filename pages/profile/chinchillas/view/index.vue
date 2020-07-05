<template>
  <div class="viewPage baseContainer">
    <template v-if="data">
      {{ data.name }}
      <nuxt-link
        v-if="userId === data.owner_id"
        :to="`/profile/chinchillas/color?id=${chinchillaId}`"
        >Редактировать цвет</nuxt-link
      >
      <PedigreeTree />
    </template>
    <BaseSpinner v-else />
  </div>
</template>

<script>
import PedigreeTree from '~/components/PedigreeTree/PedigreeTree.vue'
import BaseSpinner from '~/components/BaseSpinner/BaseSpinner.vue'

export default {
  components: {
    BaseSpinner,
    PedigreeTree
  },

  layout: 'profileLayout',

  data() {
    return {
      chinchillaId: +this.$route.query.id,
      userId: +localStorage.user_id,
      data: null
    }
  },

  created() {
    this.$axios
      .$get(`chinchilla/details/${this.chinchillaId}`)
      .then((data) => (this.data = data))
  }
}
</script>

<style lang="scss">
.viewPage {
  width: 100%;
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
