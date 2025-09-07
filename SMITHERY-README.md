# 🎮 MCP Minecraft GUI Server

Un serveur MCP (Model Context Protocol) puissant qui permet d'analyser automatiquement les spritesheets GUI de Minecraft et de générer du code Java 7 compatible avec Forge 1.6.4.

## 🌟 Fonctionnalités Principales

### 🔍 Analyse Automatique des Spritesheets
- Détection intelligente des sprites via algorithmes de composants connectés
- Support des états multiples (normal, hover, pressed)
- Détection automatique des marges 9-slice pour panneaux scalables
- Classification automatique des sprites (boutons, panneaux, icônes, arrière-plans)

### 📤 Export Flexible
- Export individuel des sprites en fichiers PNG séparés
- Création d'atlas packés optimisés avec bin packing
- Mapping JSON pour l'intégration dans votre mod

### ☕ Génération de Code Java 7
- Code strictement compatible avec Forge 1.6.4 (MCPC+)
- Classes générées : AtlasUVs, GuiDraw164, AtlasButton164, GuiMainMenu164
- Support Tessellator pour textures non-256×256
- Rendu pixel-perfect avec GL_NEAREST

### 👁️ Prévisualisation Interactive
- Génération de prévisualisations PNG des layouts GUI
- Affichage des bordures et labels des sprites
- Rapports détaillés de layout

## 🛠️ Outils Disponibles

### 1. `analyze_gui_spritesheet`
Analyse une spritesheet GUI PNG et génère un atlas.json avec les sprites détectés.

**Paramètres :**
- `image` (requis) : Chemin vers le fichier PNG
- `hints` (optionnel) : Configuration de l'analyse
  - `minSpriteSize` : Taille minimale des sprites
  - `maxSprites` : Nombre maximum de sprites
  - `detectStates` : Détection des états multiples

### 2. `export_slices`
Exporte les sprites découpés ou crée un atlas packé.

**Paramètres :**
- `atlas` (requis) : Fichier atlas.json
- `packing` (optionnel) : Options d'export
  - `outputDir` : Dossier de sortie
  - `packMode` : "individual" ou "atlas"
  - `maxAtlasSize` : Taille maximale de l'atlas

### 3. `generate_java_gui`
Génère du code Java 7 pour Forge 1.6.4.

**Paramètres :**
- `atlas` (requis) : Fichier atlas.json
- `package` (requis) : Package Java
- `screenName` (requis) : Nom de la classe principale
- `target` (optionnel) : Version cible (forge-1.6.4)

### 4. `preview_layout`
Crée une prévisualisation PNG du layout GUI.

**Paramètres :**
- `atlas` (requis) : Fichier atlas.json
- `layout` (optionnel) : Configuration de la prévisualisation
  - `width`/`height` : Dimensions
  - `showBounds` : Afficher les bordures
  - `showLabels` : Afficher les noms

## 🚀 Utilisation Rapide

1. **Analyser votre spritesheet :**
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

2. **Générer le code Java :**
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

3. **Prévisualiser le layout :**
   ```json
   {
     "tool": "preview_layout",
     "arguments": {
       "atlas": "main_menu_atlas.json",
       "layout": {
         "showBounds": true,
         "showLabels": true
       }
     }
   }
   ```

## 📋 Classes Java Générées

### `AtlasUVs.java`
Constantes UV pour tous les sprites :
```java
public static final float BUTTON_MAIN_NORMAL_U1 = 0.000000f;
public static final float BUTTON_MAIN_NORMAL_V1 = 0.000000f;
public static final int BUTTON_MAIN_NORMAL_WIDTH = 200;
public static final int BUTTON_MAIN_NORMAL_HEIGHT = 20;
```

### `GuiDraw164.java`
Utilitaires de rendu avec Tessellator :
- `drawSprite()` : Rendu simple
- `drawNineSlice()` : Panneaux scalables
- `drawSpriteWithState()` : États multiples

### `AtlasButton164.java`
Boutons personnalisés avec états automatiques.

### `GuiMainMenu164.java`
Exemple d'écran GUI complet.

## 🎯 Cas d'Usage

- **Mods Minecraft Forge 1.6.4** : Interface utilisateur personnalisée
- **Ressource Packs** : Analyse et optimisation des textures GUI
- **Développement de mods** : Génération rapide de code GUI
- **Prototypage** : Prévisualisation des interfaces

## 🔧 Configuration Technique

- **Java 7** : Compatibilité stricte avec Forge 1.6.4
- **Tessellator** : Rendu flexible des UVs
- **9-slice** : Panneaux scalables automatiques
- **Pixel-perfect** : Rendu net avec GL_NEAREST
- **Optimisation** : Bin packing pour les atlas

## 📊 Métriques de Performance

- **Analyse** : ~100 sprites/seconde
- **Export** : Optimisation automatique des atlas
- **Génération** : Code Java prêt à compiler
- **Prévisualisation** : Layouts en temps réel

## 🌐 Déploiement

Ce serveur MCP est déployé sur Railway et disponible via Smithery.ai pour une intégration facile dans vos workflows de développement Minecraft.

## 📖 Documentation Complète

Consultez la documentation complète dans le repository GitHub pour des exemples détaillés et des guides d'intégration.

---

**Auteur :** coupaul  
**Version :** 1.0.0  
**Licence :** MIT  
**Repository :** https://github.com/coupaul/Minecraft-MCP-Forge-1.6.4
