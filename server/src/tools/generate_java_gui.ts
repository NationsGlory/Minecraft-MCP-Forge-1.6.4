import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
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

/**
 * Génère la classe AtlasUVs.java avec les constantes UV
 */
function generateAtlasUVs(atlas: AtlasData, packageName: string): string {
  const className = 'AtlasUVs';
  
  let code = `package ${packageName}.gui;\n\n`;
  code += `/**\n`;
  code += ` * Constantes UV pour l'atlas GUI\n`;
  code += ` * Généré automatiquement depuis : ${atlas.sourceImage}\n`;
  code += ` * Dimensions de l'atlas : ${atlas.imageWidth}x${atlas.imageHeight}\n`;
  code += ` */\n`;
  code += `public class ${className} {\n\n`;
  
  code += `    // Dimensions de l'atlas\n`;
  code += `    public static final float ATLAS_WIDTH = ${atlas.imageWidth}f;\n`;
  code += `    public static final float ATLAS_HEIGHT = ${atlas.imageHeight}f;\n\n`;
  
  for (const sprite of atlas.sprites) {
    code += `    // ${sprite.name} (${sprite.category})\n`;
    
    for (const state of sprite.states) {
      const u1 = state.bounds.x / atlas.imageWidth;
      const v1 = state.bounds.y / atlas.imageHeight;
      const u2 = (state.bounds.x + state.bounds.width) / atlas.imageWidth;
      const v2 = (state.bounds.y + state.bounds.height) / atlas.imageHeight;
      
      const constantName = `${sprite.name.toUpperCase()}_${state.name.toUpperCase()}`;
      
      code += `    public static final float ${constantName}_U1 = ${u1.toFixed(6)}f;\n`;
      code += `    public static final float ${constantName}_V1 = ${v1.toFixed(6)}f;\n`;
      code += `    public static final float ${constantName}_U2 = ${u2.toFixed(6)}f;\n`;
      code += `    public static final float ${constantName}_V2 = ${v2.toFixed(6)}f;\n`;
      code += `    public static final int ${constantName}_WIDTH = ${state.bounds.width};\n`;
      code += `    public static final int ${constantName}_HEIGHT = ${state.bounds.height};\n`;
      
      if (state.nineSlice) {
        code += `    public static final int ${constantName}_SLICE_TOP = ${state.nineSlice.top};\n`;
        code += `    public static final int ${constantName}_SLICE_RIGHT = ${state.nineSlice.right};\n`;
        code += `    public static final int ${constantName}_SLICE_BOTTOM = ${state.nineSlice.bottom};\n`;
        code += `    public static final int ${constantName}_SLICE_LEFT = ${state.nineSlice.left};\n`;
      }
      
      code += `\n`;
    }
  }
  
  code += `}\n`;
  return code;
}

/**
 * Génère la classe GuiDraw164.java pour le rendu avec Tessellator
 */
