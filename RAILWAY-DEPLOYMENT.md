# 🚀 Guide de Déploiement Railway

## 📋 Prérequis

1. **Compte Railway** : Créez un compte sur [railway.app](https://railway.app)
2. **GitHub Repository** : Votre code doit être sur GitHub
3. **Railway CLI** (optionnel) : Pour le déploiement en ligne de commande

## 🔧 Configuration Railway

### 1. Variables d'Environnement

Configurez ces variables dans Railway :

```bash
# Configuration de base
PORT=3000
NODE_ENV=production

# Configuration MCP
MCP_SERVER_NAME=mcp-minecraft-gui
MCP_SERVER_VERSION=1.0.0
MCP_SERVER_DESCRIPTION=MCP server pour analyser les spritesheets GUI Minecraft

# Configuration des outils
MAX_FILE_SIZE=10MB
MAX_SPRITES_PER_ATLAS=100
DEFAULT_ATLAS_SIZE=1024

# Logs
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
```

### 2. Configuration du Build

Railway détectera automatiquement :
- **Build Command** : `npm run railway:build`
- **Start Command** : `npm run railway:start`

### 3. Configuration du Port

Le serveur utilise automatiquement `process.env.PORT` pour Railway.

## 🚀 Déploiement

### Méthode 1 : Interface Web Railway

1. **Connecter GitHub** :
   - Allez sur [railway.app](https://railway.app)
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository `Minecraft-MCP-Forge-1.6.4`

2. **Configuration du Service** :
   - Railway détectera automatiquement le dossier `server/`
   - Configurez les variables d'environnement
   - Déployez !

### Méthode 2 : Railway CLI

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
railway init

# Déployer
railway up
```

## 🔍 Vérification du Déploiement

### 1. Endpoints Disponibles

Une fois déployé, votre serveur sera disponible sur :
- **URL principale** : `https://minecraft.mcp.coupaul.fr`
- **Santé** : `https://minecraft.mcp.coupaul.fr/health`
- **Métadonnées MCP** : `https://minecraft.mcp.coupaul.fr/mcp/info`
- **Outils MCP** : `https://minecraft.mcp.coupaul.fr/mcp/tools`

### 2. Test de Santé

```bash
curl https://minecraft.mcp.coupaul.fr/health
```

Réponse attendue :
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "service": "mcp-minecraft-gui"
}
```

### 3. Métadonnées MCP

```bash
curl https://minecraft.mcp.coupaul.fr/mcp/info
```

## 📊 Monitoring

### Logs Railway
- Accédez aux logs via l'interface Railway
- Surveillez les erreurs et les performances
- Configurez des alertes si nécessaire

### Métriques
- **CPU** : Utilisation du processeur
- **Mémoire** : Consommation RAM
- **Réseau** : Trafic entrant/sortant
- **Durée** : Temps de réponse des requêtes

## 🔧 Configuration Avancée

### 1. Domaine Personnalisé

Dans Railway :
1. Allez dans "Settings" → "Domains"
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions

### 2. Scaling

Railway peut automatiquement :
- **Scale up** : Augmenter les ressources en cas de charge
- **Scale down** : Réduire les ressources en période calme

### 3. Environnements

Créez des environnements séparés :
- **Production** : Version stable
- **Staging** : Tests avant production
- **Development** : Développement local

## 🐛 Dépannage

### Problèmes Courants

**Build Failed** :
- Vérifiez que `package.json` est correct
- Assurez-vous que toutes les dépendances sont installées
- Vérifiez les logs de build

**Service Unavailable** :
- Vérifiez les variables d'environnement
- Assurez-vous que le port est correctement configuré
- Consultez les logs d'application

**Outils MCP non disponibles** :
- Vérifiez que le serveur MCP démarre correctement
- Testez l'endpoint `/mcp/info`
- Consultez les logs pour les erreurs

### Logs Utiles

```bash
# Via Railway CLI
railway logs

# Via interface web
# Allez dans votre projet → Logs
```

## 📈 Optimisation

### Performance
- **Cache** : Mettez en cache les atlas générés
- **Compression** : Activez la compression gzip
- **CDN** : Utilisez un CDN pour les assets statiques

### Coûts
- **Plan gratuit** : Suffisant pour le développement
- **Plan Pro** : Pour la production avec plus de ressources
- **Monitoring** : Surveillez l'utilisation des ressources

## 🔗 Intégration Smithery

Une fois déployé sur Railway :

1. **Copiez l'URL** de votre déploiement Railway
2. **Ajoutez-la** dans les métadonnées Smithery
3. **Testez** l'intégration MCP
4. **Publiez** sur Smithery.ai

## 📞 Support

- **Railway Docs** : [docs.railway.app](https://docs.railway.app)
- **GitHub Issues** : [github.com/coupaul/Minecraft-MCP-Forge-1.6.4/issues](https://github.com/coupaul/Minecraft-MCP-Forge-1.6.4/issues)
- **Discord Railway** : [discord.gg/railway](https://discord.gg/railway)

---

**🎉 Votre serveur MCP Minecraft GUI est maintenant déployé sur Railway !**
