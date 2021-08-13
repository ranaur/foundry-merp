import { Merp1eActiveEffect } from "../active-effect.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class Merp1eBaseItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["merp1e", "sheet", "item"],
      width: 520,
      height: 640,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/merp1e/templates/item";
    // Return a single sheet for all item types.
    //return `${path}/item-sheet.html`;
    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

    return `${path}/${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const sheetData = super.getData();
    sheetData.rules = game.merp1e.Merp1eRules;
    return sheetData;
  }

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  activateListeners(html) {
    super.activateListeners(html);
    Merp1eActiveEffect.activateListeners(html, this.item);
  }

  /* -------------------------------------------- */
  _generateSkillOrder() {
    let skillByGroups = {};

    // initialize skill groups with all skill groups in rules
    for(let [name, group] of Object.entries(game.merp1e.Merp1eRules.skill.groups)) {
      skillByGroups[name] = {
        name: name,
        order: group.order,
        skills: []
      }
    }

    // fill skill groups with skills
    for(let skill of Object.values(game.data.items.filter((item) => { return item.type == "skill"; }))) {
      let groupName = skill.data.group;
      skillByGroups[groupName].skills.push(skill);
    }

    // reorder skills inside the groups and generate sheetOrder array
    let sheetOrder = Object.values(skillByGroups).reduce( (acc, group) => {
      group.skills.sort(function(first, second) {
        return first.order - second.order;
      });
      acc.push(group);
      return acc;
    }, []);
    // reorder groups in sheetOrder 
    sheetOrder.sort(function(first, second) {
      return first.order - second.order;
    });

    return sheetOrder;
  }
}

