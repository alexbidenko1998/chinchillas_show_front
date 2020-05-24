<template>
  <div class="mainPage">
    <nuxt-link class="mainPage__auth" to="/profile">Профиль</nuxt-link>
  </div>
</template>

<script></script>

<style lang="scss">
.mainPage {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  &__auth {
    @include buttonReset;
    font-size: 24px;
  }
}
</style>
