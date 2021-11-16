import { Merp1eBaseItemSheet } from './base-sheet.js';
import { Merp1eModifier, Merp1eModifiersHelper } from '../modifier.js';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {Merp1eBaseItemSheet}
 */
export class Merp1eSkillSheet extends Merp1eBaseItemSheet {
  modifierHelper = null;
  
  constructor(table, options) {
    super(table, options);
    this.modifierHelper = new Merp1eModifiersHelper("flags.merp1e.modifiers");
  }

/** @override */
  getData() {
    const sheetData = super.getData();
    sheetData.enableFunctions = Merp1eModifier.enableFunctions;
    sheetData.valueFunctions = Merp1eModifier.valueFunctions;
    sheetData.results = game.merp1e.Merp1eRules.staticManeuverResults();
    sheetData.data.data.staticManeuverTexts ??= {};
    sheetData.results.forEach((row) => { sheetData.data.data.staticManeuverTexts[row.id] ??= row.text }); // fill defaults
    this.modifierHelper.getData(sheetData);
    return sheetData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    this.modifierHelper.activateListeners(html, this);
  }

  /** @override */
  _updateObject(event, formData) {  
    formData = this.modifierHelper.updateObject(formData);

    const skillWithSameReference = game.merp1e.Merp1eRules.skill.getAvaliableByReference(formData?.["data.reference"]);
    if(this.item.parent) { // in an actor, the reference must exist
      if(!skillWithSameReference) {
        ui.notifications.error(game.i18n.localize("MERP1E.SkillSheet.ReferenceMustExist"));
        return false;
      }
    } else { // in the folder, the reference must be unique
      if(skillWithSameReference && this.item.id != skillWithSameReference?.id) {
        ui.notifications.error(game.i18n.localize("MERP1E.SkillSheet.ReferenceAlreadyExist"));
        return false;
      }
    }

    return this.object.update(formData);
  }
}