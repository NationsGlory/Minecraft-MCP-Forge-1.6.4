#!/bin/bash

echo "🔍 Test de Configuration Railway"
echo "================================"

# Vérifier les fichiers de configuration
echo "📋 Vérification des fichiers de configuration :"

if [ -f "railway.json" ]; then
    echo "✅ railway.json - Présent"
else
    echo "❌ railway.json - Manquant"
fi

if [ -f "nixpacks.toml" ]; then
    echo "✅ nixpacks.toml - Présent"
else
    echo "❌ nixpacks.toml - Manquant"
fi

if [ -f "package.json" ]; then
    echo "✅ package.json (racine) - Présent"
else
    echo "❌ package.json (racine) - Manquant"
fi

if [ -f "server/package.json" ]; then
    echo "✅ server/package.json - Présent"
else
    echo "❌ server/package.json - Manquant"
fi

echo ""
echo "📁 Structure du projet :"
echo "├─ railway.json (configuration Railway)"
echo "├─ nixpacks.toml (configuration Nixpacks)"
echo "├─ package.json (scripts racine)"
echo "└─ server/"
echo "   ├─ package.json (dépendances)"
echo "   ├─ src/"
echo "   └─ dist/ (après build)"

echo ""
echo "🚀 Commandes de test local :"
echo "cd server && npm install && npm run build && npm start"

echo ""
echo "🌐 Test Railway (après déploiement) :"
echo "curl https://votre-projet.up.railway.app/health"
echo "curl https://votre-projet.up.railway.app/mcp/info"

echo ""
echo "📖 Documentation :"
echo "- RAILWAY-TROUBLESHOOTING.md : Dépannage Railway"
echo "- RAILWAY-DEPLOYMENT.md : Guide complet"
echo "- QUICK-DEPLOY.md : Commandes rapides"

echo ""
echo "✅ Configuration Railway prête !"
