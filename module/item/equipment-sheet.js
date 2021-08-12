import { ListSheetHelper } from '../list-helper.js'
import { Merp1eBaseItemSheet } from './base-sheet.js';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class Merp1eEquipmentSheet extends Merp1eBaseItemSheet {

  /** @override */
  getData() {
    const sheetData = super.getData();
    sheetData.spellHierarchy = sheetData.rules.spell.getSpellHierarchy();
    sheetData.rules.skill.sheetOrder = this._generateSkillOrder();
    return sheetData;
  }

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
    formData = ListSheetHelper.update(formData, this, "ppMultiplier");
    formData = ListSheetHelper.update(formData, this, "spellAdder");

    return this.object.update(formData);
  }
}

