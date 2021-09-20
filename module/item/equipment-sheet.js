//import { ArraySheetHelper } from '../array-sheet-helper.js';
import { Merp1eActiveEffectHelper } from '../active-effect-helper.js';
import { Merp1eBaseItemSheet } from './base-sheet.js';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class Merp1eEquipmentSheet extends Merp1eBaseItemSheet {
  effectsHelper = null;

  /** @override */
  getData() {
    const sheetData = super.getData();
    sheetData.spellHierarchy = sheetData.rules.spell.getSpellHierarchy();
    sheetData.rules.skill.sheetOrder = sheetData.rules.skill.generateSheetOrder();
    return sheetData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
    //html.find(".list-control").on("click", ListSheetHelper.onClickControl.bind(this)); 
    //this.effectsHelper = new ArraySheetHelper("effects", this, { name: "New Effect" });
    Merp1eActiveEffectHelper.activateListeners(html, this.item);
  }

  /** @override */
  _updateObject(event, formData) {
    /*formData = ListSheetHelper.update(formData, this, "skillBonuses");
    formData = ListSheetHelper.update(formData, this, "onUseBonuses");
    formData = ListSheetHelper.update(formData, this, "conditionalBonuses");
    formData = ListSheetHelper.update(formData, this, "dailySpells");
    formData = ListSheetHelper.update(formData, this, "chargedSpells");
    formData = ListSheetHelper.update(formData, this, "ppMultiplier");
    formData = ListSheetHelper.update(formData, this, "spellAdder");
    */
    //formData = this.effectsHelper.updateObject(formData);
    return this.object.update(formData);
  }
}

