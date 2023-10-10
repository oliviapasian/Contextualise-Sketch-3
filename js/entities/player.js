import * as me from 'melonjs';
import game from './../game.js';

class PlayerEntity extends me.Entity {
    constructor(x, y, settings) {
        // call the constructor
        super(x, y , settings);

        // set a "player object" type
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        // player can exit the viewport (jumping, falling into a hole, etc.)
        this.alwaysUpdate = true;

        // walking & jumping speed
        this.body.setMaxVelocity(5, 5);
        this.body.setFriction(0.4, 0.4);


        this.dying = false;

        // this.multipleJump = 1;

        // set the viewport to follow this renderable on both axis, and enable damping
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 0.1);

        // enable keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,    "jump");
        me.input.bindKey(me.input.KEY.SPACE, "jump");
        me.input.bindKey(me.input.KEY.DOWN,  "down");

        me.input.bindKey(me.input.KEY.A,     "left");
        me.input.bindKey(me.input.KEY.D,     "right");
        me.input.bindKey(me.input.KEY.W,     "jump");
        me.input.bindKey(me.input.KEY.Z,     "down");

    
        // map axes
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: -0.5}, me.input.KEY.LEFT);
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: 0.5}, me.input.KEY.RIGHT);
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LY, threshold: -0.5}, me.input.KEY.UP);

        // set a renderable
        this.renderable = game.texture.createAnimationFromName([
            "fish1.png", "fish2.png", "fish3.png"
        ]);

        // define a basic walking animatin
        this.renderable.addAnimation("stand", [{ name: "fish1.png", delay: 200 }, { name: "fish2.png", delay: 100 }, { name: "fish3.png", delay: 200 }, { name: "fish2.png", delay: 100 }, { name: "fish1.png", delay: 200 }]);
        this.renderable.addAnimation("walk",  [{ name: "fish1.png", delay: 200 }, { name: "fish2.png", delay: 100 }, { name: "fish3.png", delay: 200 }, { name: "fish2.png", delay: 100 }, { name: "fish1.png", delay: 200 }]);
        this.renderable.addAnimation("jump",  [{ name: "fish1.png", delay: 100 }]);

        // set as default
        this.renderable.setCurrentAnimation("walk");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 1.0);
    }

    /**
     ** update the force applied
     */
    update(dt) {
        
        if (me.input.isKeyPressed("left")){
            // if (this.body.vel.y === 0) {
            //     this.renderable.setCurrentAnimation("walk");
            // }
            this.renderable.setCurrentAnimation("walk");

            this.body.force.x = -this.body.maxVel.x;
            this.renderable.flipX(true);
        } else if (me.input.isKeyPressed("right")) {
                 // if (this.body.vel.y === 0) {
            //     this.renderable.setCurrentAnimation("walk");
            // }
            this.renderable.setCurrentAnimation("walk");

            this.body.force.x = this.body.maxVel.x;
            this.renderable.flipX(false);
        } else{
            this.body.force.x = 0;
        }

        if (me.input.isKeyPressed("jump")) {
            this.renderable.setCurrentAnimation("walk");
            this.body.force.y = -this.body.maxVel.y;

            // this.body.jumping = true;
            // if (this.multipleJump <= 2) {
            //     // easy "math" for double jump
            //     this.body.force.y = -this.body.maxVel.y * this.multipleJump++;
            //     me.audio.stop("jump");
            //     me.audio.play("jump", false);
            // }
        } else if (me.input.isKeyPressed("down")){
            this.body.force.y = this.body.maxVel.y;
            this.renderable.setCurrentAnimation("walk");
        } else{
            this.body.force.y = 0;
        }
        // else {
        //     if (!this.body.falling && !this.body.jumping) {
        //         // reset the multipleJump flag if on the ground
        //         this.multipleJump = 1;
        //     }
        //     else if (this.body.falling && this.multipleJump < 2) {
        //         // reset the multipleJump flag if falling
        //         this.multipleJump = 2;
        //     }
        // }


        // if (this.body.force.x === 0 && this.body.force.y === 0) {
        //     this.renderable.setCurrentAnimation("stand");
        // }



        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0 ||
            (this.renderable && this.renderable.isFlickering())
        ) {
            super.update(dt);
            return true;
        }
        return false;
    }


    /**
     * colision handler
     */
    onCollision(response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform") {
                    if (this.body.falling &&
                        !me.input.isKeyPressed("down") &&
                        // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;
                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }

                // // Custom collision response for slopes
                // else if (other.type === "slope") {
                //     // Always adjust the collision response upward
                //     response.overlapV.y = Math.abs(response.overlap);
                //     response.overlapV.x = 0;

                //     // Respond to the slope (it is solid)
                //     return true;
                // }
                break;

            case me.collision.types.ENEMY_OBJECT:
                if (!other.isMovingEnemy) {
                    // spike or any other fixed danger
                    this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
                    this.hurt();
                }
                else {
                    // a regular moving enemy entity
                    if ((response.overlapV.y > 0) && this.body.falling) {
                        // jump
                        this.body.vel.y -= this.body.maxVel.y * 1.5 * me.timer.tick;
                    }
                    else {
                        this.hurt();
                    }
                    // Not solid
                    return false;
                }
                break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    }

    /**
     * ouch
     */
    hurt() {
        var sprite = this.renderable;

        if (!sprite.isFlickering()) {

            // tint to red and flicker
            sprite.tint.setColor(255, 192, 192);
            sprite.flicker(750, function () {
                // clear the tint once the flickering effect is over
                sprite.tint.setColor(255, 255, 255);
            });

            // flash the screen
            me.game.viewport.fadeIn("#FFFFFF", 75);
        }
    }
};

export default PlayerEntity;
