export default {
  render(ce) {
    const tag =
      (this.$attrs.href && 'a') || (this.to && 'nuxt-link') || 'button'
    return ce(
      tag,
      {
        class: {
          baseButton: true,
          'baseButton--dark': this.dark,
          'baseButton--active': this.active,
        },
        ...this.$attrs,
        props: {
          to: this.to,
        },
      },
      [this.$slots.default]
    )
  },
  props: {
    to: {
      type: [Object, String],
    },
    dark: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
}
