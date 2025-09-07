import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface SpriteBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SpriteState {
  name: string;
  bounds: SpriteBounds;
  nineSlice?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

interface Sprite {
  name: string;
  states: SpriteState[];
  category: 'button' | 'panel' | 'icon' | 'background' | 'other';
}

interface AtlasData {
  sourceImage: string;
  imageWidth: number;
  imageHeight: number;
  sprites: Sprite[];
  metadata: {
    generatedAt: string;
    version: string;
    totalSprites: number;
  };
}

interface AnalysisHints {
  minSpriteSize?: number;
  maxSprites?: number;
  detectStates?: boolean;
}

/**
 * Trouve les composants connectés dans une image binaire
 */
function findConnectedComponents(binaryData: Uint8Array, width: number, height: number): SpriteBounds[] {
  const visited = new Array(width * height).fill(false);
  const components: SpriteBounds[] = [];

  function floodFill(startX: number, startY: number): SpriteBounds | null {
    const stack = [{ x: startX, y: startY }];
    let minX = startX, maxX = startX;
    let minY = startY, maxY = startY;

    while (stack.length > 0) {
      const { x, y } = stack.pop()!;
      const index = y * width + x;

      if (x < 0 || x >= width || y < 0 || y >= height || visited[index] || binaryData[index] === 0) {
        continue;
      }

      visited[index] = true;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      // Ajouter les pixels voisins
      stack.push(
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 }
      );
    }

    const width_ = maxX - minX + 1;
    const height_ = maxY - minY + 1;

    if (width_ > 0 && height_ > 0) {
      return { x: minX, y: minY, width: width_, height: height_ };
    }

    return null;
  }

  // Parcourir l'image pour trouver tous les composants
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (!visited[index] && binaryData[index] > 0) {
        const component = floodFill(x, y);
        if (component) {
          components.push(component);
        }
      }
    }
  }

  return components;
}

/**
 * Détecte les états multiples d'un sprite (normal, hover, pressed, etc.)
 */
function detectSpriteStates(components: SpriteBounds[], imageWidth: number, imageHeight: number): Sprite[] {
  const sprites: Sprite[] = [];
  const processed = new Set<string>();

  for (const component of components) {
    const key = `${component.x},${component.y}`;
    if (processed.has(key)) continue;

    // Grouper les composants similaires par taille et alignement
    const similarComponents = components.filter(c => 
      Math.abs(c.width - component.width) <= 2 &&
      Math.abs(c.height - component.height) <= 2 &&
      (c.y === component.y || Math.abs(c.y - component.y) <= component.height)
    );

    if (similarComponents.length > 0) {
      const states: SpriteState[] = similarComponents.map((comp, index) => ({
        name: index === 0 ? 'normal' : 
              index === 1 ? 'hover' : 
              index === 2 ? 'pressed' : 
              `state_${index}`,
        bounds: comp
      }));

      // Détecter les marges 9-slice pour les panneaux
      const isPanel = component.width > 32 && component.height > 32;
      if (isPanel && states.length > 0) {
        states[0].nineSlice = {
          top: Math.min(4, Math.floor(component.height / 4)),
          right: Math.min(4, Math.floor(component.width / 4)),
          bottom: Math.min(4, Math.floor(component.height / 4)),
          left: Math.min(4, Math.floor(component.width / 4))
        };
      }

      sprites.push({
        name: `sprite_${sprites.length + 1}`,
        states,
        category: isPanel ? 'panel' : 
                 component.width <= 16 && component.height <= 16 ? 'icon' :
                 component.width > 64 || component.height > 64 ? 'background' : 'button'
      });

      // Marquer tous les composants similaires comme traités
      similarComponents.forEach(c => processed.add(`${c.x},${c.y}`));
    }
  }

  return sprites;
}

/**
 * Analyse une spritesheet GUI et génère un atlas.json
 */
export async function analyzeGuiSpritesheet(args: { image: string; hints?: AnalysisHints }): Promise<any> {
  const { image, hints = {} } = args;
  
  try {
    // Charger l'image avec Sharp
    const imageBuffer = await sharp(image).raw().toBuffer();
    const metadata = await sharp(image).metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Impossible de lire les dimensions de l\'image');
    }

    const { width, height } = metadata;
    
    // Créer une image binaire basée sur l'alpha
    const binaryData = new Uint8Array(width * height);
    for (let i = 0; i < imageBuffer.length; i += 4) {
      const alpha = imageBuffer[i + 3];
      binaryData[i / 4] = alpha > 0 ? 255 : 0;
    }

    // Trouver les composants connectés
    let components = findConnectedComponents(binaryData, width, height);
    
    // Filtrer par taille minimale si spécifiée
    if (hints.minSpriteSize) {
      components = components.filter(c => 
        c.width >= hints.minSpriteSize! && c.height >= hints.minSpriteSize!
      );
    }

    // Limiter le nombre de sprites si spécifié
    if (hints.maxSprites && components.length > hints.maxSprites) {
      components = components.slice(0, hints.maxSprites);
    }

    // Détecter les états des sprites
    const sprites = detectSpriteStates(components, width, height);

    // Créer l'atlas
    const atlas: AtlasData = {
      sourceImage: image,
      imageWidth: width,
      imageHeight: height,
      sprites,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        totalSprites: sprites.length
      }
    };

    // Sauvegarder l'atlas
    const atlasPath = image.replace(/\.(png|jpg|jpeg)$/i, '_atlas.json');
    writeFileSync(atlasPath, JSON.stringify(atlas, null, 2));

    return {
      content: [
        {
          type: 'text',
          text: `✅ Analyse terminée !\n\n` +
                `📊 Résultats :\n` +
                `- ${sprites.length} sprites détectés\n` +
                `- Image source : ${width}x${height} pixels\n` +
                `- Atlas sauvegardé : ${atlasPath}\n\n` +
                `🎯 Sprites détectés :\n` +
                sprites.map(s => 
                  `- ${s.name} (${s.category}) : ${s.states.length} état(s)`
                ).join('\n')
        }
      ]
    };

  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Erreur lors de l'analyse : ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
}
