<template>
  <h2 class="text-h6 font-weight-bold">Pourquoi ce projet ?</h2>
  <p>
    CinéPleinAir est un petit projet qui permet de trouver facilement des séances de cinéma en plein air près de chez soi.
  </p>

  <br />

  <h2 class="text-h6 font-weight-bold">Comment ça marche ?</h2>
  <p>
    Le site est collaboratif. Si il manque une séance, <router-link :to="{ name: 'event-create' }">ajoutez-la</router-link> en quelques clics.
  </p>
  <p>
    Chaque séance est stockée dans la base de données <a :href="constants.OEDB_WIKI_URL" target="_blank">OpenEventDatabase</a>.
  </p>
  <p>
    Chaque séance est rattachée à un lieu sur <a :href="constants.OSM_URL" target="_blank">OpenStreetMap</a>.
  </p>

  <br />

  <h2 class="text-h6 font-weight-bold">C'est gratuit ?</h2>
  <p>
    Oui. Et c'est 100% open source.
  </p>

  <br />

  <h2 class="text-h6 font-weight-bold">Liens</h2>
  <ul class="pl-4">
    <li><router-link :to="{ name: 'stats' }">Statistiques</router-link></li>
    <li><a :href="constants.APP_GITHUB_URL" target="_blank">Code source (GitHub)</a></li>
  </ul>

  <br />

  <v-alert color="primary" variant="outlined" density="compact">
    N'hésitez pas à faire des retours, remonter des bugs, ou proposer des améliorations sur GitHub 💛
  </v-alert>
</template>

<script setup>
import constants from '../constants.js'
</script>

<style scoped>
</style>
