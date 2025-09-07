#!/bin/bash

echo "🚀 Test du serveur MCP Minecraft GUI"
echo "=================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "server/package.json" ]; then
    echo "❌ Erreur : package.json non trouvé. Assurez-vous d'être dans le répertoire racine du projet."
    exit 1
fi

# Aller dans le dossier server
cd server

echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "🔨 Compilation TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la compilation"
    exit 1
fi

echo "✅ Compilation réussie !"
echo ""
echo "🎯 Le serveur MCP est prêt à être utilisé."
echo ""
echo "📋 Pour démarrer le serveur :"
echo "   cd server && npm start"
echo ""
echo "📋 Pour utiliser avec Cursor :"
echo "   Ajoutez le contenu de mcp-config.json à votre configuration MCP"
echo ""
echo "📖 Documentation complète disponible dans DOCUMENTATION.md"
echo ""
echo "🎉 Projet MCP Minecraft GUI créé avec succès !"
