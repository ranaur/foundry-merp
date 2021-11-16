import { Merp1eModifiersHelper } from "../modifier.js";
import { Merp1eRollTable } from "./rolltable.js";

export class Merp1eRollTableConfig extends RollTableConfig {
    /** @override */
    get template() {
        return `${game.templatesPath}/sheets/roll-table-config.html`;
    }
    constructor(table, options) {
        super(table, options);
        this.modifierHelper = new Merp1eModifiersHelper("flags.merp1e.modifiers");
    }

    getData() {
        const sheetData = super.getData();

        sheetData.tableTypes = Merp1eRollTable.types;

        this.modifierHelper.getData(sheetData);

        return sheetData;
    }

    activateListeners(html) {
        super.activateListeners(html);
    
        this.modifierHelper.activateListeners(html, this);
    }

    _updateObject(event, formData) {
        formData = this.modifierHelper.updateObject(formData);
        super._updateObject(event, formData);
    }
};