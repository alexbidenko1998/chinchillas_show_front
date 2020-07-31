<template>
  <ChinchillaRedact :chinchilla-id="+$route.query.id" />
</template>

<script>
import ChinchillaRedact from '~/components/ChinchillaRedact/ChinchillaRedact'

export default {
  name: 'RedactPage',

  components: { ChinchillaRedact },

  layout: 'profileLayout',
}
</script>
