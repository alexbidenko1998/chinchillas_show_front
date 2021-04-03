<template>
  <ChinchillaRedact :chinchilla-id="+$route.params.id" />
</template>

<script>
import ChinchillaRedact from '~/components/ChinchillaRedact/ChinchillaRedact'

export default {
  name: 'RedactPage',

  components: { ChinchillaRedact },

  layout: 'profileLayout',

  middleware: 'auth',
}
</script>
