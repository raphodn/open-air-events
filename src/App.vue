<template>
  <v-app>
    <Header />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import Header from './components/Header.vue'
</script>

<style scoped>
</style>
