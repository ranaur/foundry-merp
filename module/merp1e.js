// Import Modules
import { Merp1eActor } from "./actor/actor.js";
import { Merp1eActorSheet } from "./actor/actor-sheet.js";
import { Merp1eItem } from "./item/item.js";
import { Merp1eItemSheet } from "./item/item-sheet.js";
import { Merp1eSpelllistSheet } from "./item/spelllist-sheet.js";
import { Merp1eRules } from "./rules/rules.js"

Hooks.once('init', async function() {

  game.merp1e = {
    Merp1eActor,
    Merp1eItem,
    Merp1eRules
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
  CONFIG.Actor.entityClass = Merp1eActor;
  CONFIG.Item.entityClass = Merp1eItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("merp1e", Merp1eActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("merp1e", Merp1eItemSheet, { makeDefault: true });
  Items.registerSheet("merp1e", Merp1eSpelllistSheet, { types: ['spelllist'], makeDefault: true });

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

  Handlebars.registerHelper('toUpperCase', function(str) {
    return str.toUpperCase();
  });

  Handlebars.registerHelper('isNotEqual', function(a, b) {
    return a != b;
  });

  Handlebars.registerHelper('isEqual', function(a, b) {
    return a == b;
  });
});