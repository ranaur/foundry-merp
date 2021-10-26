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
    sheetData.isGM = game.user.isGM;
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
    if(!game.user.isGM) {
      html.find('.gm-select-only').prop('disabled', true);
    }
  }
}

