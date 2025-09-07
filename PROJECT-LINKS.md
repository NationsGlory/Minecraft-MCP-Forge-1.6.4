# 🔗 Liens du Projet MCP Minecraft GUI

## 🌐 **Liens Principaux**

### **Serveur Live** (Principal)
```
https://minecraft.mcp.coupaul.fr
```
- ✅ Serveur MCP en ligne
- ✅ Domaine personnalisé professionnel
- ✅ Endpoints de test disponibles

### **GitHub Repository** (Source)
```
https://github.com/coupaul/Minecraft-MCP-Forge-1.6.4
```
- ✅ Code source complet
- ✅ Documentation détaillée
- ✅ Issues et discussions

### **Smithery.ai** (Publication MCP)
```
https://smithery.ai/@coupaul/mcp-minecraft-gui
```
- ✅ Publication officielle MCP
- ✅ Découverte par la communauté
- ✅ Intégration avec les clients MCP

## 🎯 **Endpoints Spécifiques**

### **Santé du Serveur**
```
https://minecraft.mcp.coupaul.fr/health
```
- Vérification du statut du serveur
- Informations de version et timestamp

### **Métadonnées MCP**
```
https://minecraft.mcp.coupaul.fr/mcp/info
```
- Informations sur le serveur MCP
- Liste des outils disponibles
- Capacités du serveur

### **Outils MCP**
```
https://minecraft.mcp.coupaul.fr/mcp/tools
```
- Documentation des outils
- Schémas d'entrée
- Exemples d'utilisation

## 🧪 **Tests Rapides**

### **Test de Santé**
```bash
curl https://minecraft.mcp.coupaul.fr/health
```

### **Test Métadonnées**
```bash
curl https://minecraft.mcp.coupaul.fr/mcp/info
```

### **Test Outils**
```bash
curl https://minecraft.mcp.coupaul.fr/mcp/tools
```

## 📊 **Réponses Attendues**

### **Santé**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "service": "mcp-minecraft-gui"
}
```

### **Métadonnées MCP**
```json
{
  "name": "mcp-minecraft-gui",
  "version": "1.0.0",
  "description": "MCP server pour analyser les spritesheets GUI Minecraft",
  "tools": [
    "analyze_gui_spritesheet",
    "export_slices", 
    "generate_java_gui",
    "preview_layout"
  ]
}
```

## 🎨 **Liens pour la Promotion**

### **Réseaux Sociaux**
- **Twitter/X** : "Nouveau serveur MCP Minecraft ! 🎮 https://minecraft.mcp.coupaul.fr"
- **Reddit** : r/Minecraft, r/feedthebeast
- **Discord** : Communautés Minecraft/Modding

### **Communautés**
- **MCP Community** : Partagez sur les forums MCP
- **Minecraft Modding** : Communautés de développement
- **GitHub** : Star et fork le projet

## 🔧 **Configuration MCP**

### **Pour Cursor**
```json
{
  "mcpServers": {
    "minecraft-gui": {
      "command": "npx",
      "args": ["-y", "@coupaul/mcp-minecraft-gui"],
      "env": {
        "MCP_SERVER_URL": "https://minecraft.mcp.coupaul.fr"
      }
    }
  }
}
```

### **Pour d'autres clients MCP**
```json
{
  "server": "https://minecraft.mcp.coupaul.fr",
  "name": "mcp-minecraft-gui",
  "version": "1.0.0"
}
```

## 📚 **Documentation**

### **Guides Complets**
- **Déploiement** : [RAILWAY-DEPLOYMENT.md](RAILWAY-DEPLOYMENT.md)
- **Publication Smithery** : [SMITHERY-PUBLICATION.md](SMITHERY-PUBLICATION.md)
- **Utilisation** : [DOCUMENTATION.md](DOCUMENTATION.md)

### **Dépannage**
- **Railway** : [RAILWAY-TROUBLESHOOTING.md](RAILWAY-TROUBLESHOOTING.md)
- **Nix Error** : [RAILWAY-NIX-ERROR.md](RAILWAY-NIX-ERROR.md)

## 🎯 **Utilisation Recommandée**

### **Pour les Développeurs**
1. **GitHub** : Code source et documentation
2. **Serveur Live** : Test des endpoints
3. **Smithery** : Intégration dans les projets

### **Pour les Utilisateurs**
1. **Smithery** : Installation et utilisation
2. **Serveur Live** : Test des outils
3. **GitHub README** : Guide rapide

---

**🎉 Votre serveur MCP Minecraft GUI est maintenant accessible via le domaine personnalisé https://minecraft.mcp.coupaul.fr !**
