import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';

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

interface PackingOptions {
  outputDir?: string;
  packMode?: 'individual' | 'atlas';
  maxAtlasSize?: number;
}

interface PackedSprite {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalBounds: SpriteBounds;
  state: string;
}

/**
 * Exporte les sprites individuellement
 */
async function exportIndividualSprites(
  atlas: AtlasData, 
  outputDir: string
): Promise<string[]> {
  const exportedFiles: string[] = [];
  
  // Créer le dossier de sortie s'il n'existe pas
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Charger l'image source
  const sourceImage = sharp(atlas.sourceImage);

  for (const sprite of atlas.sprites) {
    for (const state of sprite.states) {
      const filename = `${sprite.name}_${state.name}.png`;
      const filepath = join(outputDir, filename);

      // Découper le sprite
      await sourceImage
        .extract({
          left: state.bounds.x,
          top: state.bounds.y,
          width: state.bounds.width,
          height: state.bounds.height
        })
        .png()
        .toFile(filepath);

      exportedFiles.push(filepath);
    }
  }

  return exportedFiles;
}

/**
 * Pack les sprites dans un atlas optimisé
 */
async function packSpritesInAtlas(
  atlas: AtlasData,
  outputDir: string,
  maxAtlasSize: number = 1024
): Promise<{ atlasPath: string; mappingPath: string }> {
  
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Préparer les sprites à packer
  const spritesToPack: PackedSprite[] = [];
  
  for (const sprite of atlas.sprites) {
    for (const state of sprite.states) {
      spritesToPack.push({
        name: sprite.name,
        x: 0, // Sera calculé par l'algorithme de packing
        y: 0,
        width: state.bounds.width,
        height: state.bounds.height,
        originalBounds: state.bounds,
        state: state.name
      });
    }
  }

  // Algorithme de packing simple (bin packing)
  const packedSprites = packSprites(spritesToPack, maxAtlasSize);
  
  // Créer l'atlas packé
  const atlasWidth = Math.max(...packedSprites.map(s => s.x + s.width));
  const atlasHeight = Math.max(...packedSprites.map(s => s.y + s.height));
  
  const atlasImage = sharp({
    create: {
      width: atlasWidth,
      height: atlasHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  });

  // Charger l'image source
  const sourceImage = sharp(atlas.sourceImage);

  // Copier chaque sprite dans l'atlas
  const composites = [];
  for (const packedSprite of packedSprites) {
    const spriteImage = await sourceImage
      .extract({
        left: packedSprite.originalBounds.x,
        top: packedSprite.originalBounds.y,
        width: packedSprite.originalBounds.width,
        height: packedSprite.originalBounds.height
      })
      .png()
      .toBuffer();

    composites.push({
      input: spriteImage,
      left: packedSprite.x,
      top: packedSprite.y
    });
  }

  // Générer l'atlas final
  const atlasPath = join(outputDir, 'packed_atlas.png');
  await atlasImage
    .composite(composites)
    .png()
    .toFile(atlasPath);

  // Créer le mapping
  const mapping = {
    atlas: {
      width: atlasWidth,
      height: atlasHeight,
      image: 'packed_atlas.png'
    },
    sprites: packedSprites.map(s => ({
      name: s.name,
      state: s.state,
      x: s.x,
      y: s.y,
      width: s.width,
      height: s.height,
      originalBounds: s.originalBounds
    }))
  };

  const mappingPath = join(outputDir, 'packed_mapping.json');
  writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));

  return { atlasPath, mappingPath };
}

/**
 * Algorithme de bin packing simple
 */
function packSprites(sprites: PackedSprite[], maxSize: number): PackedSprite[] {
  // Trier par taille décroissante (meilleure utilisation de l'espace)
  const sortedSprites = [...sprites].sort((a, b) => 
    (b.width * b.height) - (a.width * a.height)
  );

  const packed: PackedSprite[] = [];
  const bins: { x: number; y: number; width: number; height: number }[] = [
    { x: 0, y: 0, width: maxSize, height: maxSize }
  ];

  for (const sprite of sortedSprites) {
    let placed = false;

    // Chercher un bin qui peut contenir ce sprite
    for (let i = 0; i < bins.length; i++) {
      const bin = bins[i];
      
      if (sprite.width <= bin.width && sprite.height <= bin.height) {
        // Placer le sprite
        sprite.x = bin.x;
        sprite.y = bin.y;
        packed.push(sprite);

        // Diviser le bin restant
        const remainingWidth = bin.width - sprite.width;
        const remainingHeight = bin.height - sprite.height;

        if (remainingWidth > 0 && remainingHeight > 0) {
          // Créer deux nouveaux bins
          bins.push({
            x: bin.x + sprite.width,
            y: bin.y,
            width: remainingWidth,
            height: sprite.height
          });
          bins.push({
            x: bin.x,
            y: bin.y + sprite.height,
            width: bin.width,
            height: remainingHeight
          });
        } else if (remainingWidth > 0) {
          bins.push({
            x: bin.x + sprite.width,
            y: bin.y,
            width: remainingWidth,
            height: bin.height
          });
        } else if (remainingHeight > 0) {
          bins.push({
            x: bin.x,
            y: bin.y + sprite.height,
            width: bin.width,
            height: remainingHeight
          });
        }

        // Supprimer le bin utilisé
        bins.splice(i, 1);
        placed = true;
        break;
      }
    }

    if (!placed) {
      console.warn(`Impossible de placer le sprite ${sprite.name} (${sprite.width}x${sprite.height})`);
    }
  }

  return packed;
}

/**
 * Exporte les sprites selon les options spécifiées
 */
export async function exportSlices(args: { atlas: string; packing?: PackingOptions }): Promise<any> {
  const { atlas, packing = {} } = args;
  
  try {
    // Charger l'atlas
    const atlasData: AtlasData = JSON.parse(readFileSync(atlas, 'utf-8'));
    
    const outputDir = packing.outputDir || './exported_sprites';
    const packMode = packing.packMode || 'individual';
    const maxAtlasSize = packing.maxAtlasSize || 1024;

    let result: any;

    if (packMode === 'individual') {
      const exportedFiles = await exportIndividualSprites(atlasData, outputDir);
      
      result = {
        content: [
          {
            type: 'text',
            text: `✅ Export individuel terminé !\n\n` +
                  `📁 Dossier de sortie : ${outputDir}\n` +
                  `📊 ${exportedFiles.length} fichiers exportés\n\n` +
                  `📋 Fichiers créés :\n` +
                  exportedFiles.map(f => `- ${basename(f)}`).join('\n')
          }
        ]
      };
    } else {
      const { atlasPath, mappingPath } = await packSpritesInAtlas(atlasData, outputDir, maxAtlasSize);
      
      result = {
        content: [
          {
            type: 'text',
            text: `✅ Atlas packé créé !\n\n` +
                  `📁 Dossier de sortie : ${outputDir}\n` +
                  `🖼️ Atlas : ${basename(atlasPath)}\n` +
                  `📋 Mapping : ${basename(mappingPath)}\n` +
                  `📊 ${atlasData.sprites.length} sprites packés`
          }
        ]
      };
    }

    return result;

  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Erreur lors de l'export : ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
}
