<template>
  <div class="chinchillaRedact">
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
      <v-autocomplete
        v-model="models.mother_id"
        :items="motherItems"
        :loading="isLoadingMother"
        :search-input.sync="motherSearch"
        color="white"
        hide-no-data
        hide-selected
        item-text="name"
        item-value="id"
        label="Мама"
        placeholder="Введите кличку шиншиллы"
      />
      <v-autocomplete
        v-model="models.father_id"
        :items="fatherItems"
        :loading="isLoadingFather"
        :search-input.sync="fatherSearch"
        color="white"
        hide-no-data
        hide-selected
        item-text="name"
        item-value="id"
        label="Папа"
        placeholder="Введите кличку шиншиллы"
      />
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
  name: 'ChinchillaRedact',

  props: {
    chinchillaId: {
      default: 0,
      type: Number
    }
  },

  data() {
    return {
      models: {
        name: '',
        status: 'baby',
        is_ready: false,
        birthday: null,
        sex: 'f',
        mother_id: null,
        father_id: null,
        weight: '',
        brothers: '',
        awards: '',
        description: ''
      },
      birthday: null,
      isLoading: false,
      datepicker: false,
      isLoadingMother: false,
      isLoadingFather: false,
      motherItems: [],
      fatherItems: [],
      motherSearch: '',
      fatherSearch: ''
    }
  },

  watch: {
    motherSearch(val) {
      this.search(val, 'Mother')
    },
    fatherSearch(val) {
      this.search(val, 'Father')
    }
  },

  created() {
    if (this.chinchillaId) {
      this.$axios
        .$get(`chinchilla/details/${this.chinchillaId}`)
        .then((data) => {
          this.models = data
          this.birthday = new Date(data.birthday).toISOString().substr(0, 10)
        })
      this.$axios.$get(`chinchilla/search`).then((response) => {
        this.motherItems = response.data.filter((el) => el.sex === 'f')
        this.fatherItems = response.data.filter((el) => el.sex === 'm')
      })
    }
  },

  methods: {
    onSubmit() {
      this.models.birthday = new Date(this.birthday).getTime()
      this.isLoading = true
      const models = { ...this.models }
      if (this.chinchillaId) delete models.status
      this.$axios[this.chinchillaId ? '$put' : '$post'](
        this.chinchillaId
          ? `/chinchilla/update/${this.chinchillaId}`
          : 'chinchilla/create',
        models
      )
        .then((data) => {
          this.$router.push(`/profile/chinchillas/color?id=${data.id}`)
        })
        .catch(() => {
          alert('Что-то пошло не так')
          this.isLoading = false
        })
    },
    search(val, type) {
      this['isLoading' + type] = true
      this.$axios.$get(`chinchilla/search?name=${val}`).then((response) => {
        this[type.toLowerCase() + 'Items'] = response.data
        this['isLoading' + type] = false
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
.chinchillaRedact {
}
</style>
