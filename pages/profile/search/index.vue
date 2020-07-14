<template>
  <div class="searchPage baseContainer">
    <ChinchillaCard
      v-for="chinchilla in chinchillas"
      :key="chinchilla.id"
      :chinchilla="chinchilla"
    />
  </div>
</template>

<script>
import ChinchillaCard from '~/components/ChinchillaCard/ChinchillaCard'

export default {
  name: 'SearchPage',

  components: {
    ChinchillaCard
  },

  layout: 'profileLayout',

  data() {
    return {
      chinchillas: []
    }
  },

  created() {
    this.$axios
      .$get('chinchilla/search')
      .then((chinchillas) => (this.chinchillas = chinchillas))
  }
}
</script>

<style lang="scss">
.searchPage {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 16px;
  grid-row-gap: 24px;
  flex: 1;

  &__title {
    @include buttonReset;
    font-size: 24px;
  }
}
</style>
