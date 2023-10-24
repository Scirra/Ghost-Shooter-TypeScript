
// Import globals and utilities
import Globals from "./globals.js";
import * as Utils from "./utilities.js";

export function Tick(runtime)
{
	// The tick event runs every frame. The game needs to be advanced
	// by the amount of time in delta-time, also known as dt.
	const dt = runtime.dt;
	
	// First handle the player's movement.
	MovePlayer(runtime);
	
	// Next handle all monster's movement. Note this calls a method in
	// the custom MonsterInstance class defined in Monster.js.
	for (const monsterInstance of runtime.objects.Monster.instances())
	{
		monsterInstance.Move();
	}
	
	// Next handle all bullet's movement, and test for collisions
	// with monsters.
	for (const bulletInstance of runtime.objects.Bullet.instances())
	{
		MoveBullet(bulletInstance, dt);
		CheckBulletHitMonster(bulletInstance, runtime);
		
		// If a bullet goes outside the layout, destroy it.
		// This is similar to the 'Destroy outside layout' behavior.
		if (Utils.IsOutsideLayout(bulletInstance))
			bulletInstance.destroy();
	}
	
	// Make any explosions gradually fade out.
	for (const explosionInstance of runtime.objects.Explosion.instances())
	{
		FadeExplosion(explosionInstance, dt);
	}
	
	// Finally, always display score in the status text object.
	const statusTextInstance = runtime.objects.Status.getFirstInstance();
	statusTextInstance.text = "Score: " + Globals.score;
}

function MovePlayer(runtime)
{
	// Use a playerInst local variable as a shorthand way to refer to
	// the playerInstance global variable in this function, since
	// it is used many times. Similarly create local variables to
	// reference runtime.keyboard and runtime.dt.
	const playerInst = Globals.playerInstance;
	const dt = runtime.dt;
	const keyboard = runtime.keyboard;
	
	// The player is destroyed if a monster catches them. Don't try to
	// handle the player movement if the only instance was destroyed.
	if (!playerInst)
		return;
	
	// Check if any arrow keys are down and move the player accordingly.
	// NOTE: the 8 direction behavior normally applies acceleration and
	// ensures the diagonal speed does not go above the maximum speed.
	// This is left out/ to keep the example simple. Improving the
	// movement is left as an exercise to the reader.
	const playerSpeed = 200;
	if (keyboard.isKeyDown("ArrowRight"))
		playerInst.x += playerSpeed * dt;
	if (keyboard.isKeyDown("ArrowLeft"))
		playerInst.x -= playerSpeed * dt;
	if (keyboard.isKeyDown("ArrowDown"))
		playerInst.y += playerSpeed * dt;
	if (keyboard.isKeyDown("ArrowUp"))
		playerInst.y -= playerSpeed * dt;
	
	// Bound the player to the layout area so they can't go outside it.
	// This is similar to the 'Bound to layout' behavior.
	if (playerInst.x < 0)
		playerInst.x = 0;
	if (playerInst.y < 0)
		playerInst.y = 0;
	if (playerInst.x > runtime.layout.width)
		playerInst.x = runtime.layout.width;
	if (playerInst.y > runtime.layout.height)
		playerInst.y = runtime.layout.height;
	
	// Always scroll to the player
	runtime.layout.scrollTo(playerInst.x, playerInst.y);
	
	// Always make the player look in the direction of the mouse cursor
	const mouse = runtime.mouse;
	playerInst.angle = Utils.angleTo(playerInst.x, playerInst.y,
									 mouse.getMouseX(), mouse.getMouseY());
}

function MoveBullet(inst, dt)
{
	// Move bullets forward at their angle at a speed of 600 pixels per second.
	// This is similar to the Bullet behavior's movement.
	const speed = 600;
	inst.x += Math.cos(inst.angle) * speed * dt;
	inst.y += Math.sin(inst.angle) * speed * dt;
}

function CheckBulletHitMonster(bulletInstance, runtime)
{
	// Save a reference to the Explosion object type to help
	// keep the code short and readable.
	const Explosion = runtime.objects.Explosion;
	
	// Check if a bullet has collided with any monster. To do this it
	// must check against every Monster instance. This is similar to
	// what the 'Is overlapping' condition does.
	for (const monsterInstance of runtime.objects.Monster.instances())
	{
		// Test if the bullet instance overlaps this monster instance,
		// indicating a collision.
		if (bulletInstance.testOverlap(monsterInstance))
		{
			// A collision happened: create an explosion, and set it
			// to a random angle to vary the effect,
			const explosionInstance = Explosion.createInstance("Main",
										bulletInstance.x, bulletInstance.y);
			explosionInstance.angleDegrees = runtime.random() * 360;
			
			// Destroy the bullet, and increase the speed counter so
			// the next spawned monster is a little faster.
			bulletInstance.destroy();
			Globals.monsterSpeed++;
			
			// Subtract 1 from the monster's health. If the health
			// has then fallen to 0, destroy it as well. Remember
			// that monster instances use the MonsterInstance class
			// defined in Monster.js, and "DestroyWithExplosion" is
			// defined as a method in that class.
			monsterInstance.health--;
			if (monsterInstance.health <= 0)
				monsterInstance.DestroyWithExplosion();
		}
	}
}

function FadeExplosion(inst, dt)
{
	// Fade out explosions over 0.5 seconds, and destroy it once it
	// becomes invisible. This is similar to the Fade behavior.
	inst.opacity -= 2 * dt;
	
	if (inst.opacity <= 0)
		inst.destroy();
}

export function OnMouseDown(e, runtime)
{
	// The left mouse button is number 0. Ignore any other mouse buttons.
	if (e.button !== 0)
		return;
	
	const playerInst = Globals.playerInstance;
	
	// Don't try to shoot if the player was destroyed.
	if (!playerInst)
		return;
	
	// Create a bullet at player's image point 1, which is at the end of
	// their gun.
	const bulletInstance = runtime.objects.Bullet.createInstance("Main",
			playerInst.getImagePointX(1), playerInst.getImagePointY(1));
	
	// Set the bullet angle to the same angle as the player, so it shoots
	// out in the right direction.
	bulletInstance.angle = playerInst.angle;
}

export function OnKeyDown(e, runtime)
{
	// Pressing space when the player is destroyed restarts the game.
	if (!Globals.playerInstance && e.key === " ")
	{
		// Also reset globals.
		Globals.score = 0;
		Globals.monsterSpeed = 80;
		
		// Restarting is done by using goToLayout() to go to the same layout.
		runtime.goToLayout(0);
	}
}
