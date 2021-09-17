import { formatBonus } from "./util.js";

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
    Handlebars.registerHelper('roif', function(a) {
        return new Handlebars.SafeString(a ? "readonly tabindex=-1 aria-disabled='true'" : "class='userentry'");
    });

    // read only if - makes an input read only iuf parameter is true
    Handlebars.registerHelper('ro', function() {
        return new Handlebars.SafeString("readonly tabindex=-1 aria-disabled='true'");
    });
    
    // read only if - makes an input read only iuf parameter is true
    Handlebars.registerHelper('rw', function(cssClass) {
        return new Handlebars.SafeString(`class='userentry ${cssClass}'`);
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
      "systems/merp1e/templates/parts/skill-chooser.html",
      "systems/merp1e/templates/parts/realm-chooser.html",
      "systems/merp1e/templates/parts/spell-chooser.html",
      "systems/merp1e/templates/item/parts/special-effects.html",
      "systems/merp1e/templates/actor/parts/character-sheet-stat-line.html",
      "systems/merp1e/templates/actor/parts/character-sheet-stats.html",
      "systems/merp1e/templates/actor/parts/character-sheet-description.html",
      "systems/merp1e/templates/actor/parts/character-sheet-languages.html",
      "systems/merp1e/templates/actor/parts/character-sheet-skills.html",
      "systems/merp1e/templates/actor/parts/character-sheet-health.html",
      "systems/merp1e/templates/actor/parts/character-sheet-equipment.html",
      "systems/merp1e/templates/actor/parts/character-sheet-xp.html",
      "systems/merp1e/templates/actor/parts/character-sheet-effects.html",
      "systems/merp1e/templates/actor/parts/character-sheet-status.html",
      "systems/merp1e/templates/actor/parts/character-sheet-spells.html"
    ];
  
    // Load the template parts
    return loadTemplates(templatePaths);
};