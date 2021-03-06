<template>
  <nuxt-link
    class="chinchillaCard"
    :to="`/profile/chinchillas/${chinchilla.id}/view`"
  >
    <div class="chinchillaCard__container">
      <v-img
        :src="
          chinchilla.avatar
            ? `https://api.chinchillas-show.com/photos/chinchillas/${chinchilla.owner_id}/${chinchilla.id}/${chinchilla.avatar.name}`
            : 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
        "
        lazy-src="https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
      >
        <template #placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
        <div
          class="chinchillaCard__bubbleContainer"
          @click.prevent
          @touchend.prevent
        >
          <div class="chinchillaCard__infoBubble">
            <v-icon>info</v-icon>
          </div>
        </div>
        <div class="chinchillaCard__info">
          <p class="chinchillaCard__infoRow">
            Пол: {{ chinchilla.sex === 'f' ? 'самка' : 'самец' }}
          </p>
          <p class="chinchillaCard__infoRow">
            Окрас: {{ colorString || 'стандарт' }}
          </p>
          <p class="chinchillaCard__infoRow">
            Дата рождения: {{ dateBirthday }}
          </p>
          <p class="chinchillaCard__infoRow">Возраст: {{ dateDifference }}</p>
        </div>
      </v-img>
    </div>
    <div class="chinchillaCard__titleContainer">
      <h4 class="chinchillaCard__title">
        {{ chinchilla.name }} <span v-if="!chinchilla.color">(без окраса)</span>
      </h4>
    </div>
  </nuxt-link>
</template>

<script>
import colorToString from '~/assets/scripts/colorToString'
import dateFormat from '~/assets/scripts/dateFormat'
import dateDifference from '~/assets/scripts/dateDifference'

export default {
  name: 'ChinchillaCard',

  props: {
    chinchilla: {
      type: Object,
      required: true,
    },
  },

  computed: {
    colorString() {
      return colorToString(this.chinchilla.color)
    },
    dateBirthday() {
      return dateFormat(this.chinchilla.birthday, 'yyyy.MM.dd')
    },
    dateDifference() {
      return dateDifference(this.chinchilla.birthday)
    },
  },
}
</script>

<style lang="scss">
.chinchillaCard {
  $self: &;

  padding-top: 100%;
  background-color: #ccc;
  position: relative;
  display: flex;
  align-items: flex-end;
  text-decoration: none;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);

  &__container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    overflow: hidden;
  }

  &__titleContainer {
    position: absolute;
    background-color: #828282;
    padding: 0 16px;
    height: 34px;
    width: 100%;
    left: 0;
    bottom: 0;
  }

  &__info {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background: rgba(224, 224, 224, 0.86);
    transform: translateY(100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: transform 0.3s ease;
    padding: 0 16px 34px;
  }

  &:hover {
    #{$self}__info {
      transform: translateY(0);
    }

    #{$self}__infoBubble {
      transform: translateY(-50px);
    }
  }

  &__infoRow {
    font-size: 14px;
    color: #797979;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__title {
    text-align: center;
    color: #fff;
    border-top: 1px solid #fff;
    line-height: 33px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    & span {
      color: red;
    }
  }

  & .v-responsive__content {
    width: 100% !important;
  }

  &__bubbleContainer {
    position: absolute;
    top: 0;
    right: 0;
    padding: 16px;
    width: 56px;
    height: 56px;
  }

  &__infoBubble {
    background: #d79b00;
    transition: transform 0.3s ease;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    display: none;

    @include mq('tablet') {
      display: flex;
    }
  }
}
</style>
