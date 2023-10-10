import * as me from 'melonjs';
import game from './../game.js';

/**
 * a basic control to toggle fullscreen on/off
 */
class FSControl extends me.UISpriteElement {
    /**
     * constructor
     */
    constructor(x, y) {
        super(x, y, {
            image: game.texture,
            region : "shadedDark30.png"
        });
        this.setOpacity(0.5);
        this.floating = false;
    }

    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.5);
    }

    /**
     * function called when the object is clicked on
     */
    onClick(/* event */) {
        if (!me.device.isFullscreen()) {
            me.device.requestFullscreen();
        } else {
            me.device.exitFullscreen();
        }
        return false;
    }
};

/**
 * a basic control to toggle fullscreen on/off
 */
class AudioControl extends me.UISpriteElement {
    /**
     * constructor
     */
    constructor(x, y) {
        super(x, y, {
            image: game.texture,
            region : "shadedDark13.png" // ON by default
        });
        this.setOpacity(0.5);
        this.isMute = false;
        this.floating = false;
    }

    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.5);
    }

    /**
     * function called when the object is clicked on
    //  */
    // onClick(/* event */) {
    //     if (this.isMute) {
    //         me.audio.unmuteAll();
    //         this.setRegion(game.texture.getRegion("shadedDark13.png"));
    //         this.isMute = false;
    //     } else {
    //         me.audio.muteAll();
    //         this.setRegion(game.texture.getRegion("shadedDark15.png"));
    //         this.isMute = true;
    //     }
    //     return false;
    // }
};


/**
 * a HUD container and child items
 */
class UIContainer extends me.Container {

    constructor() {
        // call the constructor
        super();

        // persistent across level change
        this.isPersistent = true;

        // Use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our audio control object
        this.addChild(new AudioControl(36, 56));

        if (!me.device.isMobile) {
            // add our fullscreen control object
            this.addChild(new FSControl(36 + 10 + 48, 56));
        }
    }
};

export default UIContainer;
