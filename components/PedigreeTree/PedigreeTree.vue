<template>
  <section
    class="pedigreeTree"
    :style="{ transform: `scale(${scale})`, margin: `${margin}px` }"
  >
    <div ref="container" class="pedigreeTree__container">
      <div class="pedigreeTree__row">
        <div class="pedigreeTree__cell">
          <ChinchillaCard v-if="getParent('m')" :chinchilla="getParent('m')" />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard v-if="getParent('f')" :chinchilla="getParent('f')" />
        </div>
      </div>
      <div class="pedigreeTree__row">
        <div class="pedigreeTree__cell pedigreeTree__cell--pair">
          <ChinchillaCard
            v-if="getParent('m.m')"
            :chinchilla="getParent('m.m')"
          />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard
            v-if="getParent('m.f')"
            :chinchilla="getParent('m.f')"
          />
        </div>
        <div class="pedigreeTree__cell pedigreeTree__cell--pair">
          <ChinchillaCard
            v-if="getParent('f.m')"
            :chinchilla="getParent('f.m')"
          />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard
            v-if="getParent('f.f')"
            :chinchilla="getParent('f.f')"
          />
        </div>
      </div>
      <div class="pedigreeTree__row pedigreeTree__row--join">
        <div class="pedigreeTree__cell">
          <ChinchillaCard
            v-if="getParent('m.m.m')"
            :chinchilla="getParent('m.m.m')"
          />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard
            v-if="getParent('m.m.f')"
            :chinchilla="getParent('m.m.f')"
          />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard
            v-if="getParent('m.f.m')"
            :chinchilla="getParent('m.f.m')"
          />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard
            v-if="getParent('m.f.f')"
            :chinchilla="getParent('m.f.f')"
          />
        </div>
      </div>
      <div class="pedigreeTree__row pedigreeTree__row--last">
        <div class="pedigreeTree__cell">
          <ChinchillaCard
            v-if="getParent('f.m.m')"
            :chinchilla="getParent('f.m.m')"
          />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard
            v-if="getParent('f.m.f')"
            :chinchilla="getParent('f.m.f')"
          />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard
            v-if="getParent('f.f.m')"
            :chinchilla="getParent('f.f.m')"
          />
        </div>
        <div class="pedigreeTree__cell">
          <ChinchillaCard
            v-if="getParent('f.f.f')"
            :chinchilla="getParent('f.f.f')"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ChinchillaCard from '../ChinchillaCard/ChinchillaCard'

export default {
  name: 'PedigreeTree',

  components: {
    ChinchillaCard,
  },

  props: {
    chinchilla: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      scale: 1,
      margin: 0,
    }
  },

  mounted() {
    import('~/assets/scripts/zoomElement').then((zoomElement) => {
      // zoomElement.default(this.$refs.container)
      this.review()
    })
    window.addEventListener('resize', this.review)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.review)
  },

  methods: {
    review() {
      document.body.scrollWidth < 1100
        ? (this.scale = Math.max(document.body.scrollWidth / 1100, 0.5))
        : (this.scale = 1)
      this.scale === 1
        ? (this.margin = 0)
        : (this.margin = -(((1 - this.scale) * 1100) / 2))
    },
    getParent(steps) {
      return steps
        .split('.')
        .reduce(
          (c, s) => c && c[s === 'm' ? 'mother' : 'father'],
          this.chinchilla
        )
    },
  },
}
</script>

<style lang="scss">
.pedigreeTree {
  width: 100%;
  min-width: 1100px;
  overflow: hidden;
  padding-bottom: 40px;

  &__container {
    min-width: 1100px;
  }

  &__row {
    display: flex;
    width: fit-content;
    margin: 0 auto;
  }

  &__cell {
    width: 240px;
    height: 240px;
    margin: 32px 16px;
    position: relative;
    background-color: #828282;

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
