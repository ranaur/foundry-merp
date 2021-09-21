import { Merp1eEffect } from "./active-effect.js"
import { Merp1eEffectCondition } from "./active-effect-condition.js";
import { findByID } from "./util.js";
import { Merp1eModifier } from "./modifier.js"

export class Merp1eActiveEffectSheet extends DocumentSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
        classes: ["merp1e", "sheet", "actor"],
        title: "Active Effect", // XXX I18
        width: 700,
        height: 600,
        tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
        closeOnSubmit: false,
        submitOnClose: true,
        submitOnChange: true,
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
        let sheetData = super.getData();
        sheetData.rules = game.merp1e.Merp1eRules;
        sheetData.effect = sheetData.data;
        sheetData.effectTypes = Merp1eEffect.registeredTypes.reduce( (acc, cls) => { acc.push({ id: cls.effectName, label: cls.label }); return acc;}, []);
        sheetData.conditionTypes = Merp1eEffectCondition.registeredTypes.reduce( (acc, cls) => { acc.push({ id: cls.conditionName, label: cls.label }); return acc;}, []);
        sheetData.sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder();
        sheetData.shieldBaseBonus = findByID(game.merp1e.Merp1eRules.defense.shieldTypes, sheetData.effect.flags?.merp1e?.Shield?.type, "none").bonus;
        sheetData.armGreavesBaseBonus = findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, sheetData.effect.flags?.merp1e?.ArmGreaves?.type, "none").bonus;
        sheetData.legGreavesBaseBonus = findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, sheetData.effect.flags?.merp1e?.LegGreaves?.type, "none").bonus;
        sheetData.helmBaseBonus = findByID(game.merp1e.Merp1eRules.defense.helmTypes, sheetData.effect.flags?.merp1e?.Helm?.type, "none").bonus;
        sheetData.modifierEnableFunctions = Merp1eModifier.enableFunctions;
        sheetData.modifierValueFunctions = Merp1eModifier.valueFunctions;
        sheetData.rollTypes = game.merp1e.Merp1eRules.rollTypes;
        
        //sheetData.armorBaseBonus = findByID(game.merp1e.Merp1eRules.defense.armorTypes, sheetData.effect.flags?.merp1e?.Armor?.type, "no").bonus;
        return sheetData;
    }

    /** @override */
    _updateObject(event, formData) {
        if(!this.readOnly) return this.object.update(formData);
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;
    }
}

