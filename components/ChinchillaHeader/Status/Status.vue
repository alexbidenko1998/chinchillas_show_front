<template>
  <div class="statusLabel">
    {{
      status(
        (
          data.statuses.find((el) =>
            statuses.find((s) => el.name === s.key)
          ) || { name: '' }
        ).name
      )
    }}
    <v-tooltip
      v-if="['disagree', 'overvalue'].includes(data.conclusion)"
      bottom
    >
      <template #activator="{ on }">
        <v-btn
          dark
          icon
          color="warning"
          style="margin-left: 12px"
          v-on="on"
          @click="isOpenComments = !isOpenComments"
        >
          <v-icon>info</v-icon>
        </v-btn>
      </template>
      <span>Не соответствует окрас<br />(нажмите для подробностей)</span>
    </v-tooltip>

    <v-menu bottom left>
      <template #activator="{ on }">
        <v-btn
          dark
          icon
          color="black"
          style="margin-right: -24px; margin-left: 12px"
          v-on="on"
        >
          <v-icon>more_vert</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="statusesDialog = true">
          <v-list-item-title>История</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="userId === data.owner_id && data.conclusion === 'disagree'"
          @click="forOvervalue"
        >
          <v-list-item-title>На переоценку</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog v-model="statusesDialog" max-width="400">
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

    <v-dialog v-model="isOpenComments" max-width="400">
      <v-card>
        <v-toolbar dark color="primary">
          Комментарии
          <v-spacer />
          <v-btn icon dark @click="isOpenComments = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text
          v-for="(comment, index) in data.color_comments"
          :key="comment.id"
          :style="{
            paddingBottom: index !== data.color_comments.length - 1 && 0,
          }"
        >
          <span>{{ comment.content }}</span>
          <v-divider v-if="index !== data.color_comments.length - 1" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import statuses from 'assets/datas/statuses.json'
import pad from 'assets/scripts/pad'

export default {
  name: 'Status',

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      statusesDialog: false,
      updatedStatus: null,
      userId: +this.$cookies.get('USER_ID'),
      isOpenComments: false,
    }
  },

  computed: {
    statuses() {
      return statuses
    },
  },

  methods: {
    dateFormat(timestamp) {
      const d = new Date(timestamp)
      return `${pad(d.getDate())}.${pad(d.getMonth())}.${pad(
        d.getFullYear()
      )} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    },
    status(key) {
      return this.data ? statuses.find((el) => el.key === key)?.label ?? '' : ''
    },
    saveStatus() {
      this.$axios
        .$post('chinchilla/create/status', {
          name: this.updatedStatus,
          chinchillaId: this.data.id,
        })
        .then((data) => {
          this.$emit('updateStatuses', [data, ...this.data.statuses])
        })
        .catch(() => alert('Что-то пошло не так'))
    },
    forOvervalue() {
      this.$axios
        .$post(`chinchilla/color/for-overvalue/${this.data.id}`)
        .then(() => {
          this.$emit('updateConclusion', 'overvalue')
        })
    },
  },
}
</script>

<style lang="scss">
.statusLabel {
  display: flex;
  align-items: center;
}
</style>
