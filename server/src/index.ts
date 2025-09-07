#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';
import { analyzeGuiSpritesheet } from './tools/analyze_gui_spritesheet.js';
import { exportSlices } from './tools/export_slices.js';
import { generateJavaGui } from './tools/generate_java_gui.js';
import { previewLayout } from './tools/preview_layout.js';

interface Tool {
  name: string;
  description: string;
  inputSchema: any;
}

const tools: Tool[] = [
  {
    name: 'analyze_gui_spritesheet',
    description: 'Analyse une spritesheet GUI PNG et génère un atlas.json avec les sprites détectés',
    inputSchema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          description: 'Chemin vers le fichier PNG de la spritesheet GUI'
        },
        hints: {
          type: 'object',
          description: 'Indices optionnels pour l\'analyse (taille minimale, espacement, etc.)',
          properties: {
            minSpriteSize: { type: 'number', description: 'Taille minimale d\'un sprite en pixels' },
            maxSprites: { type: 'number', description: 'Nombre maximum de sprites à détecter' },
            detectStates: { type: 'boolean', description: 'Détecter automatiquement les états (hover, pressed, etc.)' }
          }
        }
      },
      required: ['image']
    }
  },
  {
    name: 'export_slices',
    description: 'Exporte les sprites découpés ou crée un atlas packé avec mapping',
    inputSchema: {
      type: 'object',
      properties: {
        atlas: {
          type: 'string',
          description: 'Chemin vers le fichier atlas.json généré'
        },
        packing: {
          type: 'object',
          description: 'Options de packing pour l\'export',
          properties: {
            outputDir: { type: 'string', description: 'Dossier de sortie pour les sprites' },
            packMode: { 
              type: 'string', 
              enum: ['individual', 'atlas'],
              description: 'Mode d\'export: individual (fichiers séparés) ou atlas (fichier packé)'
            },
            maxAtlasSize: { type: 'number', description: 'Taille maximale de l\'atlas en pixels' }
          }
        }
      },
      required: ['atlas']
    }
  },
  {
    name: 'generate_java_gui',
    description: 'Génère du code Java 7 compatible avec Forge 1.6.4',
    inputSchema: {
      type: 'object',
      properties: {
        atlas: {
          type: 'string',
          description: 'Chemin vers le fichier atlas.json'
        },
        target: {
          type: 'string',
          description: 'Version cible (forge-1.6.4)',
          default: 'forge-1.6.4'
        },
        package: {
          type: 'string',
          description: 'Package Java pour les classes générées'
        },
        screenName: {
          type: 'string',
          description: 'Nom de la classe d\'écran principale'
        }
      },
      required: ['atlas', 'package', 'screenName']
    }
  },
  {
    name: 'preview_layout',
    description: 'Crée une prévisualisation PNG du layout GUI avec les sprites extraits',
    inputSchema: {
      type: 'object',
      properties: {
        atlas: {
          type: 'string',
          description: 'Chemin vers le fichier atlas.json'
        },
        layout: {
          type: 'object',
          description: 'Configuration du layout pour la prévisualisation',
          properties: {
            width: { type: 'number', description: 'Largeur de la prévisualisation' },
            height: { type: 'number', description: 'Hauteur de la prévisualisation' },
            showBounds: { type: 'boolean', description: 'Afficher les bordures des sprites' },
            showLabels: { type: 'boolean', description: 'Afficher les noms des sprites' }
          }
        }
      },
      required: ['atlas']
    }
  }
];

// Configuration Railway
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Serveur Express pour Railway (métadonnées et santé)
const app = express();
app.use(cors());
app.use(express.json());

// Route de santé pour Railway
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'mcp-minecraft-gui'
  });
});

// Métadonnées du serveur MCP
app.get('/mcp/info', (req, res) => {
  res.json({
    name: 'mcp-minecraft-gui',
    version: '1.0.0',
    description: 'MCP server pour analyser les spritesheets GUI Minecraft et générer du code Java 7 pour Forge 1.6.4',
    author: 'coupaul',
    repository: 'https://github.com/coupaul/Minecraft-MCP-Forge-1.6.4',
    homepage: 'https://smithery.ai/@coupaul/mcp-minecraft-gui',
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description
    })),
    capabilities: {
      tools: {},
    }
  });
});

// Documentation des outils
app.get('/mcp/tools', (req, res) => {
  res.json({
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }))
  });
});

// Route racine avec informations
app.get('/', (req, res) => {
  res.json({
    message: 'MCP Minecraft GUI Server',
    version: '1.0.0',
    description: 'Serveur MCP pour analyser les spritesheets GUI Minecraft',
    endpoints: {
      health: '/health',
      mcpInfo: '/mcp/info',
      tools: '/mcp/tools'
    },
    usage: {
      mcp: 'Utilisez ce serveur avec un client MCP compatible',
      railway: 'Déployé sur Railway',
      smithery: 'Disponible sur Smithery.ai'
    }
  });
});

// Fonction principale MCP
async function createMCPServer() {
  const server = new Server(
    {
      name: 'mcp-minecraft-gui',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Liste des outils disponibles
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // Gestion des appels d'outils
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'analyze_gui_spritesheet':
          return await analyzeGuiSpritesheet(args);
        
        case 'export_slices':
          return await exportSlices(args);
        
        case 'generate_java_gui':
          return await generateJavaGui(args);
        
        case 'preview_layout':
          return await previewLayout(args);
        
        default:
          throw new Error(`Outil inconnu: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Erreur lors de l'exécution de ${name}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

async function main() {
  // Démarrer le serveur Express pour Railway
  if (NODE_ENV === 'production') {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur HTTP démarré sur le port ${PORT}`);
      console.log(`📊 Métadonnées MCP disponibles sur http://localhost:${PORT}/mcp/info`);
    });
  }

  // Créer et démarrer le serveur MCP
  const mcpServer = await createMCPServer();
  
  // Utiliser stdio transport pour MCP
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  
  console.error('🎮 Serveur MCP Minecraft GUI démarré');
}

main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});