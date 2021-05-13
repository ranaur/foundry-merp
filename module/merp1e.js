// Import Modules
import { merp1eActor } from "./actor/actor.js";
import { merp1eActorSheet } from "./actor/actor-sheet.js";
import { merp1eItem } from "./item/item.js";
import { merp1eItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.merp1e = {
    merp1eActor,
    merp1eItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = merp1eActor;
  CONFIG.Item.entityClass = merp1eItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("merp1e", merp1eActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("merp1e", merp1eItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});