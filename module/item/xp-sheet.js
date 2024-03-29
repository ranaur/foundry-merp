import { Merp1eBaseItemSheet } from './base-sheet.js';

/**
 * @extends {Merp1eItem}
 */
export class Merp1eXPSheet extends Merp1eBaseItemSheet {
  /** @override */
  getData() {
    let sheetData = super.getData()
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
  }
}