function generateGuiDraw164(packageName: string): string {
  const className = 'GuiDraw164';
  
  let code = `package ${packageName}.gui;\n\n`;
  code += `import net.minecraft.client.gui.GuiScreen;\n`;
  code += `import net.minecraft.client.renderer.Tessellator;\n`;
  code += `import net.minecraft.client.renderer.OpenGlHelper;\n`;
  code += `import net.minecraft.util.ResourceLocation;\n`;
  code += `import org.lwjgl.opengl.GL11;\n\n`;
  
  code += `/**\n`;
  code += ` * Utilitaires de rendu GUI pour Forge 1.6.4\n`;
  code += ` * Utilise Tessellator pour un rendu flexible des UVs\n`;
  code += ` */\n`;
  code += `public class ${className} {\n\n`;
  
  code += `    private static Tessellator tessellator = Tessellator.instance;\n`;
  code += `    private static ResourceLocation currentTexture;\n\n`;
  
  code += `    /**\n`;
  code += `     * Définit la texture actuelle\n`;
  code += `     */\n`;
  code += `    public static void bindTexture(ResourceLocation texture) {\n`;
  code += `        currentTexture = texture;\n`;
  code += `        net.minecraft.client.Minecraft.getMinecraft().getTextureManager().bindTexture(texture);\n`;
  code += `    }\n\n`;
  
  code += `    /**\n`;
  code += `     * Dessine un sprite avec des UVs personnalisées\n`;
  code += `     */\n`;
  code += `    public static void drawSprite(int x, int y, int width, int height, \n`;
  code += `                               float u1, float v1, float u2, float v2) {\n`;
  code += `        if (currentTexture == null) {\n`;
  code += `            throw new IllegalStateException("Aucune texture liée. Appelez bindTexture() d'abord.");\n`;
  code += `        }\n\n`;
  code += `        GL11.glEnable(GL11.GL_BLEND);\n`;
  code += `        OpenGlHelper.glBlendFunc(770, 771, 1, 0);\n`;
  code += `        GL11.glColor4f(1.0F, 1.0F, 1.0F, 1.0F);\n\n`;
  code += `        tessellator.startDrawingQuads();\n`;
  code += `        tessellator.addVertexWithUV(x, y + height, 0.0D, u1, v2);\n`;
  code += `        tessellator.addVertexWithUV(x + width, y + height, 0.0D, u2, v2);\n`;
  code += `        tessellator.addVertexWithUV(x + width, y, 0.0D, u2, v1);\n`;
  code += `        tessellator.addVertexWithUV(x, y, 0.0D, u1, v1);\n`;
  code += `        tessellator.draw();\n`;
  code += `    }\n\n`;
  
  code += `    /**\n`;
  code += `     * Dessine un sprite avec 9-slice pour les panneaux scalables\n`;
  code += `     */\n`;
  code += `    public static void drawNineSlice(int x, int y, int width, int height,\n`;
  code += `                                  float u1, float v1, float u2, float v2,\n`;
  code += `                                  int sliceTop, int sliceRight, int sliceBottom, int sliceLeft) {\n`;
  code += `        if (currentTexture == null) {\n`;
  code += `            throw new IllegalStateException("Aucune texture liée. Appelez bindTexture() d'abord.");\n`;
  code += `        }\n\n`;
  code += `        GL11.glEnable(GL11.GL_BLEND);\n`;
  code += `        OpenGlHelper.glBlendFunc(770, 771, 1, 0);\n`;
  code += `        GL11.glColor4f(1.0F, 1.0F, 1.0F, 1.0F);\n\n`;
  code += `        // Calculer les dimensions des zones\n`;
  code += `        int centerWidth = width - sliceLeft - sliceRight;\n`;
  code += `        int centerHeight = height - sliceTop - sliceBottom;\n`;
  code += `        \n`;
  code += `        float centerU1 = u1 + (sliceLeft / AtlasUVs.ATLAS_WIDTH);\n`;
  code += `        float centerV1 = v1 + (sliceTop / AtlasUVs.ATLAS_HEIGHT);\n`;
  code += `        float centerU2 = u2 - (sliceRight / AtlasUVs.ATLAS_WIDTH);\n`;
  code += `        float centerV2 = v2 - (sliceBottom / AtlasUVs.ATLAS_HEIGHT);\n\n`;
  code += `        tessellator.startDrawingQuads();\n\n`;
  code += `        // Coin haut-gauche\n`;
  code += `        tessellator.addVertexWithUV(x, y + sliceTop, 0.0D, u1, centerV1);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop, 0.0D, centerU1, centerV1);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y, 0.0D, centerU1, v1);\n`;
  code += `        tessellator.addVertexWithUV(x, y, 0.0D, u1, v1);\n\n`;
  code += `        // Bord haut\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop, 0.0D, centerU1, centerV1);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop, 0.0D, centerU2, centerV1);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y, 0.0D, centerU2, v1);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y, 0.0D, centerU1, v1);\n\n`;
  code += `        // Coin haut-droit\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop, 0.0D, centerU2, centerV1);\n`;
  code += `        tessellator.addVertexWithUV(x + width, y + sliceTop, 0.0D, u2, centerV1);\n`;
  code += `        tessellator.addVertexWithUV(x + width, y, 0.0D, u2, v1);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y, 0.0D, centerU2, v1);\n\n`;
  code += `        // Bord gauche\n`;
  code += `        tessellator.addVertexWithUV(x, y + sliceTop + centerHeight, 0.0D, u1, centerV2);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop + centerHeight, 0.0D, centerU1, centerV2);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop, 0.0D, centerU1, centerV1);\n`;
  code += `        tessellator.addVertexWithUV(x, y + sliceTop, 0.0D, u1, centerV1);\n\n`;
  code += `        // Centre\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop + centerHeight, 0.0D, centerU1, centerV2);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop + centerHeight, 0.0D, centerU2, centerV2);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop, 0.0D, centerU2, centerV1);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop, 0.0D, centerU1, centerV1);\n\n`;
  code += `        // Bord droit\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop + centerHeight, 0.0D, centerU2, centerV2);\n`;
  code += `        tessellator.addVertexWithUV(x + width, y + sliceTop + centerHeight, 0.0D, u2, centerV2);\n`;
  code += `        tessellator.addVertexWithUV(x + width, y + sliceTop, 0.0D, u2, centerV1);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop, 0.0D, centerU2, centerV1);\n\n`;
  code += `        // Coin bas-gauche\n`;
  code += `        tessellator.addVertexWithUV(x, y + height, 0.0D, u1, v2);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y + height, 0.0D, centerU1, v2);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop + centerHeight, 0.0D, centerU1, centerV2);\n`;
  code += `        tessellator.addVertexWithUV(x, y + sliceTop + centerHeight, 0.0D, u1, centerV2);\n\n`;
  code += `        // Bord bas\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y + height, 0.0D, centerU1, v2);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + height, 0.0D, centerU2, v2);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop + centerHeight, 0.0D, centerU2, centerV2);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop + centerHeight, 0.0D, centerU1, centerV2);\n\n`;
  code += `        // Coin bas-droit\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + height, 0.0D, centerU2, v2);\n`;
  code += `        tessellator.addVertexWithUV(x + width, y + height, 0.0D, u2, v2);\n`;
  code += `        tessellator.addVertexWithUV(x + width, y + sliceTop + centerHeight, 0.0D, u2, centerV2);\n`;
  code += `        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop + centerHeight, 0.0D, centerU2, centerV2);\n\n`;
  code += `        tessellator.draw();\n`;
  code += `    }\n\n`;
  
  code += `    /**\n`;
  code += `     * Dessine un sprite avec états (normal, hover, pressed)\n`;
  code += `     */\n`;
  code += `    public static void drawSpriteWithState(int x, int y, int width, int height,\n`;
  code += `                                        float u1Normal, float v1Normal, float u2Normal, float v2Normal,\n`;
  code += `                                        float u1Hover, float v1Hover, float u2Hover, float v2Hover,\n`;
  code += `                                        float u1Pressed, float v1Pressed, float u2Pressed, float v2Pressed,\n`;
  code += `                                        boolean hovered, boolean pressed) {\n`;
  code += `        float u1, v1, u2, v2;\n`;
  code += `        \n`;
  code += `        if (pressed) {\n`;
  code += `            u1 = u1Pressed; v1 = v1Pressed; u2 = u2Pressed; v2 = v2Pressed;\n`;
  code += `        } else if (hovered) {\n`;
  code += `            u1 = u1Hover; v1 = v1Hover; u2 = u2Hover; v2 = v2Hover;\n`;
  code += `        } else {\n`;
  code += `            u1 = u1Normal; v1 = v1Normal; u2 = u2Normal; v2 = v2Normal;\n`;
  code += `        }\n`;
  code += `        \n`;
  code += `        drawSprite(x, y, width, height, u1, v1, u2, v2);\n`;
  code += `    }\n\n`;
  
  code += `}\n`;
  return code;
}

