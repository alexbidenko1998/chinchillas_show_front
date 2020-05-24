<template>
  <div class="auctionPage">
    <span class="auctionPage__title">Аукцион</span>
  </div>
</template>

<script></script>

<style lang="scss">
.auctionPage {
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
