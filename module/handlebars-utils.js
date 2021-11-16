import { formatBonus } from "./util.js";
import { Merp1eItemEffect } from "./effect/item-effects.js";
import { Merp1eInjuryEffect } from "./effect/injury-effects.js";

export const registerHandlebarsHelpers = async function() {
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
    /*
    Handlebars.registerHelper('toLowerCase', function(str) {
    if(str === null) return "";
    return str.toString().toLowerCase();
    });
    */
    Handlebars.registerHelper('toUpperCase', function(str) {
    if(str === null) return "";
    return str.toString().toUpperCase();
    });

    Handlebars.registerHelper('default', function(a, b) {
    return a || b;
    });

    // read only if - makes an input read only iuf parameter is true
    Handlebars.registerHelper('not', function(a) {
        return !a;
    });

    // read only if - makes an input read only iuf parameter is true
    Handlebars.registerHelper('roif', function(a) {
        return new Handlebars.SafeString(a ? "readonly tabindex=-1 aria-disabled='true'" : "class='userentry'");
    });

    // read only if - makes an input read only iuf parameter is true
    Handlebars.registerHelper('ro', function() {
        return new Handlebars.SafeString("readonly tabindex=-1 aria-disabled='true'");
    });
    
    // read only if - makes an input read only iuf parameter is true
    Handlebars.registerHelper('isGM', function() {
        return game.user.isGM;
    });

    // read only if - makes an input read only iuf parameter is true
    Handlebars.registerHelper('gmonly', function() {
        return new Handlebars.SafeString(game.user.isGM ? "class='userentry'" : "readonly tabindex=-1 aria-disabled='true'");
    });
    
    Handlebars.registerHelper('in', function(data, array) {
        return array.find((val) => val == data) == data;
    });

    Handlebars.registerHelper('le', (v1, v2) => v1 <= v2);
    Handlebars.registerHelper('ge', (v1, v2) => v1 >= v2);

    // read only if - makes an input read only iuf parameter is true
    Handlebars.registerHelper('rw', function() {
        return new Handlebars.SafeString(`class='userentry'`);
    });

    Handlebars.registerHelper('formatBonus', function(value) {
        return new Handlebars.SafeString(formatBonus(value));
    });

    let button = function(step, icon, title = null) {
        let titleHTML = title ? `title="{{localize '${title}'}}" ` : "";

        return new Handlebars.SafeString(`
        <div style="padding-left: 3px; padding-right: 3px; flex: 0;" class="button-control" data-step="${step}" data-action="step">
            <i ${titleHTML}class="${icon}"></i>
        </div>`);
    };

    Handlebars.registerHelper('plusButton', function(data, step = 1, title = null, onlyif = true) { 
        if(! onlyif) return;
        return button(step, "fas fa-plus", title);
    });
    Handlebars.registerHelper('minusButton', function(data, step = -1, title = null, onlyif = true) { 
        if(! onlyif) return;
        return button(step, "fas fa-minus", title);
    });

    // calculates Right/Left/Both
    Handlebars.registerHelper('leftRightMap', function(left, right) {
    left = left || "0";
    right = right || "0";
    if( left == "0") {
        if( right == "0" ) {
        return "0";
        } else { // right != 0, left == 0
        return "2";
        }
    } else { // left != 0
        if( right == "0" ) {
        return "1";
        } else { // right != 0, left != 0
        return "3";
        }
    }
    });
}; 

/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
    // Define template paths to load
    const templatePaths = [
      "systems/merp1e/templates/actor/parts/character-sheet-actions.html",
      "systems/merp1e/templates/actor/parts/character-sheet-description.html",
      "systems/merp1e/templates/actor/parts/character-sheet-effects.html",
      "systems/merp1e/templates/actor/parts/character-sheet-equipments.html",
      "systems/merp1e/templates/actor/parts/character-sheet-health.html",
      "systems/merp1e/templates/actor/parts/character-sheet-injuries.html",
      "systems/merp1e/templates/actor/parts/character-sheet-languages.html",
      "systems/merp1e/templates/actor/parts/character-sheet-money.html",
      "systems/merp1e/templates/actor/parts/character-sheet-skills.html",
      "systems/merp1e/templates/actor/parts/character-sheet-specials.html",
      "systems/merp1e/templates/actor/parts/character-sheet-spells.html",
      "systems/merp1e/templates/actor/parts/character-sheet-stat-line.html",
      "systems/merp1e/templates/actor/parts/character-sheet-stats.html",
      "systems/merp1e/templates/actor/parts/character-sheet-status.html",
      "systems/merp1e/templates/actor/parts/character-sheet-xp.html",
      "systems/merp1e/templates/chat/parts/difficulty-part.html",
      "systems/merp1e/templates/chat/parts/modifiers-part.html",
      "systems/merp1e/templates/chat/parts/roll-part.html",
      "systems/merp1e/templates/chat/parts/skill-part.html",
      "systems/merp1e/templates/chat/parts/target-part.html",
      "systems/merp1e/templates/chat/parts/total-part.html",
      "systems/merp1e/templates/item/parts/description.html",
      "systems/merp1e/templates/item/parts/effects.html",
      "systems/merp1e/templates/parts/modifiers-table.html",
      "systems/merp1e/templates/parts/modifiers-line.html",
      "systems/merp1e/templates/parts/modifier-line.html",
      "systems/merp1e/templates/parts/realm-chooser.html",
      "systems/merp1e/templates/parts/skill-chooser.html",
      "systems/merp1e/templates/parts/spell-chooser.html",
    ];
    Merp1eItemEffect.registerParts(templatePaths);
    Merp1eInjuryEffect.registerParts(templatePaths);

    // Load the template parts
    return loadTemplates(templatePaths);
};

