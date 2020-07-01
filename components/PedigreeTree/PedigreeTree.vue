<template>
  <section
    class="pedigreeTree"
    :style="{ transform: `scale(${scale})`, margin: `${margin}px` }"
  >
    <div ref="container" class="pedigreeTree__container">
      <div class="pedigreeTree__row">
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
      </div>
      <div class="pedigreeTree__row">
        <div class="pedigreeTree__cell pedigreeTree__cell--pair">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
        <div class="pedigreeTree__cell pedigreeTree__cell--pair">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
      </div>
      <div class="pedigreeTree__row pedigreeTree__row--join">
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
      </div>
      <div class="pedigreeTree__row pedigreeTree__row--last">
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard :chinchilla="chinchilla" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ChinchillaCard from '../ChinchillaCard/ChinchillaCard'
import zoomElement from '~/assets/scripts/zoomElement'

export default {
  name: 'PedigreeTree',

  components: {
    ChinchillaCard
  },

  data() {
    return {
      chinchilla: {
        name: 'test',
        id: 1
      },
      scale: 1,
      margin: 0
    }
  },

  mounted() {
    zoomElement(this.$refs.container)
    this.review()
    window.addEventListener('resize', this.review)
  },

  destroyed() {
    window.removeEventListener('resize', this.review)
  },

  methods: {
    review() {
      document.body.scrollWidth < 1100
        ? (this.scale = document.body.scrollWidth / 1100)
        : (this.scale = 1)
      this.scale === 1
        ? (this.margin = 0)
        : (this.margin = -(((1 - this.scale) * 1100) / 2))
    }
  }
}
</script>

<style lang="scss">
.pedigreeTree {
  width: 100%;
  min-width: 1100px;
  overflow: hidden;
  padding: 40px 0;

  &__container {
    min-width: 1100px;
  }

  &__row {
    display: flex;
    width: fit-content;
    margin: 0 auto;
  }

  &__cell {
    width: 200px;
    margin: 32px 16px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      width: 8px;
      bottom: -64px;
      height: 64px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #d79b00;
    }

    &--pair::before {
      content: '';
      position: absolute;
      height: 8px;
      right: -32px;
      width: 32px;
      top: 50%;
      transform: translateY(-50%);
      background-color: #d79b00;
    }
  }

  &__row--last &__cell::after {
    display: none;
  }

  &__row--join &__cell {
    margin-bottom: 0;

    &::after {
      bottom: -32px;
      height: 32px;
    }
  }
}
</style>
