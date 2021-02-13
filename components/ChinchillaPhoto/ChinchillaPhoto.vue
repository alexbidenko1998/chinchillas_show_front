<template>
  <div
    class="chinchillaPhoto"
    :class="{ chinchillaPhoto_avatar: isAvatar }"
    :style="{
      backgroundImage: `url(${
        chinchilla
          ? `https://api.chinchillas-show.com/photos/chinchillas/${chinchilla.owner_id}/${chinchilla.id}/${photo.name}`
          : photo.data
      })`,
    }"
    @click="$emit('click', $event)"
  >
    <template v-if="!chinchilla || userId === chinchilla.owner_id">
      <v-btn
        type="button"
        color="primary"
        fab
        x-small
        class="chinchillaPhoto__delete"
        @click.stop="deletePhoto(photo.id)"
      >
        X
      </v-btn>
      <v-btn
        type="button"
        color="primary"
        fab
        x-small
        class="chinchillaPhoto__updateAvatar"
        @click.stop="photoToAvatar(photo.id)"
      >
        A
      </v-btn>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ChinchillaPhoto',

  props: {
    userId: {
      type: Number,
      required: true,
    },
    chinchilla: {
      type: Object,
      default: null,
    },
    photo: {
      type: [String, Object],
      required: true,
    },
    isAvatar: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    deletePhoto(photoId) {
      this.$emit('delete', photoId)
    },
    photoToAvatar(photoId) {
      this.$emit('toAvatar', photoId)
    },
  },
}
</script>

<style lang="scss">
.chinchillaPhoto {
  position: relative;
  background: no-repeat center / cover;
  cursor: pointer;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;
  max-height: 400px;

  &:hover {
    box-shadow: none;
  }

  &__delete {
    position: absolute;
    top: 4px;
    right: 4px;
  }

  &__updateAvatar {
    position: absolute;
    top: 4px;
    right: 40px;
  }

  &_avatar {
    border: 1px solid #d79b00;
  }

  &::before {
    content: '';
    padding-bottom: 100%;
    display: inline-block;
    vertical-align: top;
  }
}
</style>
