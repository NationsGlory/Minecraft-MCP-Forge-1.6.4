# Dockerfile pour MCP Minecraft MCPC+ 1.6.4 Server
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration racine
COPY package.json package-lock.json ./

# Installer les dépendances racines (si nécessaire)
RUN npm ci --only=production

# Copier le code source
COPY . .

# Aller dans le dossier server et installer les dépendances
WORKDIR /app/server

# Copier les fichiers de configuration du serveur
COPY server/package.json server/package-lock.json ./

# Installer les dépendances du serveur (incluant devDependencies pour TypeScript)
RUN npm ci

# Copier le code source du serveur
COPY server/ .

# Compiler le TypeScript
RUN npm run build

# Retourner au répertoire racine
WORKDIR /app

# Exposer le port 3000
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000
ENV MCP_SERVER_NAME=mcp-minecraft-mcpc-1.6.4
ENV MCP_SERVER_VERSION=3.7.0
ENV MAX_FILE_SIZE=10MB
ENV MAX_SPRITES_PER_ATLAS=100
ENV DEFAULT_ATLAS_SIZE=1024
ENV LOG_LEVEL=info
ENV ENABLE_REQUEST_LOGGING=true

# Commande de démarrage
CMD ["npm", "start"]