/**
 * Génère la classe AtlasButton164.java pour les boutons personnalisés
 */
function generateAtlasButton164(atlas: AtlasData, packageName: string): string {
  const className = 'AtlasButton164';
  
  let code = `package ${packageName}.gui;\n\n`;
  code += `import net.minecraft.client.gui.GuiButton;\n`;
  code += `import net.minecraft.client.renderer.OpenGlHelper;\n`;
  code += `import org.lwjgl.opengl.GL11;\n\n`;
  
  code += `/**\n`;
  code += ` * Bouton personnalisé utilisant l'atlas GUI\n`;
  code += ` * Supporte les états normal, hover et pressed\n`;
  code += ` */\n`;
  code += `public class ${className} extends GuiButton {\n\n`;
  
  code += `    private String spriteName;\n`;
  code += `    private boolean hasHoverState;\n`;
  code += `    private boolean hasPressedState;\n\n`;
  
  code += `    public ${className}(int id, int x, int y, String spriteName) {\n`;
  code += `        super(id, x, y, 0, 0, "");\n`;
  code += `        this.spriteName = spriteName;\n`;
  code += `        \n`;
  code += `        // Déterminer les dimensions et états disponibles\n`;
  code += `        updateSpriteInfo();\n`;
  code += `    }\n\n`;
  
  code += `    private void updateSpriteInfo() {\n`;
  code += `        // Cette méthode devrait être implémentée pour détecter les états disponibles\n`;
  code += `        // Pour l'instant, on utilise des valeurs par défaut\n`;
  code += `        this.width = 200;\n`;
  code += `        this.height = 20;\n`;
  code += `        this.hasHoverState = true;\n`;
  code += `        this.hasPressedState = true;\n`;
  code += `    }\n\n`;
  
  code += `    @Override\n`;
  code += `    public void drawButton(net.minecraft.client.Minecraft mc, int mouseX, int mouseY) {\n`;
  code += `        if (!this.visible) {\n`;
  code += `            return;\n`;
  code += `        }\n\n`;
  code += `        boolean hovered = mouseX >= this.xPosition && mouseY >= this.yPosition && \n`;
  code += `                          mouseX < this.xPosition + this.width && mouseY < this.yPosition + this.height;\n`;
  code += `        boolean pressed = hovered && net.minecraft.client.Minecraft.getMinecraft().gameSettings.keyBindAttack.isPressed();\n\n`;
  code += `        // Dessiner le sprite selon l'état\n`;
  code += `        drawSpriteState(hovered, pressed);\n`;
  code += `        \n`;
  code += `        // Dessiner le texte si présent\n`;
  code += `        if (this.displayString != null && !this.displayString.isEmpty()) {\n`;
  code += `            int textColor = hovered ? 0xFFFF00 : 0xFFFFFF;\n`;
  code += `            mc.fontRenderer.drawStringWithShadow(this.displayString, \n`;
  code += `                this.xPosition + (this.width - mc.fontRenderer.getStringWidth(this.displayString)) / 2,\n`;
  code += `                this.yPosition + (this.height - 8) / 2, textColor);\n`;
  code += `        }\n`;
  code += `    }\n\n`;
  
  code += `    private void drawSpriteState(boolean hovered, boolean pressed) {\n`;
  code += `        // Cette méthode devrait être générée dynamiquement selon les sprites disponibles\n`;
  code += `        // Pour l'instant, on utilise un exemple générique\n`;
  code += `        \n`;
  code += `        if (pressed && this.hasPressedState) {\n`;
  code += `            // Dessiner l'état pressed\n`;
  code += `            GuiDraw164.drawSprite(this.xPosition, this.yPosition, this.width, this.height,\n`;
  code += `                AtlasUVs.SPRITE_1_PRESSED_U1, AtlasUVs.SPRITE_1_PRESSED_V1,\n`;
  code += `                AtlasUVs.SPRITE_1_PRESSED_U2, AtlasUVs.SPRITE_1_PRESSED_V2);\n`;
  code += `        } else if (hovered && this.hasHoverState) {\n`;
  code += `            // Dessiner l'état hover\n`;
  code += `            GuiDraw164.drawSprite(this.xPosition, this.yPosition, this.width, this.height,\n`;
  code += `                AtlasUVs.SPRITE_1_HOVER_U1, AtlasUVs.SPRITE_1_HOVER_V1,\n`;
  code += `                AtlasUVs.SPRITE_1_HOVER_U2, AtlasUVs.SPRITE_1_HOVER_V2);\n`;
  code += `        } else {\n`;
  code += `            // Dessiner l'état normal\n`;
  code += `            GuiDraw164.drawSprite(this.xPosition, this.yPosition, this.width, this.height,\n`;
  code += `                AtlasUVs.SPRITE_1_NORMAL_U1, AtlasUVs.SPRITE_1_NORMAL_V1,\n`;
  code += `                AtlasUVs.SPRITE_1_NORMAL_U2, AtlasUVs.SPRITE_1_NORMAL_V2);\n`;
  code += `        }\n`;
  code += `    }\n\n`;
  
  code += `}\n`;
  return code;
}

