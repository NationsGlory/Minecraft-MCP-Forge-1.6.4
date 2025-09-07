# Documentation MCP Minecraft GUI

## 📖 Vue d'ensemble

Le serveur MCP Minecraft GUI est un outil puissant qui permet d'analyser automatiquement les spritesheets GUI de Minecraft et de générer du code Java 7 compatible avec Forge 1.6.4.

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Java 7 (pour compiler le code généré)
- Forge 1.6.4 (MCPC+)

### Installation
```bash
cd server
npm install
npm run build
```

### Démarrage du serveur
```bash
npm start
```

## 🛠️ Outils Disponibles

### 1. analyze_gui_spritesheet

**Description** : Analyse une spritesheet GUI PNG et génère un atlas.json avec les sprites détectés.

**Paramètres** :
- `image` (requis) : Chemin vers le fichier PNG de la spritesheet GUI
- `hints` (optionnel) : Indices pour l'analyse
  - `minSpriteSize` : Taille minimale d'un sprite en pixels
  - `maxSprites` : Nombre maximum de sprites à détecter
  - `detectStates` : Détecter automatiquement les états (hover, pressed, etc.)

**Exemple d'utilisation** :
```json
{
  "image": "textures/gui/main_menu.png",
  "hints": {
    "minSpriteSize": 16,
    "maxSprites": 50,
    "detectStates": true
  }
}
```

**Sortie** : Fichier `atlas.json` avec :
- Coordonnées des sprites détectés
- États multiples (normal, hover, pressed)
- Marges 9-slice pour les panneaux
- Métadonnées de l'atlas

### 2. export_slices

**Description** : Exporte les sprites découpés ou crée un atlas packé avec mapping.

**Paramètres** :
- `atlas` (requis) : Chemin vers le fichier atlas.json généré
- `packing` (optionnel) : Options de packing
  - `outputDir` : Dossier de sortie pour les sprites
  - `packMode` : "individual" (fichiers séparés) ou "atlas" (fichier packé)
  - `maxAtlasSize` : Taille maximale de l'atlas en pixels

**Exemple d'utilisation** :
```json
{
  "atlas": "main_menu_atlas.json",
  "packing": {
    "outputDir": "./exported_sprites",
    "packMode": "individual",
    "maxAtlasSize": 1024
  }
}
```

### 3. generate_java_gui

**Description** : Génère du code Java 7 compatible avec Forge 1.6.4.

**Paramètres** :
- `atlas` (requis) : Chemin vers le fichier atlas.json
- `target` (optionnel) : Version cible (défaut: "forge-1.6.4")
- `package` (requis) : Package Java pour les classes générées
- `screenName` (requis) : Nom de la classe d'écran principale

**Exemple d'utilisation** :
```json
{
  "atlas": "main_menu_atlas.json",
  "target": "forge-1.6.4",
  "package": "com.example.mod.gui",
  "screenName": "GuiMainMenu"
}
```

**Classes générées** :
- `AtlasUVs.java` : Constantes UV pour l'atlas
- `GuiDraw164.java` : Utilitaires de rendu avec Tessellator
- `AtlasButton164.java` : Boutons personnalisés avec états
- `GuiMainMenu.java` : Exemple d'écran GUI

### 4. preview_layout

**Description** : Crée une prévisualisation PNG du layout GUI avec les sprites extraits.

**Paramètres** :
- `atlas` (requis) : Chemin vers le fichier atlas.json
- `layout` (optionnel) : Configuration du layout
  - `width` : Largeur de la prévisualisation
  - `height` : Hauteur de la prévisualisation
  - `showBounds` : Afficher les bordures des sprites
  - `showLabels` : Afficher les noms des sprites

**Exemple d'utilisation** :
```json
{
  "atlas": "main_menu_atlas.json",
  "layout": {
    "width": 800,
    "height": 600,
    "showBounds": true,
    "showLabels": true
  }
}
```

## 📁 Structure des Fichiers Générés

