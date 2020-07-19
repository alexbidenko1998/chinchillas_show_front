<template>
  <nuxt-link
    class="chinchillaCard"
    :style="{
      backgroundImage: chinchilla.avatar
        ? `url(https://api.chinchillas-show.com/photos/chinchillas/${chinchilla.owner_id}/${chinchilla.id}/${chinchilla.avatar.name})`
        : 'url(https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg)'
    }"
    :to="`/profile/chinchillas/view?id=${chinchilla.id}`"
  >
    <div class="chinchillaCard__titleContainer">
      <h3 class="chinchillaCard__title">{{ chinchilla.name }}</h3>
    </div>
  </nuxt-link>
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
  position: relative;
  display: block;

  &__titleContainer {
    position: absolute;
    bottom: 0;
    background-color: #828282;
    padding: 0 16px;
    height: 34px;
    width: 100%;
  }

  &__title {
    text-align: center;
    color: #fff;
    border-top: 1px solid #fff;
    line-height: 33px;
  }
}
</style>