/**
 * Génère un exemple d'écran GUI utilisant les classes générées
 */
function generateGuiMainMenu164(atlas: AtlasData, packageName: string, screenName: string): string {
  const className = screenName;
  
  let code = `package ${packageName}.gui;\n\n`;
  code += `import net.minecraft.client.gui.GuiScreen;\n`;
  code += `import net.minecraft.client.gui.GuiButton;\n`;
  code += `import net.minecraft.util.ResourceLocation;\n`;
  code += `import net.minecraft.client.Minecraft;\n\n`;
  
  code += `/**\n`;
  code += ` * Exemple d'écran GUI utilisant l'atlas généré\n`;
  code += ` * Généré automatiquement depuis : ${atlas.sourceImage}\n`;
  code += ` */\n`;
  code += `public class ${className} extends GuiScreen {\n\n`;
  
  code += `    private ResourceLocation guiTexture;\n`;
  code += `    private AtlasButton164 exampleButton;\n\n`;
  
  code += `    public ${className}() {\n`;
  code += `        // Initialiser la texture GUI\n`;
  code += `        this.guiTexture = new ResourceLocation("${packageName.replace('.', '/')}", "textures/gui/gui_atlas.png");\n`;
  code += `    }\n\n`;
  
  code += `    @Override\n`;
  code += `    public void initGui() {\n`;
  code += `        super.initGui();\n`;
  code += `        \n`;
  code += `        // Ajouter des boutons\n`;
  code += `        this.buttonList.clear();\n`;
  code += `        \n`;
  code += `        this.exampleButton = new AtlasButton164(0, this.width / 2 - 100, this.height / 2 - 10, "sprite_1");\n`;
  code += `        this.exampleButton.displayString = "Bouton Exemple";\n`;
  code += `        this.buttonList.add(this.exampleButton);\n`;
  code += `    }\n\n`;
  
  code += `    @Override\n`;
  code += `    public void drawScreen(int mouseX, int mouseY, float partialTicks) {\n`;
  code += `        // Dessiner l'arrière-plan\n`;
  code += `        this.drawDefaultBackground();\n`;
  code += `        \n`;
  code += `        // Lier la texture GUI\n`;
  code += `        GuiDraw164.bindTexture(this.guiTexture);\n`;
  code += `        \n`;
  code += `        // Dessiner un panneau d'arrière-plan si disponible\n`;
  code += `        if (hasBackgroundPanel()) {\n`;
  code += `            drawBackgroundPanel();\n`;
  code += `        }\n`;
  code += `        \n`;
  code += `        // Dessiner les boutons\n`;
  code += `        super.drawScreen(mouseX, mouseY, partialTicks);\n`;
  code += `        \n`;
  code += `        // Dessiner le titre\n`;
  code += `        this.fontRendererObj.drawStringWithShadow("${screenName}", \n`;
  code += `            this.width / 2 - this.fontRendererObj.getStringWidth("${screenName}") / 2, 20, 0xFFFFFF);\n`;
  code += `    }\n\n`;
  
  code += `    private boolean hasBackgroundPanel() {\n`;
  code += `        // Vérifier si un sprite de panneau d'arrière-plan est disponible\n`;
  code += `        return true; // À adapter selon les sprites détectés\n`;
  code += `    }\n\n`;
  
  code += `    private void drawBackgroundPanel() {\n`;
  code += `        int panelWidth = 400;\n`;
  code += `        int panelHeight = 300;\n`;
  code += `        int panelX = (this.width - panelWidth) / 2;\n`;
  code += `        int panelY = (this.height - panelHeight) / 2;\n`;
  code += `        \n`;
  code += `        // Dessiner le panneau avec 9-slice si disponible\n`;
  code += `        GuiDraw164.drawNineSlice(panelX, panelY, panelWidth, panelHeight,\n`;
  code += `            AtlasUVs.SPRITE_1_NORMAL_U1, AtlasUVs.SPRITE_1_NORMAL_V1,\n`;
  code += `            AtlasUVs.SPRITE_1_NORMAL_U2, AtlasUVs.SPRITE_1_NORMAL_V2,\n`;
  code += `            AtlasUVs.SPRITE_1_NORMAL_SLICE_TOP, AtlasUVs.SPRITE_1_NORMAL_SLICE_RIGHT,\n`;
  code += `            AtlasUVs.SPRITE_1_NORMAL_SLICE_BOTTOM, AtlasUVs.SPRITE_1_NORMAL_SLICE_LEFT);\n`;
  code += `    }\n\n`;
  
  code += `    @Override\n`;
  code += `    protected void actionPerformed(GuiButton button) {\n`;
  code += `        if (button == this.exampleButton) {\n`;
  code += `            // Action du bouton exemple\n`;
  code += `            Minecraft.getMinecraft().displayGuiScreen(null);\n`;
  code += `        }\n`;
  code += `    }\n\n`;
  
  code += `    @Override\n`;
  code += `    public boolean doesGuiPauseGame() {\n`;
  code += `        return true;\n`;
  code += `    }\n\n`;
  
  code += `}\n`;
  return code;
}

