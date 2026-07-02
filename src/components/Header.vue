<template>
  <v-app-bar class="bg-primary pl-4 pr-4">
    <v-app-bar-title>
      <span style="cursor:pointer" role="link" tabindex="0" @click="$router.push('/')" @keydown.enter="$router.push('/')">
        <img src="/favicon.png" height="28" width="28" alt="Open Prices logo" style="vertical-align:bottom" />
        {{ constants.APP_NAME }}
      </span>
    </v-app-bar-title>
    <v-btn v-if="!display.smAndUp" icon="mdi-plus-circle-outline" to="/events/create" aria-label="Ajouter" />
    <v-btn v-else prepend-icon="mdi-plus-circle-outline" to="/events/create" aria-label="Ajouter">
      Ajouter un événement
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import constants from '../constants'

const display = useDisplay()
</script>

<style scoped>
</style>
