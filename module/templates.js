/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [
    // Attribute list partial.
    "systems/merp1e/templates/parts/active-effects.html",
    "systems/merp1e/templates/parts/skill-chooser.html",
    "systems/merp1e/templates/parts/realm-chooser.html",
    "systems/merp1e/templates/parts/spell-chooser.html",
    "systems/merp1e/templates/actor/parts/character-sheet-stat-line.html",
    "systems/merp1e/templates/actor/parts/character-sheet-stats.html",
    "systems/merp1e/templates/actor/parts/character-sheet-description.html",
    "systems/merp1e/templates/actor/parts/character-sheet-languages.html",
    "systems/merp1e/templates/actor/parts/character-sheet-skills.html",
    "systems/merp1e/templates/actor/parts/character-sheet-health.html",
    "systems/merp1e/templates/actor/parts/character-sheet-xp.html",
    "systems/merp1e/templates/actor/parts/character-sheet-spells.html"
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};