/**
 * Génère le code Java 7 pour Forge 1.6.4
 */
export async function generateJavaGui(args: { 
  atlas: string; 
  target?: string; 
  package: string; 
  screenName: string 
}): Promise<any> {
  const { atlas, target = 'forge-1.6.4', package: packageName, screenName } = args;
  
  try {
    // Charger l'atlas
    const atlasData: AtlasData = JSON.parse(readFileSync(atlas, 'utf-8'));
    
    // Créer le dossier de sortie
    const outputDir = `./java-output-example/${packageName.replace('.', '/')}/gui`;
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    
    // Générer les classes
    const atlasUVsCode = generateAtlasUVs(atlasData, packageName);
    const guiDrawCode = generateGuiDraw164(packageName);
    const atlasButtonCode = generateAtlasButton164(atlasData, packageName);
    const guiMainMenuCode = generateGuiMainMenu164(atlasData, packageName, screenName);
    
    // Sauvegarder les fichiers
    writeFileSync(join(outputDir, 'AtlasUVs.java'), atlasUVsCode);
    writeFileSync(join(outputDir, 'GuiDraw164.java'), guiDrawCode);
    writeFileSync(join(outputDir, 'AtlasButton164.java'), atlasButtonCode);
    writeFileSync(join(outputDir, `${screenName}.java`), guiMainMenuCode);
    
    return {
      content: [
        {
          type: 'text',
          text: `✅ Code Java 7 généré avec succès !\n\n` +
                `📁 Dossier de sortie : ${outputDir}\n` +
                `📦 Package : ${packageName}\n` +
                `🎯 Cible : ${target}\n\n` +
                `📋 Classes générées :\n` +
                `- AtlasUVs.java : Constantes UV pour l'atlas\n` +
                `- GuiDraw164.java : Utilitaires de rendu avec Tessellator\n` +
                `- AtlasButton164.java : Boutons personnalisés avec états\n` +
                `- ${screenName}.java : Exemple d'écran GUI\n\n` +
                `🔧 Intégration dans votre mod :\n` +
                `1. Copiez les fichiers dans votre projet Forge 1.6.4\n` +
                `2. Ajoutez votre texture GUI dans assets/${packageName.replace('.', '/')}/textures/gui/\n` +
                `3. Utilisez ${screenName} comme exemple pour vos propres écrans\n` +
                `4. Adaptez AtlasButton164 selon vos besoins`
        }
      ]
    };

  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Erreur lors de la génération : ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
}
