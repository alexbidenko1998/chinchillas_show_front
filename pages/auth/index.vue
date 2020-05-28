<template>
  <div class="authPage baseContainer">
    <article class="authPage__card">
      <nav class="authPage__toggle">
        <button
          class="authPage__toggleButton"
          :class="{ 'authPage__toggleButton--active': mode === 'signIn' }"
          @click="mode = 'signIn'"
        >
          Вход
        </button>
        <button
          class="authPage__toggleButton"
          :class="{ 'authPage__toggleButton--active': mode === 'signUp' }"
          @click="mode = 'signUp'"
        >
          Регистрация
        </button>
      </nav>
      <transition mode="out-in" name="fade">
        <form
          v-if="mode === 'signIn'"
          key="signIn"
          class="authPage__form"
          @submit.prevent="submitSignIn"
        >
          <BaseInput
            v-model="signIn.login"
            placeholder="Логин"
            class="authPage__input"
          />
          <BaseInput
            v-model="signIn.password"
            placeholder="Пароль"
            type="password"
            class="authPage__input"
          />
          <nuxt-link to="" class="authPage__remindPassword"
            >Забыли пароль?</nuxt-link
          >
          <button type="submit" class="authPage__submit">Войти</button>
        </form>
        <form
          v-if="mode === 'signUp'"
          key="signUp"
          class="authPage__form authPage__form--signUp"
          @submit.prevent="submitSignUp"
        >
          <BaseScroller>
            <BaseInput
              v-model="signUp.login"
              :v="$v.signUp.login"
              placeholder="Логин"
              class="authPage__input"
            />
            <BaseInput
              v-model="signUp.email"
              :v="$v.signUp.email"
              placeholder="E-Mail"
              type="password"
              class="authPage__input"
            />
            <BaseInput
              v-model="signUp.phone"
              :v="$v.signUp.phone"
              placeholder="E-Mail"
              type="password"
              class="authPage__input"
            />
            <BaseInput
              v-model="signUp.first_name"
              :v="$v.signUp.first_name"
              placeholder="E-Mail"
              type="password"
              class="authPage__input"
            />
            <BaseInput
              v-model="signUp.last_name"
              :v="$v.signUp.last_name"
              placeholder="E-Mail"
              type="password"
              class="authPage__input"
            />
            <BaseInput
              v-model="signUp.patronymic"
              :v="$v.signUp.patronymic"
              placeholder="E-Mail"
              type="password"
              class="authPage__input"
            />
            <BaseInput
              v-model="signUp.country"
              :v="$v.signUp.country"
              placeholder="E-Mail"
              type="password"
              class="authPage__input"
            />
            <BaseInput
              v-model="signUp.city"
              :v="$v.signUp.city"
              placeholder="E-Mail"
              type="password"
              class="authPage__input"
            />
            <BaseInput
              v-model="signUp.password"
              :v="$v.signUp.password"
              placeholder="Пароль"
              type="password"
              class="authPage__input"
            />
          </BaseScroller>
          <button
            type="submit"
            class="authPage__submit"
            :disabled="$v.$invalid"
          >
            Войти
          </button>
        </form>
      </transition>
    </article>
  </div>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import BaseInput from '~/components/BaseInput/BaseInput.vue'
import BaseScroller from '~/components/BaseScroller/BaseScroller.vue'

export default {
  components: {
    BaseInput,
    BaseScroller
  },

  data() {
    return {
      mode: 'signIn',
      signIn: {
        login: '',
        password: ''
      },
      signUp: {
        login: '',
        email: '',
        phone: '',
        first_name: '',
        last_name: '',
        patronymic: '',
        country: '',
        city: '',
        password: ''
      }
    }
  },

  methods: {
    submitSignIn() {
      this.$axios.$post('login', this.signIn).then((data) => {
        localStorage.token = data.token
        localStorage.user_id = data.user.id
        this.$axios.setHeader('Authorization', `Bearer ${data.token}`)
        this.$router.push('/profile')
      })
    },
    submitSignUp() {
      this.$axios.$post('register', this.signUp).then((data) => {
        localStorage.token = data.token
        localStorage.user_id = data.user.id
        this.$axios.setHeader('Authorization', `Bearer ${data.token}`)
        this.$router.push('/profile')
      })
    }
  },

  validations: {
    login: {
      required,
      minLength: minLength(6)
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(8)
    }
  }
}
</script>

<style lang="scss">
.authPage {
  flex: 1;
  background: url('/assets/background/background_auth.png') no-repeat center /
    cover;
  display: flex;
  align-items: center;

  &__card {
    background: #fff;
    border-radius: 15px;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
    margin-left: auto;
    width: 100%;
    max-width: 520px;
    padding: 28px 42px;
    display: flex;
    flex-direction: column;
  }

  &__toggle {
    width: 100%;
    flex: 0 0 36px;
    height: 36px;
    border-radius: 18px;
    overflow: hidden;
    margin-bottom: 12px;
    display: flex;
  }

  &__toggleButton {
    @include buttonReset;
    width: 50%;
    height: 100%;
    font-family: 'Noto Sans', sans-serif;
    font-size: 18px;
    color: #fff;
    background: #c7c7c7;
    transition: box-shadow 0.3s, background-color 0.3s, color 0.3s;

    &--active {
      background: #d79b00;
      box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
    }
  }

  &__form {
    transition: opacity 0.3s;
    flex: 1;
    display: flex;
    flex-direction: column;

    &.fade-enter,
    &.fade-leave-to {
      opacity: 0;
    }

    &--signUp {
      height: calc(100vh - 500px);
    }

    .baseScroller {
      flex: 1;
    }
  }

  &__input {
    margin: 24px 0 32px;

    &:last-of-type {
      margin-bottom: 12px;
    }
  }

  &__remindPassword {
    font-family: 'Noto Sans', sans-serif;
    font-size: 14px;
    line-height: 19px;
    color: #11a3f5;
    margin-left: auto;
    display: block;
    width: fit-content;
    margin-bottom: 12px;
  }

  &__submit {
    @include buttonReset;
    margin-left: auto;
    background: #d79b00;
    border-radius: 16px;
    font-family: 'Noto Sans', sans-serif;
    font-size: 18px;
    height: 36px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #ffffff;
    padding: 0 24px;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
    margin-top: 20px;
  }
}
</style>
