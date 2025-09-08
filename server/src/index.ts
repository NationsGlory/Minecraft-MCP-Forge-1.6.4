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
    description: 'Analyse une spritesheet GUI PNG et génère un atlas.json avec les sprites détectés pour Minecraft MCPC+ 1.6.4',
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
    description: 'Exporte les sprites découpés ou crée un atlas packé avec mapping pour Minecraft MCPC+ 1.6.4',
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
    description: 'Génère du code Java 7 compatible avec Minecraft MCPC+ 1.6.4 (Forge)',
    inputSchema: {
      type: 'object',
      properties: {
        atlas: {
          type: 'string',
          description: 'Chemin vers le fichier atlas.json'
        },
        target: {
          type: 'string',
          description: 'Version cible (mcpc-1.6.4)',
          default: 'mcpc-1.6.4'
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
    description: 'Crée une prévisualisation PNG du layout GUI avec les sprites extraits pour Minecraft MCPC+ 1.6.4',
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

// Route de santé pour Railway et MCP Hub
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'mcp-minecraft-mcpc-1.6.4',
    description: 'MCP Server pour le développement Minecraft MCPC+ 1.6.4',
    mcpHubCompatible: true
  });
});

// Métadonnées du serveur MCP
app.get('/mcp/info', (req, res) => {
  res.json({
    name: 'mcp-minecraft-mcpc-1.6.4',
    version: '1.0.0',
    description: 'MCP server pour le développement Minecraft MCPC+ 1.6.4 (GUI, mods, outils)',
    author: 'coupaul',
    repository: 'https://github.com/coupaul/Minecraft-MCP-Forge-1.6.4',
    homepage: 'https://minecraft.mcp.coupaul.fr',
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description
    })),
    capabilities: {
      tools: {},
    },
    mcpHubCompatible: true
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

// Endpoint /api/tools pour MCP Hub Central
app.get('/api/tools', (req, res) => {
  res.json({
    success: true,
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      category: 'minecraft-mcpc-1.6.4',
      version: '1.0.0'
    }))
  });
});

// Endpoint MCP principal pour MCP Hub Central
app.post('/mcp', async (req, res) => {
  try {
    const { method, params } = req.body;
    
    if (method === 'tools/list') {
      res.json({
        jsonrpc: '2.0',
        id: req.body.id || null,
        result: {
          tools: tools.map(tool => ({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema
          }))
        }
      });
    } else if (method === 'tools/call') {
      const { name, arguments: args } = params;
      
      let result;
      switch (name) {
        case 'analyze_gui_spritesheet':
          result = await analyzeGuiSpritesheet(args as { image: string; hints?: any });
          break;
        case 'export_slices':
          result = await exportSlices(args as { atlas: string; packing?: any });
          break;
        case 'generate_java_gui':
          result = await generateJavaGui(args as { atlas: string; target?: string; package: string; screenName: string });
          break;
        case 'preview_layout':
          result = await previewLayout(args as { atlas: string; layout?: any });
          break;
        default:
          throw new Error(`Outil inconnu: ${name}`);
      }
      
      res.json({
        jsonrpc: '2.0',
        id: req.body.id || null,
        result
      });
    } else {
      res.status(400).json({
        jsonrpc: '2.0',
        id: req.body.id || null,
        error: {
          code: -32601,
          message: 'Méthode non trouvée'
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body.id || null,
      error: {
        code: -32603,
        message: 'Erreur interne',
        data: error instanceof Error ? error.message : String(error)
      }
    });
  }
});

// Configuration MCP pour MCP Hub Central
app.get('/.well-known/mcp-config', (req, res) => {
  res.json({
    name: 'mcp-minecraft-mcpc-1.6.4',
    version: '1.0.0',
    description: 'MCP server pour le développement Minecraft MCPC+ 1.6.4 (GUI, mods, outils)',
    author: 'coupaul',
    license: 'MIT',
    homepage: 'https://minecraft.mcp.coupaul.fr',
    repository: 'https://github.com/coupaul/Minecraft-MCP-Forge-1.6.4',
    capabilities: {
      tools: true,
      resources: false,
      prompts: false
    },
    endpoints: {
      health: '/health',
      tools: '/api/tools',
      mcp: '/mcp',
      config: '/.well-known/mcp-config'
    },
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      category: 'minecraft-mcpc-1.6.4'
    })),
    mcpHubCompatible: true
  });
});

