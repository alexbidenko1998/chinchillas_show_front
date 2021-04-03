<template>
  <div class="colorPage">
    <div v-if="data" class="baseContainer">
      {{ data.name }}
      <form class="colorPage__form" @submit.prevent="onSubmit">
        <v-combobox
          v-for="item in config"
          :key="item.name"
          :value="item.variants.find((el) => el.value === models[item.name])"
          class="colorPage__label"
          :name="item.name"
          :items="item.variants"
          item-text="label"
          item-value="value"
          :label="item.label"
          @change="models[item.name] = $event.value"
        />
        <v-btn color="primary" type="submit">Сохранить</v-btn>
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

  middleware: 'auth',

  data() {
    const models = {}
    colorConfig.forEach((el) => (models[el.name] = el.variants[0].value))
    return {
      chinchillaId: +this.$route.params.id,
      data: null,
      config: colorConfig,
      models,
      userId: this.$cookies.get('USER_ID'),
    }
  },

  created() {
    this.$axios.$get(`chinchilla/details/${this.chinchillaId}`).then((data) => {
      if (data.owner_id === +this.userId) {
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
    },
  },
}
</script>

<style lang="scss">
.colorPage {
  position: relative;
  width: 100%;

  &__form {
    display: flex;
    flex-wrap: wrap;
  }

  &__label {
    width: 25%;
    display: block;
  }

  & .baseSpinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
