package your.package.gui;

import net.minecraft.client.gui.GuiScreen;
import net.minecraft.client.gui.GuiButton;
import net.minecraft.util.ResourceLocation;
import net.minecraft.client.Minecraft;

/**
 * Exemple d'écran GUI utilisant l'atlas généré
 * Généré automatiquement depuis : main_menu.png
 */
public class GuiMainMenu164 extends GuiScreen {

    private ResourceLocation guiTexture;
    private AtlasButton164 exampleButton;

    public GuiMainMenu164() {
        // Initialiser la texture GUI
        this.guiTexture = new ResourceLocation("your/package", "textures/gui/gui_atlas.png");
    }

    @Override
    public void initGui() {
        super.initGui();
        
        // Ajouter des boutons
        this.buttonList.clear();
        
        this.exampleButton = new AtlasButton164(0, this.width / 2 - 100, this.height / 2 - 10, "button_main");
        this.exampleButton.displayString = "Bouton Exemple";
        this.buttonList.add(this.exampleButton);
    }

    @Override
    public void drawScreen(int mouseX, int mouseY, float partialTicks) {
        // Dessiner l'arrière-plan
        this.drawDefaultBackground();
        
        // Lier la texture GUI
        GuiDraw164.bindTexture(this.guiTexture);
        
        // Dessiner un panneau d'arrière-plan si disponible
        if (hasBackgroundPanel()) {
            drawBackgroundPanel();
        }
        
        // Dessiner les boutons
        super.drawScreen(mouseX, mouseY, partialTicks);
        
        // Dessiner le titre
        this.fontRendererObj.drawStringWithShadow("GuiMainMenu164", 
            this.width / 2 - this.fontRendererObj.getStringWidth("GuiMainMenu164") / 2, 20, 0xFFFFFF);
    }

    private boolean hasBackgroundPanel() {
        // Vérifier si un sprite de panneau d'arrière-plan est disponible
        return true; // À adapter selon les sprites détectés
    }

    private void drawBackgroundPanel() {
        int panelWidth = 400;
        int panelHeight = 300;
        int panelX = (this.width - panelWidth) / 2;
        int panelY = (this.height - panelHeight) / 2;
        
        // Dessiner le panneau avec 9-slice si disponible
        GuiDraw164.drawNineSlice(panelX, panelY, panelWidth, panelHeight,
            AtlasUVs.PANEL_BACKGROUND_NORMAL_U1, AtlasUVs.PANEL_BACKGROUND_NORMAL_V1,
            AtlasUVs.PANEL_BACKGROUND_NORMAL_U2, AtlasUVs.PANEL_BACKGROUND_NORMAL_V2,
            AtlasUVs.PANEL_BACKGROUND_NORMAL_SLICE_TOP, AtlasUVs.PANEL_BACKGROUND_NORMAL_SLICE_RIGHT,
            AtlasUVs.PANEL_BACKGROUND_NORMAL_SLICE_BOTTOM, AtlasUVs.PANEL_BACKGROUND_NORMAL_SLICE_LEFT);
    }

    @Override
    protected void actionPerformed(GuiButton button) {
        if (button == this.exampleButton) {
            // Action du bouton exemple
            Minecraft.getMinecraft().displayGuiScreen(null);
        }
    }

    @Override
    public boolean doesGuiPauseGame() {
        return true;
    }

}
