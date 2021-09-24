import { Merp1eBaseItemSheet } from './base-sheet.js';
import { ArraySheetHelper } from '../array-sheet-helper.js';
import { Merp1eModifier } from '../modifier.js';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {Merp1eBaseItemSheet}
 */
export class Merp1eSkillSheet extends Merp1eBaseItemSheet {
  modifierHelper = null;
  
  /** @override */
  getData() {
    const data = super.getData();
    data.enableFunctions = Merp1eModifier.enableFunctions;
    data.valueFunctions = Merp1eModifier.valueFunctions;
    data.results = game.merp1e.Merp1eRules.staticManeuverResults();
    data.data.data.staticManeuverTexts ??= {};
    data.results.forEach((row) => { data.data.data.staticManeuverTexts[row.id] ??= row.text }); // fill defaults
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
    this.modifierHelper = new ArraySheetHelper("modifiers", this, { value: 0, optional: true, label: "New Modifier" });
    this.modifierHelper.activateListeners(html);
  }

  /** @override */
  _updateObject(event, formData) {  
    formData = this.modifierHelper.updateObject(formData);  
    const skillWithSameReference = game.merp1e.Merp1eRules.skill.getAvaliableByReference(formData?.["data.reference"]);
    if(skillWithSameReference && this.item.id != skillWithSameReference?.id) {
      ui.notifications.error(game.i18n.localize("MERP1E.SkillSheet.ReferenceExist"));
      return false;
    }
    return this.object.update(formData);
  }
}

