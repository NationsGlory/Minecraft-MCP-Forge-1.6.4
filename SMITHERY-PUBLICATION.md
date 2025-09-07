# 📚 Guide de Publication Smithery

## 🎯 Objectif

Publier votre serveur MCP Minecraft GUI sur Smithery.ai pour le rendre accessible à la communauté.

## 📋 Prérequis

1. **Serveur déployé** : Votre serveur doit être déployé sur Railway
2. **Compte Smithery** : Créez un compte sur [smithery.ai](https://smithery.ai)
3. **Métadonnées** : Fichier `smithery-metadata.json` préparé
4. **Documentation** : README et documentation complète

## 🚀 Étapes de Publication

### 1. Préparation des Fichiers

Assurez-vous d'avoir ces fichiers :
- ✅ `smithery-metadata.json` - Métadonnées du projet
- ✅ `SMITHERY-README.md` - Documentation pour Smithery
- ✅ `RAILWAY-DEPLOYMENT.md` - Guide de déploiement
- ✅ Serveur déployé sur Railway

### 2. Configuration Smithery

#### A. Créer un Nouveau Projet

1. **Connectez-vous** à [smithery.ai](https://smithery.ai)
2. **Cliquez** sur "Create New Project"
3. **Remplissez** les informations de base :
   - **Nom** : `mcp-minecraft-gui`
   - **Description** : `MCP server pour analyser les spritesheets GUI Minecraft et générer du code Java 7 pour Forge 1.6.4`
   - **Catégorie** : Game Development
   - **Tags** : minecraft, forge, gui, spritesheet, java, mcp

#### B. Configuration MCP

1. **Type de serveur** : MCP Server
2. **URL de déploiement** : `https://votre-projet.up.railway.app`
3. **Endpoints** :
   - **Santé** : `/health`
   - **Métadonnées** : `/mcp/info`
   - **Outils** : `/mcp/tools`

#### C. Métadonnées Détaillées

Copiez le contenu de `smithery-metadata.json` dans les champs appropriés :

```json
{
  "name": "mcp-minecraft-gui",
  "displayName": "MCP Minecraft GUI Server",
  "version": "1.0.0",
  "description": "MCP server pour analyser les spritesheets GUI Minecraft et générer du code Java 7 pour Forge 1.6.4",
  "author": {
    "name": "coupaul",
    "url": "https://github.com/coupaul"
  },
  "capabilities": {
    "tools": true
  }
}
```

### 3. Documentation Smithery

#### A. README Principal

Utilisez le contenu de `SMITHERY-README.md` pour :
- Description détaillée du projet
- Fonctionnalités principales
- Exemples d'utilisation
- Cas d'usage

#### B. Exemples d'Utilisation

Ajoutez ces exemples dans Smithery :

**Exemple 1 - Analyse de spritesheet :**
```json
{
  "tool": "analyze_gui_spritesheet",
  "arguments": {
    "image": "textures/gui/main_menu.png",
    "hints": {
      "detectStates": true,
      "minSpriteSize": 16,
      "maxSprites": 50
    }
  }
}
```

**Exemple 2 - Génération de code Java :**
```json
{
  "tool": "generate_java_gui",
  "arguments": {
    "atlas": "main_menu_atlas.json",
    "package": "com.example.mod.gui",
    "screenName": "GuiMainMenu",
    "target": "forge-1.6.4"
  }
}
```

**Exemple 3 - Prévisualisation :**
```json
{
  "tool": "preview_layout",
  "arguments": {
    "atlas": "main_menu_atlas.json",
    "layout": {
      "width": 800,
      "height": 600,
      "showBounds": true,
      "showLabels": true
    }
  }
}
```

### 4. Configuration des Outils

Pour chaque outil, configurez :

#### A. `analyze_gui_spritesheet`
- **Description** : Analyse une spritesheet GUI PNG et génère un atlas.json
- **Paramètres** : image (requis), hints (optionnel)
- **Exemple** : Analyse d'un menu principal Minecraft

#### B. `export_slices`
- **Description** : Exporte les sprites découpés ou crée un atlas packé
- **Paramètres** : atlas (requis), packing (optionnel)
- **Exemple** : Export individuel des sprites

#### C. `generate_java_gui`
- **Description** : Génère du code Java 7 pour Forge 1.6.4
- **Paramètres** : atlas, package, screenName (requis), target (optionnel)
- **Exemple** : Génération d'un écran GUI complet

#### D. `preview_layout`
- **Description** : Crée une prévisualisation PNG du layout GUI
- **Paramètres** : atlas (requis), layout (optionnel)
- **Exemple** : Prévisualisation avec bordures et labels

### 5. Images et Assets

#### A. Logo du Projet
- **Taille** : 512x512 pixels
- **Format** : PNG avec transparence
- **Style** : Minecraft/Gaming theme

#### B. Screenshots
- **Interface** : Capture d'écran des outils en action
- **Résultats** : Exemples de code Java généré
- **Prévisualisations** : Layouts GUI créés

#### C. Diagrammes
- **Architecture** : Flux de données MCP
- **Workflow** : Processus d'analyse → génération
- **Intégration** : Comment utiliser dans un mod

### 6. Publication et Test

#### A. Validation Pré-Publication

1. **Test des endpoints** :
   ```bash
   curl https://votre-projet.up.railway.app/health
   curl https://votre-projet.up.railway.app/mcp/info
   curl https://votre-projet.up.railway.app/mcp/tools
   ```

2. **Test des outils MCP** :
   - Utilisez un client MCP pour tester chaque outil
   - Vérifiez que les réponses sont correctes
   - Testez avec différents paramètres

#### B. Publication

1. **Mode Draft** : Commencez par publier en mode brouillon
2. **Review** : Demandez des retours à la communauté
3. **Publication** : Publiez officiellement quand tout est prêt

### 7. Promotion et Communauté

#### A. Réseaux Sociaux

- **Twitter/X** : Annoncez la publication
- **Reddit** : r/Minecraft, r/feedthebeast
- **Discord** : Communautés Minecraft/Modding

#### B. Documentation

- **GitHub** : Repository bien documenté
- **Wiki** : Guide d'utilisation détaillé
- **Vidéos** : Tutoriels YouTube

#### C. Support Communauté

- **Issues** : Répondez aux questions GitHub
- **Discussions** : Forum communautaire
- **Discord** : Canal de support

## 🔧 Configuration Avancée

### 1. Webhooks Smithery

Configurez des webhooks pour :
- **Mises à jour** : Notifications automatiques
- **Statistiques** : Métriques d'utilisation
- **Erreurs** : Alertes de problèmes

### 2. Analytics

Intégrez des analytics pour :
- **Utilisation** : Quels outils sont les plus utilisés
- **Performance** : Temps de réponse
- **Erreurs** : Problèmes fréquents

### 3. Versioning

- **Semantic Versioning** : 1.0.0, 1.1.0, etc.
- **Changelog** : Historique des modifications
- **Migration** : Guide de mise à jour

## 📊 Métriques de Succès

### 1. Adoption

- **Téléchargements** : Nombre d'utilisations
- **Stars GitHub** : Popularité du projet
- **Forks** : Contributions communautaires

### 2. Engagement

- **Issues** : Problèmes signalés et résolus
- **Pull Requests** : Contributions de code
- **Discussions** : Interactions communautaires

### 3. Qualité

- **Tests** : Couverture de tests
- **Documentation** : Qualité de la doc
- **Support** : Temps de réponse aux questions

## 🐛 Dépannage

### Problèmes Courants

**Serveur non accessible** :
- Vérifiez le déploiement Railway
- Testez les endpoints de santé
- Consultez les logs Railway

**Outils MCP non reconnus** :
- Vérifiez la configuration Smithery
- Testez avec un client MCP
- Consultez les métadonnées `/mcp/info`

**Erreurs de génération** :
- Vérifiez les paramètres d'entrée
- Consultez les logs du serveur
- Testez avec des exemples simples

## 📞 Support

- **Smithery Docs** : [docs.smithery.ai](https://docs.smithery.ai)
- **GitHub Issues** : [github.com/coupaul/Minecraft-MCP-Forge-1.6.4/issues](https://github.com/coupaul/Minecraft-MCP-Forge-1.6.4/issues)
- **Discord Smithery** : [discord.gg/smithery](https://discord.gg/smithery)

---

**🎉 Votre serveur MCP Minecraft GUI est maintenant prêt pour Smithery !**
