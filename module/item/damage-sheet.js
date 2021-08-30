import { Merp1eBaseItemSheet } from './base-sheet.js';

/**
 * @extends { Merp1eBaseItemSheet }
 */
export class Merp1eDamageSheet extends Merp1eBaseItemSheet {
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

    html.find(".sheet-header").on("click", ".damage-control", this.onClickDamageControl.bind(this));
  }

  async onClickDamageControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;

    switch ( action ) {
    case "apply":
      this.item.apply();
      this.submit();
      break;
    }
  }
}

