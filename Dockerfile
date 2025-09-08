# Dockerfile multi-stage pour MCP Minecraft MCPC+ 1.6.4 Server
# Build timestamp: 1757307438 - Force cache invalidation complète
FROM node:18-alpine AS builder

# Installer les outils nécessaires
RUN apk add --no-cache git

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration racine
COPY package.json package-lock.json ./

# Installer les dépendances racines
RUN npm ci --include=dev

# Copier le code source racine
COPY . .

# Aller dans le dossier server pour le build
WORKDIR /app/server

# Copier les fichiers de configuration du serveur
COPY server/package.json server/package-lock.json ./

# Installer TOUTES les dépendances (production + dev pour TypeScript)
RUN npm ci --include=dev

# Copier le code source du serveur
COPY server/ .

# Vérifier que TypeScript est installé
RUN npx tsc --version

# Compiler le TypeScript
RUN npm run build

# Vérifier que le build a réussi
RUN ls -la dist/

# Stage de production
FROM node:18-alpine AS production

# Installer les outils nécessaires
RUN apk add --no-cache git

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration racine
COPY package.json package-lock.json ./

# Installer les dépendances racines (production seulement)
RUN npm ci --only=production

# Copier le code source racine
COPY . .

# Aller dans le dossier server
WORKDIR /app/server

# Copier les fichiers de configuration du serveur
COPY server/package.json server/package-lock.json ./

# Installer les dépendances de production seulement
RUN npm ci --only=production

# Copier les fichiers compilés depuis le stage builder
COPY --from=builder /app/server/dist ./dist

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