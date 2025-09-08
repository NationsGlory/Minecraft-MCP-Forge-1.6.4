# Dockerfile optimisé pour MCP Minecraft MCPC+ 1.6.4 Server
# Build timestamp: $(date +%s) - Force cache invalidation
FROM node:18-alpine

# Installer les outils nécessaires
RUN apk add --no-cache git

# Créer un utilisateur non-root pour éviter les problèmes de permissions
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration racine
COPY package.json package-lock.json ./

# Installer les dépendances racines
RUN npm ci --include=dev

# Copier le code source racine
COPY . .

# Aller dans le dossier server
WORKDIR /app/server

# Copier les fichiers de configuration du serveur
COPY server/package.json server/package-lock.json ./

# Installer TOUTES les dépendances (production + dev pour TypeScript)
RUN npm ci --include=dev

# Copier le code source du serveur
COPY server/ .

# Vérifier que TypeScript est installé et accessible
RUN npx tsc --version

# Vérifier les permissions des fichiers
RUN ls -la node_modules/.bin/tsc

# Compiler le TypeScript avec permissions explicites
RUN chmod +x node_modules/.bin/tsc && \
    npm run build

# Vérifier que le build a réussi
RUN ls -la dist/

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
