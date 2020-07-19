<template>
  <div class="viewPage baseContainer">
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
      <input
        v-if="userId === data.owner_id"
        type="file"
        multiple
        accept="image/*"
        placeholder="Фотографии"
        @change="uploadPhotos"
      />
      <nuxt-link
        v-if="userId === data.owner_id"
        :to="`/profile/chinchillas/redact?id=${chinchillaId}`"
        >Редактировать параметры</nuxt-link
      >
      <nuxt-link
        v-if="userId === data.owner_id"
        :to="`/profile/chinchillas/color?id=${chinchillaId}`"
        >Редактировать цвет</nuxt-link
      >
      <PedigreeTree />
    </template>
    <BaseSpinner v-else />
  </div>
</template>

<script>
import colorToString from '~/assets/scripts/colorToString'
import PedigreeTree from '~/components/PedigreeTree/PedigreeTree.vue'
import BaseSpinner from '~/components/BaseSpinner/BaseSpinner.vue'

export default {
  components: {
    BaseSpinner,
    PedigreeTree
  },

  layout: 'profileLayout',

  data() {
    return {
      chinchillaId: +this.$route.query.id,
      userId: +localStorage.user_id,
      data: null
    }
  },

  computed: {
    colorString() {
      return this.data ? colorToString(this.data.color) : ''
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
