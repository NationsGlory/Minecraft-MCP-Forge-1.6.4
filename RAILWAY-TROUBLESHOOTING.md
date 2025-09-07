# 🚨 Dépannage Railway - Erreur Nixpacks

## ❌ Problème Identifié

```
Nixpacks build failed
Nixpacks was unable to generate a build plan for this app.
The contents of the app directory are:
.gitattributes
README.md
```

**Cause** : Railway essaie de déployer depuis la racine au lieu du dossier `server/`.

## ✅ Solutions Appliquées

### 1. Fichiers de Configuration Créés

- ✅ `railway.json` - Configuration Railway principale
- ✅ `nixpacks.toml` - Configuration Nixpacks détaillée  
- ✅ `package.json` - Package.json racine avec scripts

### 2. Configuration Railway

Le fichier `railway.json` configure :
```json
{
  "build": {
    "buildCommand": "cd server && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd server && npm start"
  }
}
```

### 3. Configuration Nixpacks

Le fichier `nixpacks.toml` spécifie :
```toml
[phases.install]
cmds = ["cd server && npm install"]

[phases.build]
cmds = ["cd server && npm run build"]

[start]
cmd = "cd server && npm start"
```

## 🚀 Actions à Effectuer

### Option 1 : Redéployer (Recommandée)

1. **Dans Railway** :
   - Allez dans votre projet
   - Cliquez sur "Deploy" ou "Redeploy"
   - Railway utilisera maintenant les nouveaux fichiers de configuration

2. **Via Railway CLI** :
   ```bash
   railway redeploy
   ```

### Option 2 : Configuration Manuelle

1. **Dans Railway** :
   - Allez dans "Settings" → "Source"
   - Changez "Root Directory" vers `server`
   - Sauvegardez

2. **Variables d'environnement** :
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

### Option 3 : Nouveau Déploiement

1. **Supprimez** le service actuel dans Railway
2. **Créez** un nouveau service
3. **Connectez** votre repository GitHub
4. **Railway détectera** automatiquement la configuration

## 🔍 Vérification

### 1. Logs de Build

Vérifiez que les logs montrent :
```
cd server && npm install
cd server && npm run build
cd server && npm start
```

### 2. Endpoints de Test

Une fois déployé, testez :
```bash
curl https://votre-projet.up.railway.app/health
curl https://votre-projet.up.railway.app/mcp/info
```

### 3. Réponse Attendue

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "service": "mcp-minecraft-gui"
}
```

## 🐛 Dépannage Supplémentaire

### Si le problème persiste :

1. **Vérifiez la structure** :
   ```bash
   ls -la
   ls -la server/
   ```

2. **Testez localement** :
   ```bash
   cd server
   npm install
   npm run build
   npm start
   ```

3. **Logs Railway** :
   - Consultez les logs de build
   - Vérifiez les erreurs spécifiques
   - Contactez le support Railway si nécessaire

## 📞 Support

- **Railway Docs** : https://docs.railway.app
- **Nixpacks Docs** : https://nixpacks.com
- **GitHub Issues** : https://github.com/coupaul/Minecraft-MCP-Forge-1.6.4/issues

---

**🎯 Avec ces fichiers de configuration, Railway devrait maintenant déployer correctement depuis le dossier `server/` !**
