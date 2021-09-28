// Import Modules
import { Merp1eActor } from "./module/actor/actor.js";
import { Merp1eCharacterSheet } from "./module/actor/character-sheet.js";
import { Merp1eTestSheet } from "./module/actor/test-sheet.js";
import { GenericImporter } from "./module/apps/generic-importer.js";
import { Merp1eDamageSheet } from "./module/item/damage-sheet.js";
import { Merp1eEquipmentSheet } from "./module/item/equipment-sheet.js";
import { Merp1eItem } from "./module/item/item.js";
import { Merp1eLanguageSheet } from "./module/item/language-sheet.js";
import { Merp1eXPSheet } from "./module/item/xp-sheet.js";
import { Merp1eProfessionSheet } from "./module/item/profession-sheet.js";
import { Merp1eRaceSheet } from "./module/item/race-sheet.js";
import { Merp1eSkillSheet } from "./module/item/skill-sheet.js";
import { Merp1eSpellSheet } from "./module/item/spell-sheet.js";
import { Merp1eSpelllistSheet } from "./module/item/spelllist-sheet.js";
import { Merp1eRules } from "./module/rules/rules.js";
import { preloadHandlebarsTemplates, registerHandlebarsHelpers } from "./module/handlebars-utils.js";
import { Merp1eEffect } from "./module/active-effect.js";
import { Merp1eActiveEffectSheet } from "./module/active-effect-sheet.js";
import { Merp1eMenu } from "./module/menu.js";
import { Merp1eChat } from "./module/chat.js";
import { Merp1eSpecialSheet } from "./module/item/special-sheet.js";
//import { Merp1eRollOpenEnded } from "./module/dice.js";

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

  CONFIG.ActiveEffect.sheetClass = Merp1eActiveEffectSheet;
  CONFIG.ActiveEffect.documentClass = Merp1eEffect;
  CONFIG.ActiveEffect.documentClasses = Merp1eEffect.registeredClasses;

  //CONFIG.Dice.rolls.push(Merp1eRollOpenEnded);

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
  Items.registerSheet("merp1e", Merp1eXPSheet, { types: ['xp'], makeDefault: true });
  Items.registerSheet("merp1e", Merp1eEquipmentSheet, { types: ['equipment'], makeDefault: true });
  Items.registerSheet("merp1e", Merp1eDamageSheet, { types: ['damage'], makeDefault: true });
  Items.registerSheet("merp1e", Merp1eSpecialSheet, { types: ['special'], makeDefault: true });

  Hooks.on('renderSceneControls', Merp1eMenu.renderMenu); // getSceneControlButtons

  registerSettings();

  // register HandleBars Helpers
  registerHandlebarsHelpers();

  // Preload template partials.
  preloadHandlebarsTemplates();

  // CTRL Handlers for Character Sheet
  window.addEventListener('keydown', Merp1eCharacterSheet.onKeyDown.bind(this));
  window.addEventListener('keyup', Merp1eCharacterSheet.onKeyUp.bind(this));
});

Hooks.on('renderChatLog', (app, html, data) => Merp1eChat.chatListeners(app, html, data));
Hooks.on('renderChatMessage', (app, html, data) => Merp1eChat.renderMessageHook(app, html, data));
Hooks.on('updateChatMessage', (chatMessage, chatData, diff, speaker) => Merp1eChat.onUpdateChatMessage(chatMessage, chatData, diff, speaker));

function registerSettings() {
    // Permissions Control Menu
    game.settings.registerMenu("merp1e", "importData", {
      name: "Import Data",
      label: "Data importer",
      hint: "Window to import game data",
      icon: "fas fa-user-lock",
      type: GenericImporter,
      restricted: true
    });
  
  /*
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
  */

    /// XXX put in i18

  game.settings.register("merp1e", "damageControl", {
		name: "Damage Control",
    label: "Damage Control",
		hint: "How to control damage",
    icon: "fas fa-heart",
		scope: "world",
		config: true,
    type: String,
    choices: { manual: "manual", automatic: "automatic" },
    default: "manual",
    restricted: true
	});

  game.settings.register("merp1e", "xpControl", {
		name: "XP Control",
    label: "XP Control",
		hint: "How to control XP",
    icon: "fas fa-level-up",
		scope: "world",
		config: true,
    type: String,
    choices: { manual: "manual", automatic: "automatic" },
    default: "manual",
    restricted: true
	});

  game.settings.register("merp1e", "armorControl", {
		name: "Armor Control",
    label: "Armor Control",
		hint: "How to control armor,shield and greaves",
    icon: "fas fa-shield-alt",
		scope: "world",
		config: true,
    type: String,
    choices: { manual: "manual", automatic: "automatic" },
    default: "manual",
    restricted: true
	});

  game.settings.register("merp1e", "spellcastingControl", {
		name: "Spellcasting Control",
    label: "Spellcasting Control",
		hint: "How to control spellcasting (powerpoints and spell adder)",
    icon: "fas fa-magic",
		scope: "world",
		config: true,
    type: String,
    choices: { manual: "manual", automatic: "automatic" },
    default: "manual",
    restricted: true
	});

}