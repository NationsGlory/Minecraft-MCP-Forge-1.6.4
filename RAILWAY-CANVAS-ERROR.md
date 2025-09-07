# 🚨 Dépannage Railway - Erreur Canvas/Python

## ❌ Problème Identifié

```
npm error gyp ERR! find Python Python is not set from command line or npm configuration
npm error gyp ERR! find Python You need to install the latest version of Python.
npm error Failed to execute 'node-pre-gyp install --fallback-to-build --update-binary'
```

**Cause** : Le package `canvas` nécessite Python et des dépendances système pour la compilation native, mais nous ne l'utilisons pas réellement.

## ✅ Solution Appliquée

### Suppression du Package Canvas

J'ai supprimé `canvas` des dépendances car :
- ✅ Nous utilisons `sharp` pour le traitement d'images
- ✅ `sharp` est plus simple à déployer
- ✅ `canvas` nécessite Python + dépendances système
- ✅ `sharp` est plus performant pour notre usage

### Dépendances Optimisées

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.4.0",
    "sharp": "^0.33.0",
    "jimp": "^0.22.10",
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

## 🚀 Actions à Effectuer

### Option 1 : Redéployer (Recommandée)

1. **Railway détectera** automatiquement les changements
2. **Redéployez** le service
3. **Les dépendances** seront réinstallées sans `canvas`

### Option 2 : Configuration Manuelle

Si Railway ne redéploie pas automatiquement :

1. **Dans Railway** :
   - Allez dans "Settings" → "Source"
   - Forcez un nouveau déploiement
   - Ou supprimez et recréez le service

### Option 3 : Test Local

Testez d'abord localement :

```bash
cd server
npm install
npm run build
npm start
```

## 🔧 Alternatives si Problème Persiste

### Solution 1 : Dockerfile Personnalisé

Créez un `Dockerfile` avec Python :

```dockerfile
FROM node:18-alpine

# Installer Python et dépendances système
RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Solution 2 : Configuration Nixpacks

Créez un `nixpacks.toml` :

```toml
[phases.setup]
nixPkgs = ["nodejs", "python3"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

### Solution 3 : Variables d'Environnement

Dans Railway, ajoutez :

```bash
PYTHON=/usr/bin/python3
npm_config_python=/usr/bin/python3
```

## 📊 Comparaison des Solutions

| Solution | Avantages | Inconvénients |
|----------|-----------|---------------|
| Suppression Canvas | Simple, rapide | Perte de fonctionnalité canvas |
| Dockerfile | Contrôle total | Plus complexe |
| Nixpacks + Python | Configuration claire | Dépendances supplémentaires |
| Variables ENV | Simple | Peut ne pas suffire |

## 🎯 Recommandation

**Utilisez la Solution 1 (Suppression Canvas)** car :
- ✅ Nous n'utilisons pas `canvas` dans le code
- ✅ `sharp` est suffisant pour nos besoins
- ✅ Déploiement plus simple et rapide
- ✅ Moins de dépendances système

## 🧪 Test de Validation

Une fois redéployé, testez :

```bash
curl https://minecraft.mcp.coupaul.fr/health
curl https://minecraft.mcp.coupaul.fr/mcp/info
```

## 📞 Support

- **Railway Docs** : https://docs.railway.app
- **Sharp Docs** : https://sharp.pixelplumbing.com
- **GitHub Issues** : https://github.com/coupaul/Minecraft-MCP-Forge-1.6.4/issues

---

**🎯 Avec la suppression de `canvas`, Railway devrait maintenant déployer sans erreur !**
