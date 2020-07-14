<template>
  <div class="createPage">
    <form class="baseContainer" @submit.prevent="onSubmit">
      <v-text-field v-model="models.name" name="name" label="Кличка" />
      Готова ли к публикации
      <v-checkbox
        v-model="models.is_ready"
        name="is_ready"
        label="Готова ли к публикации"
      />
      <div></div>
      <v-menu
        v-model="datepicker"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="birthday"
            label="День рождения"
            prepend-icon="event"
            name="birthday"
            readonly
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <v-date-picker v-model="birthday" @input="datepicker = false" />
      </v-menu>
      <div></div>
      Пол
      <v-radio-group v-model="models.sex">
        <v-radio label="Самка" value="f" name="sex" />
        <v-radio label="Самец" value="m" name="sex" />
      </v-radio-group>
      <v-text-field
        v-model="models.weight"
        name="weight"
        label="Вес при рождении"
      />
      <v-text-field
        v-model="models.brothers"
        name="brothers"
        label="Щенков в помете"
      />
      <v-text-field v-model="models.awards" name="awards" label="Награды" />
      <v-text-field
        v-model="models.description"
        name="description"
        label="Дополнительное описание"
      />
      <v-btn color="primary" type="submit" :disabled="$v.$invalid || isLoading"
        >Сохранить</v-btn
      >
    </form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'CreatePage',

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
      isLoading: false,
      datepicker: false
    }
  },

  methods: {
    onSubmit() {
      this.models.birthday = new Date(this.birthday).getTime()
      this.isLoading = true
      this.$axios
        .$post('chinchilla/create', this.models)
        .then((data) => {
          this.$router.push(`/profile/chinchillas/color?id=${data.id}`)
        })
        .catch(() => {
          alert('Что-то пошло не так')
          this.isLoading = false
        })
    }
  },

  validations: {
    models: {
      name: {
        required
      }
    },
    birthday: {
      required
    }
  }
}
</script>

<style lang="scss">
.createPage {
}
</style>
