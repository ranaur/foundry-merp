import { Merp1eActiveEffectHelper } from '../effect/effect-helper.js';
import { Merp1eBaseItemSheet } from './base-sheet.js';

/**
 * @extends {Merp1eItem}
 */
export class Merp1eSpecialSheet extends Merp1eBaseItemSheet {
  /** @override */
  getData() {
    let sheetData = super.getData();
    Merp1eActiveEffectHelper.getDataHelper(this.object, sheetData);
    return sheetData;
  }

  /** @override */
  _updateObject(event, formData) {
    return this.object.update(formData);
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    Merp1eActiveEffectHelper.activateListeners(html, this.item);
  }
}