### AtlasUVs.java
Contient toutes les constantes UV pour accéder aux sprites dans l'atlas :
```java
public static final float BUTTON_MAIN_NORMAL_U1 = 0.000000f;
public static final float BUTTON_MAIN_NORMAL_V1 = 0.000000f;
public static final float BUTTON_MAIN_NORMAL_U2 = 0.390625f;
public static final float BUTTON_MAIN_NORMAL_V2 = 0.039063f;
public static final int BUTTON_MAIN_NORMAL_WIDTH = 200;
public static final int BUTTON_MAIN_NORMAL_HEIGHT = 20;
```

### GuiDraw164.java
Utilitaires de rendu utilisant Tessellator pour un contrôle précis des UVs :
- `drawSprite()` : Dessine un sprite simple
- `drawNineSlice()` : Dessine un panneau avec 9-slice
- `drawSpriteWithState()` : Dessine un sprite avec états multiples

### AtlasButton164.java
Bouton personnalisé héritant de GuiButton avec support des états :
- Détection automatique du hover/pressed
- Rendu des états appropriés
- Support du texte sur le bouton

## 🎨 Intégration dans votre Mod

### 1. Préparation des Textures
Placez votre spritesheet GUI dans :
```
assets/votre_mod/textures/gui/gui_atlas.png
```

### 2. Génération du Code
Utilisez l'outil `generate_java_gui` pour créer les classes Java.

### 3. Intégration dans votre Mod
```java
// Dans votre classe principale de mod
@EventHandler
public void onClientInit(FMLInitializationEvent event) {
    if (event.getSide() == Side.CLIENT) {
        // Enregistrer votre écran GUI
        MinecraftForge.EVENT_BUS.register(new GuiMainMenu164());
    }
}

// Ouvrir votre GUI
Minecraft.getMinecraft().displayGuiScreen(new GuiMainMenu164());
```

### 4. Personnalisation
- Modifiez `AtlasButton164.java` pour vos besoins spécifiques
- Adaptez `GuiMainMenu164.java` comme modèle pour vos écrans
- Utilisez `GuiDraw164.java` pour des rendus personnalisés

## 🔧 Fonctionnalités Avancées

### 9-Slice Rendering
Pour les panneaux scalables, le système détecte automatiquement les marges 9-slice :
```java
GuiDraw164.drawNineSlice(x, y, width, height,
    AtlasUVs.PANEL_BACKGROUND_NORMAL_U1, AtlasUVs.PANEL_BACKGROUND_NORMAL_V1,
    AtlasUVs.PANEL_BACKGROUND_NORMAL_U2, AtlasUVs.PANEL_BACKGROUND_NORMAL_V2,
    AtlasUVs.PANEL_BACKGROUND_NORMAL_SLICE_TOP, AtlasUVs.PANEL_BACKGROUND_NORMAL_SLICE_RIGHT,
    AtlasUVs.PANEL_BACKGROUND_NORMAL_SLICE_BOTTOM, AtlasUVs.PANEL_BACKGROUND_NORMAL_SLICE_LEFT);
```

### États Multiples
Détection automatique des états de boutons :
- `normal` : État par défaut
- `hover` : Survol de la souris
- `pressed` : Clic enfoncé

### Optimisation des Textures
- Support des textures non-256×256 grâce à Tessellator
- Rendu pixel-perfect avec GL_NEAREST
- Gestion optimisée des UVs

## 🐛 Dépannage

### Problèmes Courants

**Erreur "Aucune texture liée"** :
- Vérifiez que vous appelez `GuiDraw164.bindTexture()` avant de dessiner

**Sprites non détectés** :
- Vérifiez que vos sprites ont un canal alpha > 0
- Ajustez `minSpriteSize` dans les hints

**Code Java ne compile pas** :
- Vérifiez que vous utilisez Java 7
- Assurez-vous que Forge 1.6.4 est correctement configuré

### Logs et Debug
Le serveur MCP affiche des logs détaillés dans la console pour le débogage.

## 📝 Exemples Complets

Voir le dossier `atlas-examples/` et `java-output-example/` pour des exemples complets d'utilisation.

## 🤝 Contribution

Ce projet est open source. Les contributions sont les bienvenues !

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.
