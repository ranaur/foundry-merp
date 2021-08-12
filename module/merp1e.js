// Import Modules
import { Merp1eActor } from "./actor/actor.js";
import { Merp1eCharacterSheet } from "./actor/character-sheet.js";
import { Merp1eTestSheet } from "./actor/test-sheet.js";
import { Merp1eItem } from "./item/item.js";
import { Merp1eEquipmentSheet } from "./item/equipment-sheet.js";
import { Merp1eRaceSheet } from "./item/race-sheet.js";
import { Merp1eSpellSheet } from "./item/spell-sheet.js";
import { Merp1eSpelllistSheet } from "./item/spelllist-sheet.js";
import { Merp1eProfessionSheet } from "./item/profession-sheet.js";
import { Merp1eLanguageSheet } from "./item/language-sheet.js";
import { Merp1eSkillSheet } from "./item/skill-sheet.js";
import { Merp1eRules } from "./rules/rules.js"
import { preloadHandlebarsTemplates } from "./templates.js";
import { GenericImporter } from "./apps/generic-importer.js";

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

  CONFIG.Actor.documentClass = Merp1eActor;
  CONFIG.Item.documentClass = Merp1eItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("merp1e", Merp1eCharacterSheet, { makeDefault: true });
  Actors.registerSheet("merp1e", Merp1eTestSheet, { makeDefault: false });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("merp1e", Merp1eSpellSheet, { types: ['spell'], makeDefault: true });
  Items.registerSheet("merp1e", Merp1eSpelllistSheet, { types: ['spelllist'], makeDefault: true });
  Items.registerSheet("merp1e", Merp1eProfessionSheet, { types: ['profession'], makeDefault: true });
  Items.registerSheet("merp1e", Merp1eRaceSheet, { types: ['race'], makeDefault: true });
  Items.registerSheet("merp1e", Merp1eSkillSheet, { types: ['skill'], makeDefault: true });
  Items.registerSheet("merp1e", Merp1eLanguageSheet, { types: ['language'], makeDefault: true });
  Items.registerSheet("merp1e", Merp1eEquipmentSheet, { types: ['equipment'], makeDefault: true });
  
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
    if(str === null) return "";
    return str.toString().toLowerCase();
  });

  Handlebars.registerHelper('toUpperCase', function(str) {
    if(str === null) return "";
    return str.toString().toUpperCase();
  });

  Handlebars.registerHelper('isNotEqual', function(a, b) {
    return a != b;
  });

  Handlebars.registerHelper('isEqual', function(a, b) {
    return a == b;
  });

  // Permissions Control Menu
  game.settings.registerMenu("merp1e", "importData", {
    name: "Import Data",
    label: "Data importer",
    hint: "Window to import game data",
    icon: "fas fa-user-lock",
    type: GenericImporter,
    restricted: true
  });

    // User Role Permissions
  game.settings.register("merp1e", "importData", {
		name: "Import Data",
    label: "Data importer",
		hint: "Window to import game data",
    icon: "fas fa-user-lock",
		scope: "world",
		config: true,
    type: Object,
    restricted: true
	});

  // Preload template partials.
  preloadHandlebarsTemplates();
});