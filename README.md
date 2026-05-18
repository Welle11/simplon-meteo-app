# Projet Météo - Simplon Nantes

Ce projet est une adaptation de l'application [madzadev/weather-app](https://github.com/madzadev/weather-app). L'objectif était de transformer une application météo grand public en une solution d'affichage fixe pour les véhicules de transport en commun.

## Modifications réalisées

Pour répondre aux besoins de l'entreprise de transport, j'ai effectué les changements suivants :

- **Changement d'API** : Passage d'OpenWeatherMap à Open-Meteo (plus simple car sans clé API)
- **Fixation de la ville** : Suppression du moteur de recherche pour un affichage fixe basé sur un fichier `config.json`
- **Automatisation** : Ajout d'un rafraîchissement automatique des données toutes les heures
- **Fichier de config** : Création d'un système pour changer la ville via ses coordonnées GPS (latitude/longitude)
- **Conteneurisation** : Ajout de Docker pour faciliter le déploiement et garantir la portabilité

## Installation

### Option 1 : Lancement local (développement)

```bash
# Cloner et installer
git clone https://github.com/Welle11/simplon-meteo-app.git
cd simplon-meteo-app
npm install

# Lancer en local
npm run dev
```

**Note :** Nécessite Node.js v18+. Si erreur au lancement, utilisez `$env:NODE_OPTIONS="--openssl-legacy-provider"` (PowerShell) ou `export NODE_OPTIONS="--openssl-legacy-provider"` (Mac/Linux) avant `npm run dev`.

### Option 2 : Lancement avec Docker (recommandé)

```bash
# Prérequis : Docker Desktop installé et lancé

# Cloner le projet
git clone https://github.com/Welle11/simplon-meteo-app.git
cd simplon-meteo-app

# Lancer l'application avec Docker
docker-compose up --build

# L'application est accessible sur http://localhost:3000


```

## Configuration

Pour modifier la ville affichée, éditez le fichier `config.json` à la racine :

```json
{
  "city": {
    "name": "Nantes",
    "latitude": 47.2184,
    "longitude": -1.5536
  }
}
```

**Pour trouver les coordonnées GPS d'une ville :**

**Option 1 - Google Maps :**

1. Allez sur [Google Maps](https://www.google.com/maps)
2. Cliquez droit sur la ville
3. Copiez les coordonnées qui s'affichent (format : 47.26365980218024, -1.5685953056441557)

**Option 2 - LatLong.net :**

1. Allez sur [https://www.latlong.net/](https://www.latlong.net/)
2. Recherchez votre ville
3. Copiez les coordonnées affichées

## Technologies

- Next.js 14 / React 18
- Open-Meteo API
- CSS Modules
- Docker / Docker Compose
- Node.js
- Git / GitHub

---

**Auteur :** Welle11

## License

The project is under [MIT license](https://choosealicense.com/licenses/mit/).
