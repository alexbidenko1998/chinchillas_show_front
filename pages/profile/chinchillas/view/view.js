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
      return this.data
        ? (statuses.find((el) => el.key === key) || { label: '' }).label || ''
        : ''
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
