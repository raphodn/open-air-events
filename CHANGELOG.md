# Changelog

## [0.2.0](https://github.com/raphodn/open-air-events/compare/v0.1.0...v0.2.0) (2026-07-04)


### Features

* ajout de breadcrumbs pour pouvoir facilement revenir en arrière. remplace les titres existants ([#31](https://github.com/raphodn/open-air-events/issues/31)) ([4441f92](https://github.com/raphodn/open-air-events/commit/4441f9296312464505bd1619d9687d307649c8c3))
* **API:** caching des résultats pour éviter d'appeler l'API à chaque changement de page ([#24](https://github.com/raphodn/open-air-events/issues/24)) ([7056766](https://github.com/raphodn/open-air-events/commit/7056766e0d5ebe2ee61787f733f6f1f58804959a))
* **API:** utiliser un store. pour simplifer la récupération des événements & counts à travers les pages ([#26](https://github.com/raphodn/open-air-events/issues/26)) ([d89d5f1](https://github.com/raphodn/open-air-events/commit/d89d5f18d2d3fe859ba74816c9f922d8e3682a66))
* **Footer:** footer basique avec des stats et le lien vers Github ([#28](https://github.com/raphodn/open-air-events/issues/28)) ([0aeadbf](https://github.com/raphodn/open-air-events/commit/0aeadbf1c877969c862511213b416705097a919a))
* **Formulaire:** pouvoir modifier un événement (lien caché pour l'instant) ([#42](https://github.com/raphodn/open-air-events/issues/42)) ([dccdb01](https://github.com/raphodn/open-air-events/commit/dccdb019b35fe9aa6bcb293dcd1ec48d56f57d09))
* **Header:** ajout de l'icon à gauche. et d'un bouton direct vers le formulaire à droite ([#23](https://github.com/raphodn/open-air-events/issues/23)) ([e4f50a7](https://github.com/raphodn/open-air-events/commit/e4f50a7a2af1efc121d352e001dd584de3a32418))
* nouvelle page détail d'un événement avec une carte à droite ([#30](https://github.com/raphodn/open-air-events/issues/30)) ([872fa39](https://github.com/raphodn/open-air-events/commit/872fa39e2ca67f1306fa6d45e778fa22d562cab7))
* pouvoir rajouter 1 ou plusieurs tags à un événement (et ensuite filtrer dessus) ([#39](https://github.com/raphodn/open-air-events/issues/39)) ([20b2322](https://github.com/raphodn/open-air-events/commit/20b23226262ad0a93ffa6c88b8db18fda698f703))
* **Recherche:** ajouter un premier filtre pour cacher (par défaut) les événéments passés. Petit badge pour indiquer si passé ou aujourd'hui ([#32](https://github.com/raphodn/open-air-events/issues/32)) ([31424ed](https://github.com/raphodn/open-air-events/commit/31424ed98fb94aec2c0ba604eb0ecc82decd2eed))
* **Recherche:** nouveau filtre par date (aujourdhui, semaine, weekend, mois) ([#35](https://github.com/raphodn/open-air-events/issues/35)) ([c397b6c](https://github.com/raphodn/open-air-events/commit/c397b6cf9debe3163465346af3c90823c50e4e4e))
* **Recherche:** nouveau filtre par département ([#34](https://github.com/raphodn/open-air-events/issues/34)) ([3756a0b](https://github.com/raphodn/open-air-events/commit/3756a0bd35c7ad7d5fbc74f0602986fb4c43f3b8))


### Bug Fixes

* **API:** stocker aussi le osm_addr_county dans les properties. Mais plus besoin de lat & lon (doublon) ([d9b255e](https://github.com/raphodn/open-air-events/commit/d9b255e80824fad0dbbb83623b4e998d516c35fd))
* **Formulaire:** répare l'envoi des coordonnées lat & lon ([#37](https://github.com/raphodn/open-air-events/issues/37)) ([2254f81](https://github.com/raphodn/open-air-events/commit/2254f8173454819ae18653955735fd24e0282f30))
* **Recherche:** améliorer l'appel API pour renvoyer tous les événements. restreindre à 2026 pour l'instant. Max 1000 résultats ([#21](https://github.com/raphodn/open-air-events/issues/21)) ([6812706](https://github.com/raphodn/open-air-events/commit/6812706d4beddcd60d545cc1026d7c84bbba2d2a))


### Technical

* ajout d'un copilot-instructions.md ([#29](https://github.com/raphodn/open-air-events/issues/29)) ([3170a29](https://github.com/raphodn/open-air-events/commit/3170a29f4cb6d813a3da2f449c606339f41e3034))
* **Event Card:** quelques améliorations (indiquer le département. ne plus indiquer le pays. readonly sur la page détail) ([#40](https://github.com/raphodn/open-air-events/issues/40)) ([d9f019e](https://github.com/raphodn/open-air-events/commit/d9f019e0def5be40920e344751fbebae5d0d9bb8))
* **Formulaire:** ne plus envoyer lat & lon dans les properties de l'objet (seulement la geometry) ([#41](https://github.com/raphodn/open-air-events/issues/41)) ([50dff7e](https://github.com/raphodn/open-air-events/commit/50dff7ebc29b019c5f1a12c9ddd1b8da1fc7382b))
* **Formulaire:** quelques amélioratins (placeholder, warning si URL existante) ([#38](https://github.com/raphodn/open-air-events/issues/38)) ([3c74428](https://github.com/raphodn/open-air-events/commit/3c744285a204c4aa15954495481398728ff550f1))

## [0.1.0](https://github.com/raphodn/open-air-events/compare/v0.0.1...v0.1.0) (2026-07-02)


### Features

* first commit ([a825b38](https://github.com/raphodn/open-air-events/commit/a825b38216ca7dc6681d1989008a9fd459b5ff77))
* **Formulaire:** Recherche du lieu: ajout d'une carte à coté des résultats ([#19](https://github.com/raphodn/open-air-events/issues/19)) ([7c6a6d5](https://github.com/raphodn/open-air-events/commit/7c6a6d5945c52596f8fda2a3873a78ffb8ac097e))
* **SEO:** ajout d'un icon & metatags ([#17](https://github.com/raphodn/open-air-events/issues/17)) ([fdc665b](https://github.com/raphodn/open-air-events/commit/fdc665ba26cc47e9d04e47e4db790ee822c1954e))
* v0 rapide avec les pages accueil, liste & créer ([#1](https://github.com/raphodn/open-air-events/issues/1)) ([171271b](https://github.com/raphodn/open-air-events/commit/171271b73eef34c1efa973509caeae0124f604a6))


### Technical

* ajout d'une Github Action pour auto assign les PR ([#18](https://github.com/raphodn/open-air-events/issues/18)) ([1497ea6](https://github.com/raphodn/open-air-events/commit/1497ea613961487f31a2c07726e21f6c0170b012))
* **Formulaire:** ne plus demander la date de fin. Quelques améliorations ([#6](https://github.com/raphodn/open-air-events/issues/6)) ([cdebc78](https://github.com/raphodn/open-air-events/commit/cdebc7800c1ebf8842962f5073c238062671b248))
* mettre dateUtils dans le dossier utils ([#20](https://github.com/raphodn/open-air-events/issues/20)) ([b4de632](https://github.com/raphodn/open-air-events/commit/b4de632dd753f7fd9d68c03f63a2820a4d5b987a))
* **release-please:** ajout d'une Github Action pour vérifier le nom des PR (conventional commits) ([#8](https://github.com/raphodn/open-air-events/issues/8)) ([c094bea](https://github.com/raphodn/open-air-events/commit/c094bead0a2e2eedc751508caa0d457b43f948d5))
* **release-please:** ajout de la Github Action 'release-please' ([#9](https://github.com/raphodn/open-air-events/issues/9)) ([6a996ff](https://github.com/raphodn/open-air-events/commit/6a996ffa4f14c79c2c311cf103f64df48c717a9e))
* **release-please:** fix ajout du manifest json ([#11](https://github.com/raphodn/open-air-events/issues/11)) ([b1c1254](https://github.com/raphodn/open-air-events/commit/b1c1254273c4d94af9a796dd51d906964ad0dd70))
* **release-please:** fix du nom de la branche principale ([#10](https://github.com/raphodn/open-air-events/issues/10)) ([c42c8cf](https://github.com/raphodn/open-air-events/commit/c42c8cf85cb663d0c578a3977b6d8eb69e5731df))
* **release-please:** fix permissions ([#12](https://github.com/raphodn/open-air-events/issues/12)) ([b19847f](https://github.com/raphodn/open-air-events/commit/b19847f389da013cd5c430fcaea8b2effdf8aed4))
* **release-please:** fix permissions again (downgrade to v4) ([#13](https://github.com/raphodn/open-air-events/issues/13)) ([043d638](https://github.com/raphodn/open-air-events/commit/043d638299636005b15645b8daf026a1dc5b67e5))
* **release-please:** fix permissions again again ([#14](https://github.com/raphodn/open-air-events/issues/14)) ([4497eb8](https://github.com/raphodn/open-air-events/commit/4497eb8552d9e0acdedbbf523622593cea128ea2))
