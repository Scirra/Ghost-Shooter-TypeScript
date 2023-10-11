// Use a module to store our game's global variables
import Globals from "./globals.js";
// Import main game methods, such as Tick and OnMouseDown
import * as GameMethods from "./gameMethods.js";
// Import MonsterInstance class from monster.js
import MonsterInstance from "./monster.js";
runOnStartup(async (runtime) => {
    // This runs just as the loading screen appears, before the runtime
    // has finished loading.
    // Set the Monster object to use a custom MonsterInstance class,
    // defined in monster.js, for its instances. This means the custom
    // class's own properties and functions are always available whenever
    // the Monster object's instances are used in code.
    runtime.objects.Monster.setInstanceClass(MonsterInstance);
    // There's nothing else that can be done before the runtime starts up,
    // so wait until the "beforeprojectstart" event fires to finish the
    // rest of initialisation. This runs just before 'On start of layout'
    // on the first layout.
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});
function OnBeforeProjectStart(runtime) {
    // Just before the project starts, add a "beforelayoutstart" event
    // handler to set up the initial state of the layout. This is also
    // called on startup, and will be called again if the layout restarts,
    // which can happen after the player dies.
    runtime.layout.addEventListener("beforelayoutstart", () => OnBeforeLayoutStart(runtime));
    // Attach the tick event to run the game logic over time.
    runtime.addEventListener("tick", () => GameMethods.Tick(runtime));
    // The player fires bullets when clicking, which is done in a mousedown event.
    runtime.addEventListener("mousedown", e => GameMethods.OnMouseDown(e, runtime));
    // Restart the game when pressing spacebar if the player was destroyed,
    // which is done in a keydown event.
    runtime.addEventListener("keydown", e => GameMethods.OnKeyDown(e, runtime));
    // Create a new monster instance every 3 seconds.
    setInterval(() => MonsterInstance.Create(runtime), 3000);
}
// This is called every time the layout starts, just before 'On start of
// layout'. Set up the initial state of the layout.
function OnBeforeLayoutStart(runtime) {
    // Store the only Player and GameOverText instances as globals.
    // Note this is done every time the layout is started, since restarting
    // the layout re-creates all its instances.
    Globals.playerInstance = runtime.objects.Player.getFirstInstance();
    Globals.gameOverTextInstance = runtime.objects.GameOverText.getFirstInstance();
    // Hide the "Game over" text.
    // TypeScript note: the 'property!' syntax is used to tell TypeScript that the
    // property will not be null. It's used in a few places where we know something
    // won't be null, but the type is optional as it depends on the runtime state.
    Globals.gameOverTextInstance.isVisible = false;
    // Start all monsters pointing at a random angle.
    for (const monsterInstance of runtime.objects.Monster.instances()) {
        monsterInstance.angleDegrees = runtime.random() * 360;
    }
}
