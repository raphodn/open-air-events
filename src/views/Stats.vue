<template>
  <!-- event_count -->
  <v-row>
    <v-col cols="12">
      <h2 class="text-subtitle-1 font-weight-bold mb-2">{{ stats.event_count }} séances recensées</h2>
    </v-col>
  </v-row>

  <!-- event_label_top_5 -->
  <v-row>
    <v-col cols="12" md="6">
      <h2 class="text-subtitle-1 font-weight-bold mb-2">Films les plus projetés</h2>
      <v-table v-if="stats.event_label_top_5?.length" density="compact">
        <thead>
          <tr>
            <th class="text-left" style="width:30px">#</th>
            <th class="text-left">Film</th>
            <th class="text-right" style="width:80px">Séances</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in stats.event_label_top_5" :key="index">
            <td class="text-left">{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td class="text-right">
              <v-chip size="small" color="primary" variant="flat" label>{{ item.count }}</v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
      <p v-else class="text-grey">Aucune donnée disponible</p>
    </v-col>
  </v-row>

  <!-- event_osm_addr_state_top_5 & event_osm_addr_county_top_5 -->
  <v-row>
    <v-col cols="12" md="6">
      <h2 class="text-subtitle-1 font-weight-bold mb-2">Régions les plus représentées</h2>
      <v-table v-if="stats.event_osm_addr_state_top_5?.length" density="compact">
        <thead>
          <tr>
            <th class="text-left" style="width:30px">#</th>
            <th class="text-left">Région</th>
            <th class="text-right" style="width:80px">Séances</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in stats.event_osm_addr_state_top_5" :key="index">
            <td class="text-left">{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
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
      <v-table v-if="stats.event_osm_addr_county_top_5?.length" density="compact">
        <thead>
          <tr>
            <th class="text-left" style="width:30px">#</th>
            <th class="text-left">Département</th>
            <th class="text-right" style="width:80px">Séances</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in stats.event_osm_addr_county_top_5" :key="index">
            <td class="text-left">{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td class="text-right">
              <v-chip size="small" color="primary" variant="flat" label>{{ item.count }}</v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
      <p v-else class="text-grey">Aucune donnée disponible</p>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-alert color="primary" variant="outlined" density="compact">
        Dernière mise à jour le {{ formattedDate }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import statsJSON from '@/data/stats.json'

const stats = statsJSON

const formattedDate = computed(() => {
  if (!stats.last_updated) return ''
  return new Date(stats.last_updated).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
})
</script>

<style scoped>
</style>
