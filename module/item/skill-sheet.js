import { Merp1eBaseItemSheet } from './base-sheet.js';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {Merp1eBaseItemSheet}
 */
export class Merp1eSkillSheet extends Merp1eBaseItemSheet {
  /** @override */
  getData() {
    const data = super.getData();
    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
  }

  /** @override */
  _updateObject(event, formData) {
    return this.object.update(formData);
  }
}