// Route racine avec informations
app.get('/', (req, res) => {
  res.json({
    message: 'MCP Minecraft MCPC+ 1.6.4 Server',
    version: '1.0.0',
    description: 'Serveur MCP pour le développement Minecraft MCPC+ 1.6.4 (GUI, mods, outils)',
    mcpHubCompatible: true,
    endpoints: {
      health: '/health',
      mcpInfo: '/mcp/info',
      tools: '/mcp/tools',
      apiTools: '/api/tools',
      mcp: '/mcp',
      config: '/.well-known/mcp-config'
    },
    usage: {
      mcp: 'Utilisez ce serveur avec un client MCP compatible',
      mcpHub: 'Compatible avec MCP Hub Central',
      railway: 'Déployé sur Railway',
      smithery: 'Disponible sur Smithery.ai'
    }
  });
});

// Endpoint POST pour Smithery
app.post('/', (req, res) => {
  res.json({
    message: 'MCP Minecraft MCPC+ 1.6.4 Server',
    version: '1.0.0',
    description: 'Serveur MCP pour le développement Minecraft MCPC+ 1.6.4 (GUI, mods, outils)',
    mcpHubCompatible: true,
    smitheryCompatible: true,
    endpoints: {
      health: '/health',
      mcpInfo: '/mcp/info',
      tools: '/mcp/tools',
      apiTools: '/api/tools',
      mcp: '/mcp',
      config: '/.well-known/mcp-config'
    },
    usage: {
      mcp: 'Utilisez ce serveur avec un client MCP compatible',
      mcpHub: 'Compatible avec MCP Hub Central',
      railway: 'Déployé sur Railway',
      smithery: 'Disponible sur Smithery.ai'
    }
  });
});

// Fonction principale MCP
async function createMCPServer() {
  const server = new Server(
    {
      name: 'mcp-minecraft-mcpc-1.6.4',
      version: '1.0.0',
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
          return await analyzeGuiSpritesheet(args as { image: string; hints?: any });
        
        case 'export_slices':
          return await exportSlices(args as { atlas: string; packing?: any });
        
        case 'generate_java_gui':
          return await generateJavaGui(args as { atlas: string; target?: string; package: string; screenName: string });
        
        case 'preview_layout':
          return await previewLayout(args as { atlas: string; layout?: any });
        
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
      console.error(`🚀 Serveur HTTP démarré sur le port ${PORT}`);
      console.error('');
      console.error('📊 Endpoints MCP Hub Central disponibles :');
      console.error('   • /health - Health check');
      console.error('   • /api/tools - Liste des outils MCP');
      console.error('   • /mcp - Endpoint MCP principal (JSON-RPC 2.0)');
      console.error('   • /.well-known/mcp-config - Configuration MCP');
      console.error('');
      console.error('📊 Endpoints supplémentaires :');
      console.error('   • /mcp/info - Métadonnées du serveur');
      console.error('   • /mcp/tools - Documentation des outils');
      console.error('   • / (GET/POST) - Page d\'accueil avec informations');
    });
  }

  // Créer et démarrer le serveur MCP
  const mcpServer = await createMCPServer();
  
  // Utiliser stdio transport pour MCP
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  
  console.error('🎮 Serveur MCP Minecraft MCPC+ 1.6.4 démarré');
}

main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});// Fonction pour Smithery - Créer le serveur MCP
export function create_server() {
  return createMCPServer;
}
