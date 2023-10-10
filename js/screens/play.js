import * as me from 'melonjs';

import game from './../game.js';
// import VirtualJoypad from './../entities/controls.js';
// import UIContainer from './../entities/HUD.js';

class PlayScreen extends me.Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
      // load a level
        me.level.load("map1");
      // disable gravity
      me.game.world.gravity.set(0, 0);

        // // add our HUD to the game world
        // if (typeof this.HUD === "undefined") {
        //     this.HUD = new UIContainer();
        // }
        // me.game.world.addChild(this.HUD);

        // display if debugPanel is enabled or on mobile
        // if ((me.plugin.cache.debugPanel && me.plugin.cache.debugPanel.panel.visible) || me.device.touch) {
        //     if (typeof this.virtualJoypad === "undefined") {
        //         this.virtualJoypad = new VirtualJoypad();
        //     }
        //     me.game.world.addChild(this.virtualJoypad);
        // }

        // play some music
        // me.audio.playTrack("dst-gameforest");
        me.game.world.addChild(new me.Text(530, 760, {
            font: "Monaco",
            size: 15,
            fillStyle: "tomato",
            textBaseline : "middle",
            textAlign : "center",
            text : "Use arrow keys to swim around. Watch out for sharks!"
        }));  
    }

    /**
     *  action to perform on state change
     */
    onDestroyEvent() {

        // // remove the HUD from the game world
        // me.game.world.removeChild(this.HUD);

        // remove the joypad if initially added
        // if (this.virtualJoypad && me.game.world.hasChild(this.virtualJoypad)) {
        //     me.game.world.removeChild(this.virtualJoypad);
        // }

        // stop some music
        // me.audio.stopTrack("dst-gameforest");
    }
};

export default PlayScreen;
