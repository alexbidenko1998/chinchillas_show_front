<template>
  <div class="colorPage">
    <div v-if="data" class="baseContainer">
      {{ data.name }}
      <form class="colorPage__form" @submit.prevent="onSubmit">
        <label v-for="item in config" :key="item.name" class="colorPage__label">
          {{ item.label }}
          <select v-model="models[item.name]" :name="item.name">
            <option
              v-for="variant in item.variants"
              :key="variant.value"
              :value="variant.value"
              >{{ variant.label }}</option
            >
          </select>
        </label>
        <button type="submit">Сохранить</button>
      </form>
    </div>
    <BaseSpinner v-else />
  </div>
</template>

<script>
import BaseSpinner from '~/components/BaseSpinner/BaseSpinner.vue'
import colorConfig from '~/assets/datas/colorConfig.json'

export default {
  name: 'ColorPage',

  components: { BaseSpinner },

  layout: 'profileLayout',

  data() {
    const models = {}
    colorConfig.forEach((el) => (models[el.name] = el.variants[0].value))
    return {
      chinchillaId: +this.$route.query.id,
      data: null,
      config: colorConfig,
      models
    }
  },

  created() {
    this.$axios.$get(`chinchilla/details/${this.chinchillaId}`).then((data) => {
      if (data.owner_id === +localStorage.user_id) {
        this.data = data
        if (data.color) this.models = data.color
      } else this.$router.push('/profile')
    })
  },

  methods: {
    onSubmit() {
      this.$axios
        .$post(`chinchilla/color/${this.chinchillaId}`, this.models)
        .then(() => {
          this.$router.push('/profile')
        })
        .catch(() => {
          alert('Что-то пошло не так')
        })
    }
  }
}
</script>

<style lang="scss">
.colorPage {
  position: relative;

  &__form {
    display: flex;
    flex-wrap: wrap;
  }

  &__label {
    width: 25%;
    display: block;
  }
}
</style>
