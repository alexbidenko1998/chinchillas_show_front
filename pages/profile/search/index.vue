<template>
  <div class="searchPage baseContainer">
    <label class="searchPage__searchContainer">
      <v-icon color="white">search</v-icon>
      <input
        v-model="search"
        class="searchPage__search"
        placeholder="Поиск шиншиллы"
      />

      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <span class="searchPage__settings">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="white">settings</v-icon>
            </v-btn>
            <v-fab-transition v-bind="attrs" v-on="on">
              <v-btn color="primary" dark fixed bottom right fab>
                <v-icon>settings</v-icon>
              </v-btn>
            </v-fab-transition>
          </span>
        </template>

        <v-card>
          <v-card-title class="headline lighten-2">
            Параметры поиска
          </v-card-title>

          <v-card-text>
            <v-select
              :items="sexItems"
              label="Пол"
              item-text="label"
              v-model="models.sex"
              item-value="value"
            />
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">
              Закрыть
            </v-btn>
            <v-btn color="primary" text @click="apply">
              Применить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </label>
    <div class="searchPage__list">
      <ChinchillaCard
        v-for="chinchilla in chinchillas"
        :key="chinchilla.id"
        :chinchilla="chinchilla"
      />
    </div>
    <div v-if="isLoading" class="searchPage__loaderContainer">
      <BaseSpinner />
    </div>
  </div>
</template>

<script>
import ChinchillaCard from '~/components/ChinchillaCard/ChinchillaCard.vue'
import BaseSpinner from '~/components/BaseSpinner/BaseSpinner.vue'

export default {
  name: 'SearchPage',

  components: {
    BaseSpinner,
    ChinchillaCard
  },

  layout: 'profileLayout',

  data() {
    return {
      chinchillas: [],
      isLoading: false,
      isFinish: false,
      search: '',
      timer: 0,
      dialog: false,
      sexItems: [
        {
          label: 'Любой',
          value: ''
        },
        {
          label: 'Самка',
          value: 'f'
        },
        {
          label: 'Самец',
          value: 'm'
        }
      ],
      models: {
        sex: ''
      },
      params: {}
    }
  },

  watch: {
    search() {
      this.searchData()
    }
  },

  created() {
    this.searchData(true)
  },

  methods: {
    searchData(immediate) {
      clearTimeout(this.timer)
      this.timer = setTimeout(
        () => {
          this.isLoading = true
          let url = 'chinchilla/search?'
          if (this.search) url = `${url}name=${this.search}&`
          if (this.params.sex) url = `${url}sex=${this.params.sex}&`
          this.$axios.$get(url).then((response) => {
            this.isLoading = false
            this.chinchillas = response.data
          })
        },
        immediate ? 0 : 1000
      )
    },
    apply() {
      this.dialog = false
      this.params = this.models
      this.searchData(true)
    }
  }
}
</script>

<style lang="scss">
.searchPage {
  padding-top: 40px;
  padding-bottom: 40px;

  &__list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-column-gap: 16px;
    grid-row-gap: 24px;
    flex: 1;

    @include mq('desktop-small', 'tablet') {
      grid-template-columns: repeat(4, 1fr);
    }

    @include mq('tablet', 'phone') {
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 24px;
      grid-row-gap: 32px;
    }

    @include mq('phone') {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  &__title {
    @include buttonReset;
    font-size: 24px;
  }

  &__loaderContainer {
    height: 160px;
    padding: 58px 58px 18px;
    display: flex;
    justify-content: center;

    .baseSpinner {
      height: 44px;
      width: 44px;
    }
  }

  &__searchContainer {
    background-color: #c5c5c5;
    border-radius: 22px;
    height: 44px;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    padding: 4px 16px;
  }

  &__search {
    margin-left: 16px;
    margin-right: 16px;
    color: white;
    flex: 1;
  }

  &__settings {
    & > *:first-child {
      @include mq('tablet') {
        display: none;
      }
    }
    & > *:last-child {
      display: none;

      @include mq('tablet') {
        display: block;
      }
    }
  }
}
</style>
