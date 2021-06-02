import {ListSheetHelper} from '../list-helper.js'

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class Merp1eItemSheet extends ItemSheet {

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
    const data = super.getData();
    data.rules = game.merp1e.Merp1eRules;
    data.spellHierarchy = data.rules.spell.getSpellHierarchy();
    data.rules.skill.sheetOrder = data.rules.skill.generateSheetOrder();
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
    html.find(".list-control").on("click", ListSheetHelper.onClickControl.bind(this)); 
  }

  /** @override */
  _updateObject(event, formData) {
    formData = ListSheetHelper.update(formData, this, "skillBonuses");
    formData = ListSheetHelper.update(formData, this, "onUseBonuses");
    formData = ListSheetHelper.update(formData, this, "conditionalBonuses");
    formData = ListSheetHelper.update(formData, this, "dailySpells");
    formData = ListSheetHelper.update(formData, this, "chargedSpells");
    //formData = ListSheetHelper.update(formData, this, "fixedUsesSpells");
    //formData = ListSheetHelper.update(formData, this, "ppMultiplier");
    //formData = ListSheetHelper.update(formData, this, "spellAdder");

    return this.object.update(formData);
  }
}

