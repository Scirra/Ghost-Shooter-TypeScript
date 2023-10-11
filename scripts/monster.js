// Import globals and utilities
import Globals from "./globals.js";
import * as Utils from "./utilities.js";
// This is a custom class used to represent instances of the Monster
// object type in JavaScript code. Note the call to setInstanceClass()
// in runOnStartup in Main.js, which tells Construct to use this class
// instead of the default.
// Note the class must derive from the default class InstanceType.Monster.
// This is a very useful way to add custom logic to objects in your
// game, since you can easily add new properties and functions.
// TypeScript note: make sure custom instance classes derive from the
// instance-specific types under the InstanceType namespace, since
// Construct generates specific instance types for every object type.
export default class MonsterInstance extends InstanceType.Monster {
    // TypeScript note: TypeScript requires class properties to be
    // declared with their type outside the constructor like this,
    // so it knows ahead of time what class properties are available.
    health;
    speed;
    constructor() {
        super();
        // Every monster starts off with a health of 5 (requiring 5
        // hits to kill), and a speed set to the global variable for
        // the current monster speed.
        this.health = 5;
        this.speed = Globals.monsterSpeed;
    }
    // This is called every 3 seconds to create a new monster just
    // outside the right edge of the layout.
    static Create(runtime) {
        runtime.objects.Monster.createInstance("Main", 1500, runtime.random() * 1024);
    }
    Move() {
        const dt = this.runtime.dt;
        const playerInst = Globals.playerInstance;
        // Move monsters forward at their angle and speed.
        // This is similar to the Bullet behavior's movement.
        this.x += Math.cos(this.angle) * this.speed * dt;
        this.y += Math.sin(this.angle) * this.speed * dt;
        // The player can be destroyed. Only do the following if the
        // player still exists.
        if (playerInst) {
            // If the monster wanders outside the layout, point it at the
            // player so it comes back in to the game.
            if (Utils.IsOutsideLayout(this)) {
                this.angle = Utils.angleTo(this.x, this.y, playerInst.x, playerInst.y);
            }
            // If the monster is within 200 pixels of the player, start
            // rotating it towards them.
            if (Utils.distanceTo(this.x, this.y, playerInst.x, playerInst.y) < 200) {
                // Calculate angle to player
                const angleToPlayer = Utils.angleTo(this.x, this.y, playerInst.x, playerInst.y);
                // Rotate towards angle to player by 1 degree. Note the
                // angleRotate function works in radians so convert the
                // step parameter from 1 degree to radians.
                this.angle = Utils.angleRotate(this.angle, angleToPlayer, Utils.toRadians(1));
            }
            // If a monster touches the player, they are destroyed and
            // it's game over!
            if (this.testOverlap(playerInst)) {
                playerInst.destroy();
                // Clear the player instance global variable.
                // Note playerInst is a local variable so clearing
                // that won't affect the global.
                Globals.playerInstance = null;
                Globals.gameOverTextInstance.isVisible = true;
            }
        }
    }
    DestroyWithExplosion() {
        // This is called when a monster's health reaches 0. Another
        // explosion is created and the monster is destroyed.
        // The score global variable is also increased, using the
        // monster's speed as points.
        const Explosion = this.runtime.objects.Explosion;
        const explosionInstance = Explosion.createInstance("Main", this.x, this.y);
        explosionInstance.angleDegrees = this.runtime.random() * 360;
        Globals.score += this.speed;
        this.destroy();
    }
}
