import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

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

interface LayoutOptions {
  width?: number;
  height?: number;
  showBounds?: boolean;
  showLabels?: boolean;
}

/**
 * Crée une prévisualisation PNG du layout GUI
 */
export async function previewLayout(args: { 
  atlas: string; 
  layout?: LayoutOptions 
}): Promise<any> {
  const { atlas, layout = {} } = args;
  
  try {
    // Charger l'atlas
    const atlasData: AtlasData = JSON.parse(readFileSync(atlas, 'utf-8'));
    
    const previewWidth = layout.width || 800;
    const previewHeight = layout.height || 600;
    const showBounds = layout.showBounds !== false;
    const showLabels = layout.showLabels !== false;
    
    // Créer l'image de prévisualisation
    const previewImage = sharp({
      create: {
        width: previewWidth,
        height: previewHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    });
    
    // Charger l'image source pour extraire les sprites
    const sourceImage = sharp(atlasData.sourceImage);
    
    // Calculer la disposition des sprites
    const layoutSprites = calculateLayout(atlasData.sprites, previewWidth, previewHeight);
    
    // Créer les composites pour chaque sprite
    const composites = [];
    
    for (const layoutSprite of layoutSprites) {
      const sprite = layoutSprite.sprite;
      const state = layoutSprite.state;
      const layoutPos = layoutSprite.layoutPosition;
      
      // Extraire le sprite de l'image source
      const spriteImage = await sourceImage
        .extract({
          left: state.bounds.x,
          top: state.bounds.y,
          width: state.bounds.width,
          height: state.bounds.height
        })
        .png()
        .toBuffer();
      
      // Ajouter le sprite à la prévisualisation
      composites.push({
        input: spriteImage,
        left: layoutPos.x,
        top: layoutPos.y
      });
      
      // Ajouter les bordures si demandé
      if (showBounds) {
        const borderColor = getCategoryColor(sprite.category);
        const borderImage = await createBorderImage(
          state.bounds.width, 
          state.bounds.height, 
          borderColor
        );
        
        composites.push({
          input: borderImage,
          left: layoutPos.x,
          top: layoutPos.y
        });
      }
      
      // Ajouter les labels si demandé
      if (showLabels) {
        const labelText = `${sprite.name}_${state.name}`;
        const labelImage = await createLabelImage(labelText, state.bounds.width);
        
        composites.push({
          input: labelImage,
          left: layoutPos.x,
          top: layoutPos.y + state.bounds.height + 2
        });
      }
    }
    
    // Générer la prévisualisation finale
    const previewPath = atlas.replace('_atlas.json', '_preview.png');
    await previewImage
      .composite(composites)
      .png()
      .toFile(previewPath);
    
    // Créer un rapport de layout
    const layoutReport = generateLayoutReport(atlasData, layoutSprites);
    const reportPath = atlas.replace('_atlas.json', '_layout_report.txt');
    writeFileSync(reportPath, layoutReport);
    
    return {
      content: [
        {
          type: 'text',
          text: `✅ Prévisualisation créée avec succès !\n\n` +
                `🖼️ Image de prévisualisation : ${basename(previewPath)}\n` +
                `📊 Rapport de layout : ${basename(reportPath)}\n` +
                `📐 Dimensions : ${previewWidth}x${previewHeight}\n\n` +
                `🎯 Sprites affichés :\n` +
                layoutSprites.map(ls => 
                  `- ${ls.sprite.name} (${ls.sprite.category}) : ${ls.state.name} à (${ls.layoutPosition.x}, ${ls.layoutPosition.y})`
                ).join('\n') + '\n\n' +
                `📋 Catégories détectées :\n` +
                getCategorySummary(atlasData.sprites)
        }
      ]
    };

  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Erreur lors de la création de la prévisualisation : ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
}

interface LayoutSprite {
  sprite: Sprite;
  state: SpriteState;
  layoutPosition: { x: number; y: number };
}

/**
 * Calcule la disposition des sprites dans la prévisualisation
 */
function calculateLayout(sprites: Sprite[], previewWidth: number, previewHeight: number): LayoutSprite[] {
  const layoutSprites: LayoutSprite[] = [];
  const margin = 10;
  const labelHeight = 20;
  
  let currentX = margin;
  let currentY = margin;
  let maxHeightInRow = 0;
  
  for (const sprite of sprites) {
    for (const state of sprite.states) {
      const spriteWidth = state.bounds.width;
      const spriteHeight = state.bounds.height;
      
      // Vérifier si le sprite rentre sur la ligne actuelle
      if (currentX + spriteWidth + margin > previewWidth) {
        // Passer à la ligne suivante
        currentX = margin;
        currentY += maxHeightInRow + margin + labelHeight;
        maxHeightInRow = 0;
      }
      
      // Vérifier si on a assez de place verticalement
      if (currentY + spriteHeight + labelHeight + margin > previewHeight) {
        // Réduire la taille des sprites pour qu'ils rentrent
        const scale = Math.min(
          (previewHeight - currentY - labelHeight - margin) / spriteHeight,
          0.5
        );
        
        if (scale > 0.1) {
          layoutSprites.push({
            sprite,
            state,
            layoutPosition: {
              x: currentX,
              y: currentY
            }
          });
          
          currentX += Math.floor(spriteWidth * scale) + margin;
          maxHeightInRow = Math.max(maxHeightInRow, Math.floor(spriteHeight * scale));
        }
        continue;
      }
      
      layoutSprites.push({
        sprite,
        state,
        layoutPosition: {
          x: currentX,
          y: currentY
        }
      });
      
      currentX += spriteWidth + margin;
      maxHeightInRow = Math.max(maxHeightInRow, spriteHeight);
    }
  }
  
  return layoutSprites;
}

/**
 * Retourne la couleur associée à une catégorie de sprite
 */
function getCategoryColor(category: string): { r: number; g: number; b: number; alpha: number } {
  switch (category) {
    case 'button': return { r: 255, g: 0, b: 0, alpha: 255 }; // Rouge
    case 'panel': return { r: 0, g: 255, b: 0, alpha: 255 }; // Vert
    case 'icon': return { r: 0, g: 0, b: 255, alpha: 255 }; // Bleu
    case 'background': return { r: 255, g: 255, b: 0, alpha: 255 }; // Jaune
    default: return { r: 128, g: 128, b: 128, alpha: 255 }; // Gris
  }
}

/**
 * Crée une image de bordure pour un sprite
 */
async function createBorderImage(width: number, height: number, color: { r: number; g: number; b: number; alpha: number }): Promise<Buffer> {
  const borderWidth = 2;
  
  // Créer une image avec juste les bordures
  const borderImage = sharp({
    create: {
      width: width + borderWidth * 2,
      height: height + borderWidth * 2,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  });
  
  // Dessiner les bordures (simplifié - en réalité il faudrait dessiner ligne par ligne)
  return await borderImage
    .composite([
      // Bordure supérieure
      {
        input: Buffer.from(Array(width * borderWidth * 4).fill(0).map((_, i) => 
          i % 4 === 0 ? color.r : 
          i % 4 === 1 ? color.g : 
          i % 4 === 2 ? color.b : color.alpha
        )),
        left: borderWidth,
        top: 0
      },
      // Bordure inférieure
      {
        input: Buffer.from(Array(width * borderWidth * 4).fill(0).map((_, i) => 
          i % 4 === 0 ? color.r : 
          i % 4 === 1 ? color.g : 
          i % 4 === 2 ? color.b : color.alpha
        )),
        left: borderWidth,
        top: height + borderWidth
      },
      // Bordure gauche
      {
        input: Buffer.from(Array(borderWidth * height * 4).fill(0).map((_, i) => 
          i % 4 === 0 ? color.r : 
          i % 4 === 1 ? color.g : 
          i % 4 === 2 ? color.b : color.alpha
        )),
        left: 0,
        top: borderWidth
      },
      // Bordure droite
      {
        input: Buffer.from(Array(borderWidth * height * 4).fill(0).map((_, i) => 
          i % 4 === 0 ? color.r : 
          i % 4 === 1 ? color.g : 
          i % 4 === 2 ? color.b : color.alpha
        )),
        left: width + borderWidth,
        top: borderWidth
      }
    ])
    .png()
    .toBuffer();
}

/**
 * Crée une image de label pour un sprite
 */
async function createLabelImage(text: string, spriteWidth: number): Promise<Buffer> {
  // Créer un label simple avec du texte
  const labelHeight = 20;
  const labelWidth = Math.min(spriteWidth, text.length * 8);
  
  const labelImage = sharp({
    create: {
      width: labelWidth,
      height: labelHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 128 }
    }
  });
  
  // Pour simplifier, on retourne juste une image de fond
  // En réalité, il faudrait utiliser une bibliothèque de rendu de texte
  return await labelImage.png().toBuffer();
}

/**
 * Génère un rapport de layout
 */
function generateLayoutReport(atlas: AtlasData, layoutSprites: LayoutSprite[]): string {
  let report = `Rapport de Layout GUI\n`;
  report += `========================\n\n`;
  report += `Image source : ${atlas.sourceImage}\n`;
  report += `Dimensions atlas : ${atlas.imageWidth}x${atlas.imageHeight}\n`;
  report += `Total sprites : ${atlas.sprites.length}\n`;
  report += `Total états : ${layoutSprites.length}\n\n`;
  
  report += `Catégories détectées :\n`;
  const categories = getCategorySummary(atlas.sprites);
  report += categories + '\n\n';
  
  report += `Détail des sprites :\n`;
  for (const sprite of atlas.sprites) {
    report += `\n${sprite.name} (${sprite.category}) :\n`;
    for (const state of sprite.states) {
      report += `  - ${state.name} : ${state.bounds.width}x${state.bounds.height} à (${state.bounds.x}, ${state.bounds.y})\n`;
      if (state.nineSlice) {
        report += `    * 9-slice : T=${state.nineSlice.top}, R=${state.nineSlice.right}, B=${state.nineSlice.bottom}, L=${state.nineSlice.left}\n`;
      }
    }
  }
  
  report += `\n\nDisposition dans la prévisualisation :\n`;
  for (const layoutSprite of layoutSprites) {
    report += `${layoutSprite.sprite.name}_${layoutSprite.state.name} : (${layoutSprite.layoutPosition.x}, ${layoutSprite.layoutPosition.y})\n`;
  }
  
  return report;
}

/**
 * Génère un résumé des catégories
 */
function getCategorySummary(sprites: Sprite[]): string {
  const categories = new Map<string, number>();
  
  for (const sprite of sprites) {
    const count = categories.get(sprite.category) || 0;
    categories.set(sprite.category, count + 1);
  }
  
  return Array.from(categories.entries())
    .map(([category, count]) => `- ${category} : ${count} sprite(s)`)
    .join('\n');
}
