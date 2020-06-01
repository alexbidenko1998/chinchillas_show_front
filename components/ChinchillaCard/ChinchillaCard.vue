<template>
  <article
    class="chinchillaCard"
    :style="{
      backgroundImage: `url(${'https://i.pinimg.com/originals/22/30/54/22305418269cbc153015646ab1b2e54d.jpg'})`
    }"
  >
    <h3 class="chinchillaCard__title">{{ chinchilla.name }}</h3>
  </article>
</template>

<script>
export default {
  name: 'ChinchillaCard',

  props: {
    chinchilla: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.chinchillaCard {
  height: 200px;
  background: no-repeat center / cover #ccc;

  &__title {
    text-align: center;
  }
}
</style>
