<template>
  <div class="createPage">
    <form @submit.prevent="onSubmit" class="baseContainer">
      <BaseInput v-model="models.name" name="name" placeholder="Кличка" />
      Готова ли к публикации
      <input v-model="models.is_ready" name="is_ready" type="checkbox" />
      <div></div>
      День рождения
      <input v-model="birthday" name="birthday" type="date" />
      <div></div>
      Пол
      <label>
        <input v-model="models.sex" name="sex" type="radio" value="f" />
        Самка
      </label>
      <label>
        <input v-model="models.sex" name="sex" type="radio" value="m" />
        Самец
      </label>
      <BaseInput
        v-model="models.weight"
        name="weight"
        placeholder="Вес при рождении"
      />
      <BaseInput
        v-model="models.brothers"
        name="brothers"
        placeholder="Щенков в помете"
      />
      <BaseInput v-model="models.awards" name="awards" placeholder="Награды" />
      <BaseInput
        v-model="models.description"
        name="description"
        placeholder="Дополнительное описание"
      />
      <button type="submit" :disabled="isLoading">Сохранить</button>
    </form>
  </div>
</template>

<script>
import BaseInput from '~/components/BaseInput/BaseInput.vue'

export default {
  name: 'CreatePage',

  components: { BaseInput },

  layout: 'profileLayout',

  data() {
    return {
      models: {
        name: '',
        status: 'baby',
        is_ready: false,
        birthday: null,
        sex: 'f',
        weight: '',
        brothers: '',
        awards: '',
        description: ''
      },
      birthday: null,
      isLoading: false
    }
  },

  methods: {
    onSubmit() {
      this.models.birthday = new Date(this.birthday).getTime()
      this.isLoading = true
      this.$axios
        .$post('chinchilla/create', this.models)
        .then((data) => {
          this.$router.push(`/profile/chinchillas/color/${data.id}`)
        })
        .catch(() => {
          alert('Что-то пошло не так')
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
.createPage {
}
</style>
