<template>
  <div class="viewPage">
    <template v-if="data">
      <ChinchillaHeader
        :chinchilla="data"
        @updateStatuses="data.statuses = $event"
        @updateConclusion="data.conclusion = $event"
      />
      <div class="baseContainer viewPage__photos">
        <v-card class="mb-8">
          <v-card-text>
            <div class="display-1 text--primary mb-4">
              Дополнительная информация
            </div>
            <p v-if="data.breeder">
              Заводчик:
              {{
                `${data.breeder.first_name} ${data.breeder.last_name} (${data.breeder.login})`
              }}
            </p>
            <p class="mb-0">Дата рождения: {{ birthdayDate }}</p>
          </v-card-text>
        </v-card>
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
        <template #activator>
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
          Редактировать окрас
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
import pad from '../../../../assets/scripts/pad'
import resizeImage from '~/assets/scripts/resizeImage'
import ChinchillaPhoto from '~/components/ChinchillaPhoto/ChinchillaPhoto.vue'
import colorToString from '~/assets/scripts/colorToString'
import CardSection from '~/components/CardSection/CardSection.vue'
import BaseSpinner from '~/components/BaseSpinner/BaseSpinner.vue'
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

  data() {
    return {
      chinchillaId: +this.$route.query.id,
      userId: +this.$cookies.get('USER_ID'),
      data: null,
      isOpenPhotos: false,
      photosHeight: 500,
      activePhoto: 0,
      fab: false,
    }
  },

  async fetch() {
    this.data = await this.$axios.$get(
      `chinchilla/details/${this.chinchillaId}`
    )
  },

  computed: {
    colorString() {
      return this.data ? colorToString(this.data.color) : ''
    },
    birthdayDate() {
      const d = new Date(this.data.birthday)
      return `${pad(d.getDate())}.${pad(d.getMonth())}.${pad(d.getFullYear())}`
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

  &__photos {
    padding-top: 32px;
  }

  &__avatar {
    width: 200px;
  }

  &__photo {
    max-width: 100%;
    max-height: 100%;
  }

  &__uploadPhoto {
    max-height: 400px;
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

    &::before {
      content: '';
      padding-bottom: 100%;
      display: inline-block;
      vertical-align: top;
    }
  }

  & .v-speed-dial__list {
    align-items: flex-end;
  }
}
</style>
