# mcp-minecraft-gui

Un serveur MCP (Model Context Protocol) qui permet à une IA d'analyser les spritesheets GUI de Minecraft (.png) et de générer automatiquement du code GUI utilisable pour Forge 1.6.4 (MCPC+, Java 7).

## 🎯 Objectif

Ce projet fournit des outils pour :
- Analyser les spritesheets GUI PNG de Minecraft
- Extraire automatiquement les sprites individuels
- Générer du code Java 7 compatible avec Forge 1.6.4
- Créer des interfaces utilisateur avec support 9-slice et états multiples

## 🛠️ Fonctionnalités

### Outils MCP disponibles

1. **analyze_gui_spritesheet** - Analyse une spritesheet PNG et génère un atlas.json
2. **export_slices** - Exporte les sprites découpés ou un atlas packé
3. **generate_java_gui** - Génère du code Java 7 pour Forge 1.6.4
4. **preview_layout** - Crée une prévisualisation PNG du layout GUI

## 📦 Stack Technique

- **Serveur** : Node.js + TypeScript
- **Analyse d'images** : Sharp + algorithmes de segmentation
- **Code généré** : Java 7 strict, APIs Forge 1.6.4
- **Rendu** : Tessellator pour UVs flexibles (non-256×256)

## 🚀 Installation

```bash
cd server
npm install
npm run build
npm start
```

## 📂 Structure du Projet

```
mcp-minecraft-gui/
├─ README.md
├─ server/
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ src/
│      ├─ index.ts
│      └─ tools/
│          ├─ analyze_gui_spritesheet.ts
│          ├─ export_slices.ts
│          ├─ generate_java_gui.ts
│          └─ preview_layout.ts
├─ java-output-example/
│  └─ your/package/gui/
│      ├─ AtlasUVs.java
│      ├─ GuiDraw164.java
│      ├─ AtlasButton164.java
│      └─ GuiMainMenu164.java
└─ atlas-examples/
   ├─ main_menu.png
   └─ atlas.json
```

## ✅ Exigences

- Java 7 uniquement (pas de lambdas, streams, ou syntaxe post-1.8)
- APIs Forge 1.6.4 uniquement (compatible MCPC+)
- Rendu avec Tessellator pour textures non-256×256
- Pixel-art net (GL_NEAREST)

## 📖 Utilisation

Voir les exemples dans `atlas-examples/` et `java-output-example/` pour comprendre l'utilisation des outils générés.