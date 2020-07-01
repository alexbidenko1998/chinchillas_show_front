export default {
  name: 'BaseInput',

  inheritAttrs: false,

  props: {
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String
    },
    placeholder: {
      type: String
    },
    v: {
      type: Object
    },
    multiline: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    }
  },

  data() {
    return {
      localValue: '',
      isBlur: false
    }
  },

  computed: {
    isFocus() {
      return this.isBlur || this.computedValue
    },
    computedValue: {
      set(val) {
        if (this.v) this.v.$touch()
        this.localValue = val
        this.$emit('input', val)
      },
      get() {
        return this.value || this.localValue
      }
    }
  }
}
