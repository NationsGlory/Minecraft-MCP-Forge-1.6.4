package your.package.gui;

import net.minecraft.client.gui.GuiButton;
import net.minecraft.client.renderer.OpenGlHelper;
import org.lwjgl.opengl.GL11;

/**
 * Bouton personnalisé utilisant l'atlas GUI
 * Supporte les états normal, hover et pressed
 */
public class AtlasButton164 extends GuiButton {

    private String spriteName;
    private boolean hasHoverState;
    private boolean hasPressedState;

    public AtlasButton164(int id, int x, int y, String spriteName) {
        super(id, x, y, 0, 0, "");
        this.spriteName = spriteName;
        
        // Déterminer les dimensions et états disponibles
        updateSpriteInfo();
    }

    private void updateSpriteInfo() {
        // Cette méthode devrait être implémentée pour détecter les états disponibles
        // Pour l'instant, on utilise des valeurs par défaut
        this.width = 200;
        this.height = 20;
        this.hasHoverState = true;
        this.hasPressedState = true;
    }

    @Override
    public void drawButton(net.minecraft.client.Minecraft mc, int mouseX, int mouseY) {
        if (!this.visible) {
            return;
        }

        boolean hovered = mouseX >= this.xPosition && mouseY >= this.yPosition && 
                          mouseX < this.xPosition + this.width && mouseY < this.yPosition + this.height;
        boolean pressed = hovered && net.minecraft.client.Minecraft.getMinecraft().gameSettings.keyBindAttack.isPressed();

        // Dessiner le sprite selon l'état
        drawSpriteState(hovered, pressed);
        
        // Dessiner le texte si présent
        if (this.displayString != null && !this.displayString.isEmpty()) {
            int textColor = hovered ? 0xFFFF00 : 0xFFFFFF;
            mc.fontRenderer.drawStringWithShadow(this.displayString, 
                this.xPosition + (this.width - mc.fontRenderer.getStringWidth(this.displayString)) / 2,
                this.yPosition + (this.height - 8) / 2, textColor);
        }
    }

    private void drawSpriteState(boolean hovered, boolean pressed) {
        // Cette méthode devrait être générée dynamiquement selon les sprites disponibles
        // Pour l'instant, on utilise un exemple générique
        
        if (pressed && this.hasPressedState) {
            // Dessiner l'état pressed
            GuiDraw164.drawSprite(this.xPosition, this.yPosition, this.width, this.height,
                AtlasUVs.BUTTON_MAIN_PRESSED_U1, AtlasUVs.BUTTON_MAIN_PRESSED_V1,
                AtlasUVs.BUTTON_MAIN_PRESSED_U2, AtlasUVs.BUTTON_MAIN_PRESSED_V2);
        } else if (hovered && this.hasHoverState) {
            // Dessiner l'état hover
            GuiDraw164.drawSprite(this.xPosition, this.yPosition, this.width, this.height,
                AtlasUVs.BUTTON_MAIN_HOVER_U1, AtlasUVs.BUTTON_MAIN_HOVER_V1,
                AtlasUVs.BUTTON_MAIN_HOVER_U2, AtlasUVs.BUTTON_MAIN_HOVER_V2);
        } else {
            // Dessiner l'état normal
            GuiDraw164.drawSprite(this.xPosition, this.yPosition, this.width, this.height,
                AtlasUVs.BUTTON_MAIN_NORMAL_U1, AtlasUVs.BUTTON_MAIN_NORMAL_V1,
                AtlasUVs.BUTTON_MAIN_NORMAL_U2, AtlasUVs.BUTTON_MAIN_NORMAL_V2);
        }
    }

}
