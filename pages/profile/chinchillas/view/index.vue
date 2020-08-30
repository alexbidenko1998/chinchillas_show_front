<template>
  <div class="viewPage">
    <template v-if="data">
      <ChinchillaHeader :chinchilla="data" />
      <div>
        <span v-if="['disagree', 'overvalue'].includes(data.conclusion)"
          >(Не соответствует)</span
        >
      </div>
      <div>
        {{
          status(
            (
              data.statuses.find((el) =>
                statuses.find((s) => el.name === s.key)
              ) || { name: '' }
            ).name
          )
        }}
        <v-btn @click="statusesDialog = true">История</v-btn>
        <v-btn
          v-if="userId === data.owner_id && data.conclusion === 'disagree'"
          @click="forOvervalue"
          >На переоценку</v-btn
        >
        <div v-for="comment in data.color_comments" :key="comment.id">
          <v-divider />
          <p>{{ comment.content }}</p>
        </div>
      </div>
      <div class="baseContainer">
        <div class="baseGrid">
          <ChinchillaPhoto
            v-for="(photo, index) in data.photos"
            :key="photo.id"
            :user-id="data.owner_id"
            :chinchilla="data"
            :photo="photo"
            @toAvatar="photoToAvatar"
            @delete="deletePhoto"
            @click="
              isOpenPhotos = true
              activePhoto = index
            "
          />
          <label v-if="userId === data.owner_id" class="viewPage__uploadPhoto">
            <v-icon size="40px" color="white">mdi-plus</v-icon>
            <input
              type="file"
              multiple
              accept="image/*"
              @change="uploadPhotos"
            />
          </label>
        </div>
      </div>
      <div style="overflow-x: auto">
        <client-only>
          <PedigreeTree :chinchilla="data" />
        </client-only>
      </div>
      <CardSection
        v-if="data.children.length"
        title="Дети"
        :items="data.children"
      />
      <CardSection
        v-if="data.relatives && data.relatives.length"
        title="Браться и сестры"
        :items="data.relatives"
      />

      <v-speed-dial
        v-if="userId === data.owner_id"
        v-model="fab"
        bottom
        right
        fixed
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="primary" dark fab>
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <v-btn
          dark
          small
          color="primary"
          rounded
          :to="`/profile/chinchillas/color?id=${chinchillaId}`"
          nuxt
        >
          Редактировать цвет
        </v-btn>
        <v-btn
          dark
          small
          color="primary"
          rounded
          :to="`/profile/chinchillas/redact?id=${chinchillaId}`"
          nuxt
        >
          Редактировать параметры
        </v-btn>
      </v-speed-dial>

      <v-dialog v-model="statusesDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">История статусов</v-card-title>

          <v-card-text style="height: 300px">
            <template v-for="s in data.statuses">
              <v-list-item
                v-if="statuses.find((el) => el.key === s.name)"
                :key="s.timestamp"
                two-line
                style="padding: 0"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ status(s.name) }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    dateFormat(s.timestamp)
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-container
              v-if="userId === data.owner_id"
              id="changeStatus"
              style="padding: 0"
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

      <v-dialog
        v-model="isOpenPhotos"
        fullscreen
        hide-overlay
        :scrollable="false"
      >
        <v-card ref="photosDialog">
          <v-toolbar ref="photosHeader" dark color="primary">
            <v-spacer />
            <v-btn icon dark @click="isOpenPhotos = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-carousel v-model="activePhoto" continuous :height="photosHeight">
            <v-carousel-item
              v-for="photo in data.photos"
              :key="photo.name"
              :src="`https://api.chinchillas-show.com/photos/chinchillas/${data.owner_id}/${data.id}/${photo.name}`"
            />
          </v-carousel>
        </v-card>
      </v-dialog>
    </template>
    <BaseSpinner v-else />
  </div>
</template>

<script>
import resizeImage from '~/assets/scripts/resizeImage'
import ChinchillaPhoto from '~/components/ChinchillaPhoto/ChinchillaPhoto.vue'
import colorToString from '~/assets/scripts/colorToString'
import CardSection from '~/components/CardSection/CardSection.vue'
import BaseSpinner from '~/components/BaseSpinner/BaseSpinner.vue'
import statuses from '~/assets/datas/statuses.json'
import ChinchillaHeader from '~/components/ChinchillaHeader/ChinchillaHeader'

export default {
  components: {
    ChinchillaHeader,
    ChinchillaPhoto,
    BaseSpinner,
    PedigreeTree: () => import('~/components/PedigreeTree/PedigreeTree.vue'),
    CardSection,
  },

  layout: 'profileLayout',

  async fetch() {
    this.data = await this.$axios.$get(
      `chinchilla/details/${this.chinchillaId}`
    )
  },

  data() {
    return {
      chinchillaId: +this.$route.query.id,
      userId: +this.$cookies.get('USER_ID'),
      data: null,
      statusesDialog: false,
      updatedStatus: null,
      isOpenPhotos: false,
      photosHeight: 500,
      activePhoto: 0,
      fab: false,
    }
  },

  computed: {
    colorString() {
      return this.data ? colorToString(this.data.color) : ''
    },
    statuses() {
      return statuses
    },
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
    },
    isOpenPhotos() {
      setTimeout(this.updatePhotosHeight, 100)
    },
  },

  created() {
    if (typeof window !== 'undefined')
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.addEventListener('resize', this.updatePhotosHeight)
    this.updatePhotosHeight()
  },

  destroyed() {
    if (typeof window !== 'undefined')
      window.removeEventListener('resize', this.updatePhotosHeight)
  },

  methods: {
    uploadPhotos(event) {
      const requests = [...event.target.files].map(async (file) => {
        const resizedFile = await resizeImage(file)
        const formData = new FormData()
        formData.append('photo', resizedFile)
        return this.$axios.$post(`/photo/chinchilla/${this.data.id}`, formData)
      })
      Promise.allSettled(requests).then((data) => {
        this.data.photos = this.data.photos.concat(
          data.filter((el) => el.value).map((el) => el.value)
        )
      })
    },
    status(key) {
      return this.data ? statuses.find((el) => el.key === key)?.label ?? '' : ''
    },
    dateFormat(timestamp) {
      return new Date(timestamp).toString()
    },
    saveStatus() {
      this.$axios
        .$post('chinchilla/create/status', {
          name: this.updatedStatus,
          chinchillaId: this.data.id,
        })
        .then((data) => {
          this.data.statuses = [data, ...this.data.statuses]
        })
        .catch(() => alert('Что-то пошло не так'))
    },
    deletePhoto(photoId) {
      this.$axios.$delete(`/photo/chinchilla/${photoId}`).then(() => {
        this.data.photos = this.data.photos.filter((el) => el.id !== photoId)
      })
    },
    photoToAvatar(photoId) {
      this.$axios
        .$put(`/chinchilla/update/${this.data.id}`, {
          avatar_id: photoId,
        })
        .then(() => {
          this.data.avatar = this.data.photos.find((el) => el.id === photoId)
        })
    },
    updatePhotosHeight() {
      if (this.$refs.photosDialog && this.$refs.photosHeader)
        this.photosHeight =
          this.$refs.photosDialog.$el.clientHeight -
          this.$refs.photosHeader.$el.clientHeight
    },
    forOvervalue() {
      this.$axios
        .$post(`chinchilla/color/for-overvalue/${this.data.id}`)
        .then(() => {
          this.data.conclusion = 'overvalue'
        })
    },
  },
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

  &__photo {
    max-width: 100%;
    max-height: 100%;
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

  & .v-speed-dial__list {
    align-items: flex-end;
  }
}
</style>
