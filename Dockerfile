# 1. Utilisation de Node 18
FROM node:18-alpine

# 2. Dossier de travail
WORKDIR /app

# 3. Installation des dépendances
COPY package*.json ./
RUN npm install

# 4. Copie du code source
COPY . .

# 5. AJOUT DE LA COMMANDE MAGIQUE ICI
# On définit l'option OpenSSL directement dans l'environnement du conteneur
ENV NODE_OPTIONS=--openssl-legacy-provider

# 6. Maintenant le build va passer !
RUN npm run build

# 7. Exposition du port
EXPOSE 3000

# 8. Lancement
CMD ["npm", "start"]
