<template>
  <div class="viewPage">
    <template v-if="data">
      <img
        v-if="data.avatar"
        :src="
          `https://api.chinchillas-show.com/photos/chinchillas/${data.owner_id}/${data.id}/${data.avatar.name}`
        "
        :alt="data.name"
        class="viewPage__avatar"
      />
      <div>{{ data.name }}</div>
      <div>{{ colorString }}</div>
      <div>
        {{ status(data.statuses[0].name) }}
        <v-btn @click="statusesDialog = true">История</v-btn>
      </div>
      <div class="baseContainer">
        <div class="viewPage__photosList">
          <div
            v-for="photo in data.photos"
            :key="photo.id"
            class="viewPage__photoContainer"
          >
            <img
              :src="
                `https://api.chinchillas-show.com/photos/chinchillas/${data.owner_id}/${data.id}/${photo.name}`
              "
              :alt="data.name"
              class="viewPage__photo"
            />
            <template v-if="userId === data.owner_id">
              <button class="viewPage__delete" @click="deletePhoto(photo.id)">
                X
              </button>
              <button
                class="viewPage__updateAvatar"
                @click="photoToAvatar(photo.id)"
              >
                A
              </button>
            </template>
          </div>
        </div>
        <div class="viewPage__actions">
          <v-file-input
            v-if="userId === data.owner_id"
            type="photos"
            multiple
            accept="image/*"
            label="Загрузить фотографии"
            @change="uploadPhotos"
          />
          <v-btn
            v-if="userId === data.owner_id"
            :to="`/profile/chinchillas/redact?id=${chinchillaId}`"
            nuxt
            >Редактировать параметры</v-btn
          >
          <v-btn
            v-if="userId === data.owner_id"
            :to="`/profile/chinchillas/color?id=${chinchillaId}`"
            nuxt
            >Редактировать цвет</v-btn
          >
        </div>
      </div>
      <PedigreeTree :chinchilla="data" />
      <CardSection
        v-if="data.children.length"
        title="Дети"
        :items="data.children"
      />

      <v-dialog v-model="statusesDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">История статусов</v-card-title>

          <v-card-text style="height: 300px;">
            <v-list-item
              v-for="s in data.statuses"
              :key="s.timestamp"
              two-line
              style="padding: 0;"
            >
              <v-list-item-content>
                <v-list-item-title>{{ status(s.name) }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  dateFormat(s.timestamp)
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-container
              v-if="userId === data.owner_id"
              id="changeStatus"
              style="padding: 0;"
            >
              <v-overflow-btn
                v-model="updatedStatus"
                class="my-2"
                :items="statuses"
                label="Изменить статус"
                target="#changeStatus"
                item-text="label"
                item-value="key"
              />
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              v-if="updatedStatus && userId === data.owner_id"
              color="darken-1"
              text
              @click="saveStatus"
            >
              Сохранить
            </v-btn>

            <v-btn color="darken-1" text @click="statusesDialog = false">
              Закрыть
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <BaseSpinner v-else />
  </div>
</template>

<script>
import colorToString from '~/assets/scripts/colorToString'
import PedigreeTree from '~/components/PedigreeTree/PedigreeTree.vue'
import CardSection from '~/components/CardSection/CardSection.vue'
import BaseSpinner from '~/components/BaseSpinner/BaseSpinner.vue'
import statuses from '~/assets/datas/statuses.json'

export default {
  components: {
    BaseSpinner,
    PedigreeTree,
    CardSection
  },

  layout: 'profileLayout',

  data() {
    return {
      chinchillaId: +this.$route.query.id,
      userId: +localStorage.user_id,
      data: null,
      statusesDialog: false,
      updatedStatus: null
    }
  },

  computed: {
    colorString() {
      return this.data ? colorToString(this.data.color) : ''
    },
    statuses() {
      return statuses
    }
  },

  watch: {
    $route(val) {
      if (this.chinchillaId !== +val.query.id) {
        this.data = null
        this.chinchillaId = +this.$route.query.id
        this.$axios
          .$get(`chinchilla/details/${this.chinchillaId}`)
          .then((data) => (this.data = data))
      }
    }
  },

  created() {
    this.$axios
      .$get(`chinchilla/details/${this.chinchillaId}`)
      .then((data) => (this.data = data))
  },

  methods: {
    deletePhoto(photoId) {
      this.$axios.$delete(`/photo/chinchilla/${photoId}`).then(() => {
        this.data.photos = this.data.photos.filter((el) => el.id !== photoId)
      })
    },
    photoToAvatar(photoId) {
      this.$axios
        .$put(`/chinchilla/update/${this.data.id}`, {
          avatar_id: photoId
        })
        .then(() => {
          this.data.avatar = this.data.photos.find((el) => el.id === photoId)
        })
    },
    uploadPhotos(event) {
      const requests = [...event.target.files].map((file) => {
        const formData = new FormData()
        formData.append('photo', file)
        return this.$axios.$post(`/photo/chinchilla/${this.data.id}`, formData)
      })
      Promise.all(requests).then((data) => {
        this.data.photos = this.data.photos.concat(data)
      })
    },
    status(key) {
      return this.data ? statuses.find((el) => el.key === key).label : ''
    },
    dateFormat(timestamp) {
      return new Date(timestamp).toString()
    },
    saveStatus() {
      this.$axios
        .$post('chinchilla/create/status', {
          name: this.updatedStatus,
          chinchillaId: this.data.id
        })
        .then((data) => {
          this.data.statuses = [data, ...this.data.statuses]
        })
        .catch(() => alert('Что-то пошло не так'))
    }
  }
}
</script>

<style lang="scss">
.viewPage {
  width: 100%;
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &__avatar {
    width: 200px;
  }

  &__actions {
    display: flex;
    align-items: center;
  }

  &__photosList {
    display: flex;
    flex-wrap: wrap;
  }

  &__photoContainer {
    width: 200px;
    height: 200px;
    position: relative;
  }

  &__photo {
    max-width: 100%;
    max-height: 100%;
  }

  &__delete {
    position: absolute;
    top: 0;
    right: 0;
  }

  &__updateAvatar {
    position: absolute;
    top: 0;
    right: 16px;
  }
}
</style>
