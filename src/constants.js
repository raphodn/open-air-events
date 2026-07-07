const OEDB_WHAT_DEFAULT = 'culture.cinema.outdoor'

export default {
  APP_NAME: 'CinéPleinAir',
  APP_DESCRIPTION: 'Trouvez et partagez les séances de cinéma en plein air près de chez vous.',
  APP_URL: 'https://cinepleinair.org',
  APP_STORE_PREFIX: 'cinepleinair',
  APP_GITHUB_URL: 'https://github.com/raphodn/open-air-events',
  OEDB_WIKI_URL: 'https://wiki.openstreetmap.org/wiki/OpenEventDatabase',
  OEDB_API_URL: 'https://api.openeventdatabase.org',
  OEDB_WHAT_DEFAULT,
  OEDB_WHAT_LIST: [
    {key: OEDB_WHAT_DEFAULT, label: 'Cinéma en plein air'},
  ],
  OSM_URL: 'https://www.openstreetmap.org',
  OSM_PHOTON_SEARCH_API_URL: 'https://photon.komoot.io/api/',
}
