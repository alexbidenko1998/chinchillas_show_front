<template>
  <div class="awaitPage baseContainer">
    <span class="awaitPage__title"
      >Ваша заявка на регистрацию отправлена, ожидайте ее проверки</span
    >
  </div>
</template>

<script>
export default {
  name: 'AwaitPage',
}
</script>

<style lang="scss">
.awaitPage {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  &__title {
    @include buttonReset;
    font-size: 24px;
  }
}
</style>
