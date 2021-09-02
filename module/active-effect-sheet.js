import { Merp1eActiveEffect } from "./active-effect.js"

export class Merp1eActiveEffectSheet extends DocumentSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
        classes: ["merp1e", "sheet", "actor"],
        width: 700,
        height: 600,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    /** @override */
    get template() {
        const path = "systems/merp1e/templates";
        // Return a single sheet for all item types.
        //return `${path}/item-sheet.html`;
        // Alternatively, you could use the following return statement to do a
        // unique item sheet by type, like `weapon-sheet.html`.

        return `${path}/active-effect-sheet.html`;
    }


    /** @override */
    getData() {
        let sheetData = super.getData()
        sheetData.effectTypes = Merp1eActiveEffect.effectTypes.reduce( (acc, cls) => { acc.push({ value: cls.effectName, label: cls.label }); return acc;}, []);
        sheetData.skills = game.merp1e.Merp1eRules.generateSheetOrder();
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

