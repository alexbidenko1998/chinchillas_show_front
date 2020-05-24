<template>
  <div class="profilePage">
    <span class="profilePage__title">Пользователь {{ userId }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId:
        this.$route.params.userId ||
        (typeof localStorage !== 'undefined' && localStorage.user_id)
    }
  }
}
</script>

<style lang="scss">
.profilePage {
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
