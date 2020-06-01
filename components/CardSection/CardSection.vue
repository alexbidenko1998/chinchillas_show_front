<template>
  <section class="cardSection">
    <div class="cardSection__list baseContainer">
      <ChinchillaCard
        v-for="item in items"
        :key="item"
        :chinchilla="item"
      ></ChinchillaCard>
    </div>
  </section>
</template>

<script>
import ChinchillaCard from '../ChinchillaCard/ChinchillaCard'

export default {
  name: 'CardSection',

  components: {
    ChinchillaCard
  },

  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">
.cardSection {
  width: 100%;
  padding: 40px 0;

  &__list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-column-gap: 16px;
    grid-row-gap: 24px;

    @include mq('desktop-small', 'tablet') {
      grid-template-columns: repeat(4, 1fr);
    }

    @include mq('tablet', 'phone') {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mq('phone') {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>
