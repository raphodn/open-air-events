import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  }
  ,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#045577',
          secondary: '#F6C24A',
          'on-primary': '#F2EEE6',
          'on-secondary': '#0A3A5A'
        }
      }
    }
  }
})
