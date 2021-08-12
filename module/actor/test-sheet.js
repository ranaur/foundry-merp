import { LanguageSheetHelper } from '../language-helper.js';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class Merp1eTestSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["merp1e", "sheet", "actor"],
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */
  /** @override */
  get template() {
    const path = "systems/merp1e/templates/actor";
    // Return a single sheet for all item types.
    //return `${path}/item-sheet.html`;
    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

    return `${path}/test-sheet.html`;
  }

  /** @override */
  getData() {
    const data = super.getData();
    data.data = data.data.data;
    return data;
  }

  /** @override */
  _updateObject(event, formData) {
    return this.object.update(formData);
  }
}

