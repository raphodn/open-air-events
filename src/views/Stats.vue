<template>
  <v-row>
    <v-col cols="12" md="6">
      <h2 class="text-subtitle-1 font-weight-bold mb-2">Films les plus projetés</h2>
      <v-table v-if="topFilms.length" density="compact">
        <thead>
          <tr>
            <th class="text-left" style="width:30px">#</th>
            <th class="text-left">Film</th>
            <th class="text-right" style="width:80px">Séances</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in topFilms" :key="index">
            <td class="text-left">{{ index + 1 }}</td>
            <td>{{ item.label }}</td>
            <td class="text-right">
              <v-chip size="small" color="primary" variant="flat" label>{{ item.count }}</v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
      <p v-else class="text-grey">Aucune donnée disponible</p>
    </v-col>

    <v-col cols="12" md="6">
      <h2 class="text-subtitle-1 font-weight-bold mb-2">Départements les plus représentés</h2>
      <v-table v-if="topCounties.length" density="compact">
        <thead>
          <tr>
            <th class="text-left" style="width:30px">#</th>
            <th class="text-left">Département</th>
            <th class="text-right" style="width:80px">Séances</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in topCounties" :key="index">
            <td class="text-left">{{ index + 1 }}</td>
            <td>{{ item.label || 'Inconnu' }}</td>
            <td class="text-right">
              <v-chip size="small" color="primary" variant="flat" label>{{ item.count }}</v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
      <p v-else class="text-grey">Aucune donnée disponible</p>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useEventsStore } from '../stores/events.js'

const eventsStore = useEventsStore()
const { events } = storeToRefs(eventsStore)

onMounted(() => {
  if (!events.value.length) {
    eventsStore.fetchEvents()
      .catch((error) => {
        console.error('Error loading events for stats:', error)
      })
  }
})

const getTop = (items, key, limit = 5) => {
  const counts = {}

  items.forEach((item) => {
    const value = item?.properties?.[key]
    if (!value) return
    counts[value] = (counts[value] || 0) + 1
  })

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

const topFilms = computed(() => {
  return getTop(events.value, 'label')
})

const topCounties = computed(() => {
  return getTop(events.value, 'osm_addr_county')
})
</script>

<style scoped>
</style>
