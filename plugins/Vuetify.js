import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#d79b00'
        // secondary: colors.red.lighten4, // #FFCDD2
        // accent: colors.indigo.base // #3F51B5
      }
    }
  }
})
