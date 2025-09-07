#!/bin/bash

echo "🚀 Déploiement MCP Minecraft GUI sur Railway"
echo "============================================="

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

# Vérifier si Railway CLI est installé
if command -v railway &> /dev/null; then
    echo "🚂 Railway CLI détecté"
    echo ""
    echo "📋 Options de déploiement :"
    echo "1. Déployer via Railway CLI"
    echo "2. Déployer via interface web Railway"
    echo "3. Préparer pour déploiement manuel"
    echo ""
    read -p "Choisissez une option (1-3) : " choice
    
    case $choice in
        1)
            echo "🚀 Déploiement via Railway CLI..."
            railway login
            railway init
            railway up
            ;;
        2)
            echo "🌐 Déploiement via interface web..."
            echo "1. Allez sur https://railway.app"
            echo "2. Créez un nouveau projet"
            echo "3. Connectez votre repository GitHub"
            echo "4. Sélectionnez le dossier 'server'"
            echo "5. Configurez les variables d'environnement"
            echo "6. Déployez !"
            ;;
        3)
            echo "📋 Préparation pour déploiement manuel..."
            echo "Le projet est prêt pour le déploiement Railway."
            ;;
        *)
            echo "❌ Option invalide"
            exit 1
            ;;
    esac
else
    echo "⚠️  Railway CLI non installé"
    echo ""
    echo "📋 Pour installer Railway CLI :"
    echo "npm install -g @railway/cli"
    echo ""
    echo "🌐 Ou utilisez l'interface web Railway :"
    echo "1. Allez sur https://railway.app"
    echo "2. Créez un nouveau projet"
    echo "3. Connectez votre repository GitHub"
    echo "4. Sélectionnez le dossier 'server'"
    echo "5. Configurez les variables d'environnement :"
    echo "   - PORT=3000"
    echo "   - NODE_ENV=production"
    echo "   - MCP_SERVER_NAME=mcp-minecraft-gui"
    echo "6. Déployez !"
fi

echo ""
echo "📊 Vérification du déploiement :"
echo "Une fois déployé, testez ces endpoints :"
echo "- /health : Santé du service"
echo "- /mcp/info : Métadonnées MCP"
echo "- /mcp/tools : Liste des outils"
echo ""
echo "📖 Documentation complète :"
echo "- Railway : RAILWAY-DEPLOYMENT.md"
echo "- Smithery : SMITHERY-README.md"
echo "- Métadonnées : smithery-metadata.json"
echo ""
echo ""
echo "🚨 IMPORTANT - Configuration Railway :"
echo "Si Railway échoue avec 'Nixpacks build failed', utilisez ces fichiers :"
echo "- railway.json : Configuration Railway principale"
echo "- nixpacks.toml : Configuration Nixpacks détaillée"
echo "- package.json : Package.json racine avec scripts"
echo ""
echo "📋 Actions recommandées :"
echo "1. Redéployez dans Railway (utilisera les nouveaux fichiers)"
echo "2. Ou changez 'Root Directory' vers 'server' dans Railway"
echo "3. Ou créez un nouveau service Railway"
echo ""
echo "🎉 Déploiement Railway préparé avec succès !"
