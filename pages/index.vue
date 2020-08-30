<template>
  <div class="mainPage">
    <section class="baseContainer mainPage__header">
      <h3 class="mainPage__question">Кто мы?</h3>
      <p class="mainPage__answer">Международный сервис для</p>
      <ul>
        <li class="mainPage__answerItem">регистрации шиншилл на выставках</li>
        <li class="mainPage__answerItem">ведения генетической базы</li>
        <li class="mainPage__answerItem">продажи/покупки шиншилл</li>
      </ul>
    </section>
    <nuxt-link class="mainPage__auth" to="/profile">Профиль</nuxt-link>
  </div>
</template>

<script></script>

<style lang="scss">
.mainPage {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;

  &__header {
    padding-top: 40px;
    padding-bottom: 40px;
    width: 100%;
  }

  &__question {
    font-weight: 800;
    font-size: 36px;
    line-height: 45px;
    text-transform: uppercase;
    color: #262626;
    margin-bottom: 24px;
  }

  &__answer {
    font-weight: 500;
    font-size: 26px;
    line-height: 33px;
    text-transform: uppercase;
    color: #d79b00;
  }

  &__answerItem {
    padding-left: 32px;
    position: relative;
    font-weight: 500;
    font-size: 18px;
    line-height: 34px;
    color: #262626;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: calc(50% - 3px);
      background-color: #d79b00;
    }
  }

  &__auth {
    @include buttonReset;
    font-size: 24px;
  }
}
</style>
