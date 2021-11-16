import { Merp1eActiveEffectHelper } from '../effect/effect-helper.js';
import { ArraySheetHelper } from '../array-sheet-helper.js';
import { Merp1eBaseItemSheet } from './base-sheet.js';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class Merp1eRaceSheet extends Merp1eBaseItemSheet {
  languagesHelper = null;
  
  /* -------------------------------------------- */

  /** @override */
  getData() {
    let sheetData = super.getData()
    sheetData.data = sheetData.data.data
    sheetData.stats = game.merp1e.Merp1eRules.stats;
    sheetData.sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder();
    Merp1eActiveEffectHelper.getDataHelper(this.object, sheetData);
    return sheetData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;
    
    this.languagesHelper = new ArraySheetHelper("languages", this, { name: "New Language", ranks: 0 });

    this.languagesHelper.activateListeners(html);
    Merp1eActiveEffectHelper.activateListeners(html, this.item);
  }

  /** @override */
  _updateObject(event, formData) {
    formData = this.languagesHelper.updateObject(formData);
    return this.object.update(formData);
  }
}


