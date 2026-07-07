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
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEventsStore } from '../stores/events.js'

const route = useRoute()
const eventsStore = useEventsStore()
const eventLabel = ref('')

const breadcrumbs = computed(() => {
  return route.meta.breadcrumbs ?? null
})

// Watch for route changes to get event data
watch(() => route.params.id, (id) => {
  if (!id) {
    eventLabel.value = ''
    return
  }

  // Get event label (or uuid) from store
  const event = eventsStore.getEventById(id)
  if (event) {
    eventLabel.value = event.properties.label
  } else {
    eventLabel.value = id
  }
}, { immediate: true })

const getItemTitle = (item) => {
  if (item.title === ':id' && eventLabel.value) {
    // Truncate to first 13 chars + ellipsis if needed
    return eventLabel.value.length > 13
      ? eventLabel.value.substring(0, 13) + '…'
      : eventLabel.value
  }

  return item.title
}

const getItemTo = (item) => {
  if (!item.to) {
    return item.to
  }

  if (item.to.includes(':id')) {
    return item.to.replace(':id', route.params.id)
  }

  return item.to
}
</script>
