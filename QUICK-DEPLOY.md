# 🚀 Commandes Rapides - Déploiement MCP Minecraft GUI

## 📋 Checklist de Déploiement

### ✅ Préparation
- [x] Code source complet
- [x] Configuration Railway
- [x] Métadonnées Smithery
- [x] Documentation complète
- [x] Scripts de déploiement

### 🚂 Déploiement Railway

```bash
# Option 1: Script automatisé
./deploy-railway.sh

# Option 2: Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up

# Option 3: Interface web
# 1. Allez sur https://railway.app
# 2. New Project → Deploy from GitHub repo
# 3. Sélectionnez votre repository
# 4. Configurez les variables d'environnement
# 5. Déployez !
```

### 🌐 Publication Smithery

```bash
# 1. Créez un compte sur https://smithery.ai
# 2. Nouveau projet : mcp-minecraft-gui
# 3. Type : MCP Server
# 4. URL : https://votre-projet.up.railway.app
# 5. Métadonnées : Copiez smithery-metadata.json
# 6. Documentation : Copiez SMITHERY-README.md
# 7. Publiez !
```

## 🔧 Variables d'Environnement Railway

```bash
PORT=3000
NODE_ENV=production
MCP_SERVER_NAME=mcp-minecraft-gui
MCP_SERVER_VERSION=1.0.0
MAX_FILE_SIZE=10MB
MAX_SPRITES_PER_ATLAS=100
DEFAULT_ATLAS_SIZE=1024
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
```

## 🧪 Tests de Validation

```bash
# Test de santé
curl https://votre-projet.up.railway.app/health

# Métadonnées MCP
curl https://votre-projet.up.railway.app/mcp/info

# Outils disponibles
curl https://votre-projet.up.railway.app/mcp/tools

# Page principale
curl https://votre-projet.up.railway.app/
```

## 📊 Endpoints Disponibles

| Endpoint | Description | Méthode |
|----------|-------------|---------|
| `/` | Page principale avec informations | GET |
| `/health` | Santé du service | GET |
| `/mcp/info` | Métadonnées MCP | GET |
| `/mcp/tools` | Liste des outils | GET |

## 🛠️ Outils MCP Disponibles

| Outil | Description | Paramètres Requis |
|-------|-------------|-------------------|
| `analyze_gui_spritesheet` | Analyse spritesheet PNG | `image` |
| `export_slices` | Export sprites | `atlas` |
| `generate_java_gui` | Génération code Java 7 | `atlas`, `package`, `screenName` |
| `preview_layout` | Prévisualisation layout | `atlas` |

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| `README.md` | Vue d'ensemble du projet |
| `DOCUMENTATION.md` | Guide complet d'utilisation |
| `RAILWAY-DEPLOYMENT.md` | Guide de déploiement Railway |
| `SMITHERY-PUBLICATION.md` | Guide de publication Smithery |
| `DEPLOYMENT-READY.md` | Résumé de déploiement |

## 🎯 Exemples d'Utilisation

### Analyse de spritesheet
```json
{
  "tool": "analyze_gui_spritesheet",
  "arguments": {
    "image": "textures/gui/main_menu.png",
    "hints": {
      "detectStates": true,
      "minSpriteSize": 16
    }
  }
}
```

### Génération de code Java
```json
{
  "tool": "generate_java_gui",
  "arguments": {
    "atlas": "main_menu_atlas.json",
    "package": "com.example.mod.gui",
    "screenName": "GuiMainMenu"
  }
}
```

## 🚨 Dépannage Rapide

### Problème : Build failed
```bash
cd server
npm install
npm run build
```

### Problème : Service unavailable
```bash
# Vérifiez les variables d'environnement
# Consultez les logs Railway
railway logs
```

### Problème : Outils MCP non reconnus
```bash
# Testez l'endpoint métadonnées
curl https://votre-projet.up.railway.app/mcp/info
```

## 📞 Support

- **GitHub Issues** : https://github.com/coupaul/Minecraft-MCP-Forge-1.6.4/issues
- **Railway Docs** : https://docs.railway.app
- **Smithery Docs** : https://docs.smithery.ai

---

**🎉 Votre serveur MCP Minecraft GUI est prêt pour Railway et Smithery !**
