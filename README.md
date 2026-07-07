# CinéPleinAir

Un petit projet pour connaître les séances de cinéma en plein air autour de chez soi.
Collaboratif.
Basé sur [OpenStreetMap](https://www.openstreetmap.org) & [OpenEventDatabase](https://wiki.openstreetmap.org/wiki/OpenEventDatabase).

## Contribuer

### Installer

```
yarn install
```

### Lancer l'application

```
yarn dev
```

L'application sera disponible sur [http://localhost:5173](http://localhost:5173).

### Autres commandes

```
# Lancer l'application en mode production
yarn build

# Lancer l'application en mode production avec un serveur local
yarn preview
```

## Stack technique

* [Vue.js](https://vuejs.org) 3 + [Vuetify](https://vuetifyjs.com) 3
* [OpenEventDatabase](https://wiki.openstreetmap.org/wiki/OpenEventDatabase) pour stocker et synchroniser les séances
