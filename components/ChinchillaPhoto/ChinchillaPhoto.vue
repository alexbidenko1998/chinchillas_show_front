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
      <button
        type="button"
        class="chinchillaPhoto__delete"
        @click.stop="deletePhoto(photo.id)"
      >
        X
      </button>
      <button
        type="button"
        class="chinchillaPhoto__updateAvatar"
        @click.stop="photoToAvatar(photo.id)"
      >
        A
      </button>
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
  height: 200px;
  background: no-repeat center / cover;
  cursor: pointer;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: none;
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

  &_avatar {
    border: 1px solid #d79b00;
  }
}
</style>
