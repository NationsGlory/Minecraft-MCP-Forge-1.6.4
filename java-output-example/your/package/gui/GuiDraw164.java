package your.package.gui;

import net.minecraft.client.gui.GuiScreen;
import net.minecraft.client.renderer.Tessellator;
import net.minecraft.client.renderer.OpenGlHelper;
import net.minecraft.util.ResourceLocation;
import org.lwjgl.opengl.GL11;

/**
 * Utilitaires de rendu GUI pour Forge 1.6.4
 * Utilise Tessellator pour un rendu flexible des UVs
 */
public class GuiDraw164 {

    private static Tessellator tessellator = Tessellator.instance;
    private static ResourceLocation currentTexture;

    /**
     * Définit la texture actuelle
     */
    public static void bindTexture(ResourceLocation texture) {
        currentTexture = texture;
        net.minecraft.client.Minecraft.getMinecraft().getTextureManager().bindTexture(texture);
    }

    /**
     * Dessine un sprite avec des UVs personnalisées
     */
    public static void drawSprite(int x, int y, int width, int height, 
                               float u1, float v1, float u2, float v2) {
        if (currentTexture == null) {
            throw new IllegalStateException("Aucune texture liée. Appelez bindTexture() d'abord.");
        }

        GL11.glEnable(GL11.GL_BLEND);
        OpenGlHelper.glBlendFunc(770, 771, 1, 0);
        GL11.glColor4f(1.0F, 1.0F, 1.0F, 1.0F);

        tessellator.startDrawingQuads();
        tessellator.addVertexWithUV(x, y + height, 0.0D, u1, v2);
        tessellator.addVertexWithUV(x + width, y + height, 0.0D, u2, v2);
        tessellator.addVertexWithUV(x + width, y, 0.0D, u2, v1);
        tessellator.addVertexWithUV(x, y, 0.0D, u1, v1);
        tessellator.draw();
    }

    /**
     * Dessine un sprite avec 9-slice pour les panneaux scalables
     */
    public static void drawNineSlice(int x, int y, int width, int height,
                                  float u1, float v1, float u2, float v2,
                                  int sliceTop, int sliceRight, int sliceBottom, int sliceLeft) {
        if (currentTexture == null) {
            throw new IllegalStateException("Aucune texture liée. Appelez bindTexture() d'abord.");
        }

        GL11.glEnable(GL11.GL_BLEND);
        OpenGlHelper.glBlendFunc(770, 771, 1, 0);
        GL11.glColor4f(1.0F, 1.0F, 1.0F, 1.0F);

        // Calculer les dimensions des zones
        int centerWidth = width - sliceLeft - sliceRight;
        int centerHeight = height - sliceTop - sliceBottom;
        
        float centerU1 = u1 + (sliceLeft / AtlasUVs.ATLAS_WIDTH);
        float centerV1 = v1 + (sliceTop / AtlasUVs.ATLAS_HEIGHT);
        float centerU2 = u2 - (sliceRight / AtlasUVs.ATLAS_WIDTH);
        float centerV2 = v2 - (sliceBottom / AtlasUVs.ATLAS_HEIGHT);

        tessellator.startDrawingQuads();

        // Coin haut-gauche
        tessellator.addVertexWithUV(x, y + sliceTop, 0.0D, u1, centerV1);
        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop, 0.0D, centerU1, centerV1);
        tessellator.addVertexWithUV(x + sliceLeft, y, 0.0D, centerU1, v1);
        tessellator.addVertexWithUV(x, y, 0.0D, u1, v1);

        // Bord haut
        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop, 0.0D, centerU1, centerV1);
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop, 0.0D, centerU2, centerV1);
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y, 0.0D, centerU2, v1);
        tessellator.addVertexWithUV(x + sliceLeft, y, 0.0D, centerU1, v1);

        // Coin haut-droit
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop, 0.0D, centerU2, centerV1);
        tessellator.addVertexWithUV(x + width, y + sliceTop, 0.0D, u2, centerV1);
        tessellator.addVertexWithUV(x + width, y, 0.0D, u2, v1);
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y, 0.0D, centerU2, v1);

        // Bord gauche
        tessellator.addVertexWithUV(x, y + sliceTop + centerHeight, 0.0D, u1, centerV2);
        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop + centerHeight, 0.0D, centerU1, centerV2);
        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop, 0.0D, centerU1, centerV1);
        tessellator.addVertexWithUV(x, y + sliceTop, 0.0D, u1, centerV1);

        // Centre
        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop + centerHeight, 0.0D, centerU1, centerV2);
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop + centerHeight, 0.0D, centerU2, centerV2);
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop, 0.0D, centerU2, centerV1);
        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop, 0.0D, centerU1, centerV1);

        // Bord droit
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop + centerHeight, 0.0D, centerU2, centerV2);
        tessellator.addVertexWithUV(x + width, y + sliceTop + centerHeight, 0.0D, u2, centerV2);
        tessellator.addVertexWithUV(x + width, y + sliceTop, 0.0D, u2, centerV1);
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop, 0.0D, centerU2, centerV1);

        // Coin bas-gauche
        tessellator.addVertexWithUV(x, y + height, 0.0D, u1, v2);
        tessellator.addVertexWithUV(x + sliceLeft, y + height, 0.0D, centerU1, v2);
        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop + centerHeight, 0.0D, centerU1, centerV2);
        tessellator.addVertexWithUV(x, y + sliceTop + centerHeight, 0.0D, u1, centerV2);

        // Bord bas
        tessellator.addVertexWithUV(x + sliceLeft, y + height, 0.0D, centerU1, v2);
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + height, 0.0D, centerU2, v2);
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop + centerHeight, 0.0D, centerU2, centerV2);
        tessellator.addVertexWithUV(x + sliceLeft, y + sliceTop + centerHeight, 0.0D, centerU1, centerV2);

        // Coin bas-droit
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + height, 0.0D, centerU2, v2);
        tessellator.addVertexWithUV(x + width, y + height, 0.0D, u2, v2);
        tessellator.addVertexWithUV(x + width, y + sliceTop + centerHeight, 0.0D, u2, centerV2);
        tessellator.addVertexWithUV(x + sliceLeft + centerWidth, y + sliceTop + centerHeight, 0.0D, centerU2, centerV2);

        tessellator.draw();
    }

    /**
     * Dessine un sprite avec états (normal, hover, pressed)
     */
    public static void drawSpriteWithState(int x, int y, int width, int height,
                                        float u1Normal, float v1Normal, float u2Normal, float v2Normal,
                                        float u1Hover, float v1Hover, float u2Hover, float v2Hover,
                                        float u1Pressed, float v1Pressed, float u2Pressed, float v2Pressed,
                                        boolean hovered, boolean pressed) {
        float u1, v1, u2, v2;
        
        if (pressed) {
            u1 = u1Pressed; v1 = v1Pressed; u2 = u2Pressed; v2 = v2Pressed;
        } else if (hovered) {
            u1 = u1Hover; v1 = v1Hover; u2 = u2Hover; v2 = v2Hover;
        } else {
            u1 = u1Normal; v1 = v1Normal; u2 = u2Normal; v2 = v2Normal;
        }
        
        drawSprite(x, y, width, height, u1, v1, u2, v2);
    }

}
