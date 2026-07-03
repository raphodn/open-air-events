<template>
  <v-breadcrumbs v-if="breadcrumbs" class="text-h6 px-0 pt-0 pb-4" density="compact" :items="breadcrumbs">
    <template #item="{ item, index }">
      <div class="d-flex align-center ga-2">
        <v-breadcrumbs-item
          class="pa-0"
          :title="getItemTitle(item)"
          :to="getItemTo(item)"
          :disabled="item.disabled"
        />
      </div>
    </template>
  </v-breadcrumbs>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const possibleParams = [':id']

const breadcrumbs = computed(() => {
  return route.meta.breadcrumbs ?? null
})

const getItemTitle = (item) => {
  if (possibleParams.includes(item.title)) {
    return route.params[item.title.substring(1)]
  }

  return item.title
}

const getItemTo = (item) => {
  if (!item.to) {
    return item.to
  }

  if (possibleParams.some(param => item.to.includes(param))) {
    return item.to.replace(':id', route.params.id)
  }

  return item.to
}
</script>
