# Dockerfile personnalisé pour Railway
# Alternative si Nixpacks continue à poser problème

FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package.json ./
COPY server/package.json ./server/

# Installer les dépendances
RUN cd server && npm install

# Copier le code source
COPY server/ ./server/

# Compiler le TypeScript
RUN cd server && npm run build

# Exposer le port
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000
ENV MCP_SERVER_NAME=mcp-minecraft-gui
ENV MCP_SERVER_VERSION=1.0.0
ENV MAX_FILE_SIZE=10MB
ENV MAX_SPRITES_PER_ATLAS=100
ENV DEFAULT_ATLAS_SIZE=1024
ENV LOG_LEVEL=info
ENV ENABLE_REQUEST_LOGGING=true

# Commande de démarrage
CMD ["sh", "-c", "cd server && npm start"]
