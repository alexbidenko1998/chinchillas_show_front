<template>
  <div class="viewPage">
    <PedigreeTree />
  </div>
</template>

<script>
import PedigreeTree from '~/components/PedigreeTree/PedigreeTree.vue'

export default {
  components: {
    PedigreeTree
  },

  layout: 'profileLayout',

  data() {
    return {
      chinchillaId: +this.$route.query.id
    }
  }
}
</script>

<style lang="scss">
.viewPage {
  padding: 0;
  width: 100%;
}
</style>
