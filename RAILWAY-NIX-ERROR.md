# 🚨 Dépannage Railway - Erreur Nix "undefined variable 'npm'"

## ❌ Problème Identifié

```
error: undefined variable 'npm'
at /app/.nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix:19:16:
    18|         '')
    19|     nodejs npm
    20|       ];
```

**Cause** : Railway/Nixpacks a un problème avec la variable `npm` dans la configuration Nix.

## ✅ Solutions Appliquées

### Solution 1 : Configuration Nixpacks Simplifiée

J'ai créé `nixpacks-simple.toml` avec une configuration minimale :

```toml
[phases.setup]
nixPkgs = ["nodejs"]

[phases.install]
cmds = ["cd server && npm install"]

[phases.build]
cmds = ["cd server && npm run build"]

[start]
cmd = "cd server && npm start"
```

### Solution 2 : Dockerfile Personnalisé

J'ai créé `Dockerfile` comme alternative :

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
COPY server/package.json ./server/
RUN cd server && npm install
COPY server/ ./server/
RUN cd server && npm run build
EXPOSE 3000
CMD ["sh", "-c", "cd server && npm start"]
```

## 🚀 Actions à Effectuer

### Option 1 : Utiliser la Configuration Simplifiée

1. **Renommez** `nixpacks-simple.toml` en `nixpacks.toml`
2. **Supprimez** l'ancien `nixpacks.toml`
3. **Redéployez** sur Railway

### Option 2 : Utiliser Dockerfile

1. **Dans Railway** :
   - Allez dans "Settings" → "Build"
   - Changez "Build Command" vers `docker build -t app .`
   - Changez "Start Command" vers `docker run -p $PORT:3000 app`

### Option 3 : Configuration Railway Manuelle

1. **Dans Railway** :
   - Allez dans "Settings" → "Source"
   - Changez "Root Directory" vers `server`
   - Supprimez les fichiers `nixpacks.toml` et `Dockerfile`

## 🔧 Configuration Alternative

### Variables d'Environnement Railway

```bash
NODE_ENV=production
PORT=3000
MCP_SERVER_NAME=mcp-minecraft-gui
MCP_SERVER_VERSION=1.0.0
MAX_FILE_SIZE=10MB
MAX_SPRITES_PER_ATLAS=100
DEFAULT_ATLAS_SIZE=1024
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
```

### Build Commands Railway

```bash
# Build Command
cd server && npm install && npm run build

# Start Command  
cd server && npm start
```

## 🧪 Test Local

Testez d'abord localement :

```bash
cd server
npm install
npm run build
npm start
```

## 📊 Comparaison des Solutions

| Solution | Avantages | Inconvénients |
|----------|-----------|---------------|
| Nixpacks Simple | Configuration minimale | Peut encore poser problème |
| Dockerfile | Contrôle total | Plus complexe |
| Configuration Manuelle | Simple | Moins de contrôle |

## 🎯 Recommandation

**Utilisez la Solution 3 (Configuration Manuelle)** :
1. Supprimez `nixpacks.toml` et `Dockerfile`
2. Dans Railway : Root Directory → `server`
3. Variables d'environnement → Configuration ci-dessus
4. Build/Start Commands → Commandes ci-dessus

## 📞 Support

- **Railway Docs** : https://docs.railway.app
- **Nixpacks Docs** : https://nixpacks.com
- **GitHub Issues** : https://github.com/coupaul/Minecraft-MCP-Forge-1.6.4/issues

---

**🎯 Avec ces solutions, Railway devrait maintenant déployer correctement !**
