<template>
  <div class="chinchillaRedact baseContainer">
    <form class="chinchillaRedact__form" @submit.prevent="onSubmit">
      <div>
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
          :click:clear.sync="motherSearch"
          item-text="name"
          item-value="id"
          label="Мама"
          placeholder="Введите кличку шиншиллы"
          clearable
        />
        <v-autocomplete
          v-model="models.father_id"
          :items="fatherItems"
          :loading="isLoadingFather"
          :search-input.sync="fatherSearch"
          :click:clear.sync="fatherSearch"
          item-text="name"
          item-value="id"
          label="Папа"
          placeholder="Введите кличку шиншиллы"
          clearable
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
        <v-btn
          color="primary"
          type="submit"
          :disabled="$v.$invalid || isLoading"
          >Сохранить</v-btn
        >
      </div>
      <div>
        <div class="chinchillaRedact__photos">
          <ChinchillaPhoto
            v-for="photo in photos"
            :key="photo.id"
            :user-id="userId"
            :chinchilla="chinchillaId ? models : undefined"
            :photo="photo"
            class="chinchillaRedact__photo"
            :is-avatar="avatar && photo.id === avatar.id"
            @toAvatar="photoToAvatar"
            @delete="deletePhoto"
          />
          <label class="chinchillaRedact__uploadPhoto">
            <v-icon size="40px" color="white">mdi-plus</v-icon>
            <input type="file" multiple accept="image/*" @change="savePhotos" />
          </label>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import ChinchillaPhoto from '~/components/ChinchillaPhoto/ChinchillaPhoto.vue'

export default {
  name: 'ChinchillaRedact',

  components: {
    ChinchillaPhoto,
  },

  props: {
    chinchillaId: {
      default: 0,
      type: Number,
    },
  },

  async fetch() {
    if (this.chinchillaId) {
      this.models = await this.$axios.$get(
        `chinchilla/details/${this.chinchillaId}`
      )
      this.photos = this.models.photos
      this.avatar = this.models.avatar
      this.birthday = new Date(this.models.birthday).toISOString().substr(0, 10)
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
        description: '',
      },
      userId: +this.$cookies.get('USER_ID'),
      birthday: null,
      isLoading: false,
      datepicker: false,
      isLoadingMother: false,
      isLoadingFather: false,
      motherItems: [],
      fatherItems: [],
      motherSearch: '',
      fatherSearch: '',
      photos: [],
      avatar: null,
    }
  },

  watch: {
    motherSearch(val) {
      this.search(val, 'Mother')
    },
    fatherSearch(val) {
      this.search(val, 'Father')
    },
  },

  mounted() {
    this.fetchParents()
  },

  methods: {
    async fetchParents() {
      this.motherItems = (
        await this.$axios.$get(`chinchilla/search?sex=f&perPage=20`)
      ).data.filter((el) => el.sex === 'f')
      this.fatherItems = (
        await this.$axios.$get(`chinchilla/search?sex=m&perPage=20`)
      ).data.filter((el) => el.sex === 'm')
    },
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
          this.uploadPhotos(data.id)
        })
        .catch(() => {
          alert('Что-то пошло не так')
          this.isLoading = false
        })
    },
    search(val, type) {
      this['isLoading' + type] = true
      this.$axios
        .$get(
          `chinchilla/search?name=${val || ''}&sex=${
            type === 'Mother' ? 'f' : 'm'
          }&perPage=20`
        )
        .then((response) => {
          this[type.toLowerCase() + 'Items'] = response.data.filter(
            (f) => f.id !== this.chinchillaId
          )
          this['isLoading' + type] = false
        })
    },
    savePhotos(event) {
      for (const file of event.target.files) {
        const fr = new FileReader()
        fr.onload = () => {
          this.photos.push({
            file,
            data: fr.result,
            id: new Date().getTime(),
          })
        }
        fr.readAsDataURL(file)
      }
    },
    uploadPhotos(id) {
      const requests = this.photos.map(({ file, id: photoId }) => {
        const formData = new FormData()
        formData.append('photo', file)
        return new Promise((resolve, reject) => {
          this.$axios
            .$post(`/photo/chinchilla/${id}`, formData)
            .then((data) => {
              resolve({
                prevId: photoId,
                data,
              })
            })
            .catch(reject)
        })
      })
      Promise.allSettled(requests).then(async (results) => {
        if (this.avatar) {
          const avatar = results.find(
            (el) =>
              el.status === 'fulfilled' && el.value.prevId === this.avatar.id
          )
          if (avatar) await this.photoToAvatar(avatar.id, id)
        }
        this.$router.push(
          this.chinchillaId ? '/profile' : `/profile/chinchillas/color?id=${id}`
        )
      })
    },
    async deletePhoto(photoId) {
      if (this.chinchillaId)
        await this.$axios.$delete(`/photo/chinchilla/${photoId}`)
      this.photos = this.photos.filter((el) => el.id !== photoId)
      if (this.avatar && this.avatar.id === photoId) this.avatar = null
    },
    async photoToAvatar(photoId, chinchillaId) {
      if (chinchillaId)
        await this.$axios.$put(
          `/chinchilla/update/${this.chinchillaId || chinchillaId}`,
          {
            avatar_id: photoId,
          }
        )
      this.avatar = this.photos.find((el) => el.id === photoId)
    },
  },

  validations: {
    models: {
      name: {
        required,
      },
    },
    birthday: {
      required,
    },
  },
}
</script>

<style lang="scss">
.chinchillaRedact {
  width: 100%;

  &__form {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-column-gap: 24px;
    padding: 40px 0;

    @include mq('tablet', 'phone') {
      grid-template-columns: 1fr 1fr;
    }

    @include mq('phone') {
      grid-template-columns: 1fr;
    }
  }

  &__photos {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 24px;
    grid-row-gap: 16px;

    @include mq('tablet') {
      grid-template-columns: 1fr;
    }
  }

  &__uploadPhoto {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #828282;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease;

    & input {
      display: none;
    }

    &:hover {
      box-shadow: none;
    }
  }

  &__photo {
    height: 200px;
    background: no-repeat center / cover;
  }
}
</style>
