import { findByID } from "../util.js";
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
    sheetData.bodyPlaces = sheetData.rules.bodyPlaces;
    if(this.item?.parent?.locations) {
      sheetData.locations = [ 
        findByID(sheetData.rules.mainLocations, "carrying"),
        findByID(sheetData.rules.mainLocations, "stored"),
      ];
      
      if(sheetData.data.data.isWearable) sheetData.locations.push(findByID(sheetData.rules.mainLocations, "wearing"));
      
      this.item.parent.locations.forEach((loc) => { if(loc.item.id != this.object.id) sheetData.locations.push(loc); } );
    } else {
      sheetData.locations = null;
    }
    sheetData.currencies = sheetData.rules.currencies;
    Merp1eActiveEffectHelper.getDataHelper(this.object, sheetData);
    return sheetData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
    Merp1eActiveEffectHelper.activateListeners(html, this.item);
  }

  /** @override */
  _updateObject(event, formData) {
    if(!formData["data.isFungible"]) formData["data.quantity"] = 1;

    return this.object.update(formData);
  }
}

