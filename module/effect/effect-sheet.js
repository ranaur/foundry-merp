import { Merp1eInjuryHelper } from './injury-helper.js';
import { Merp1eItemEffect } from "./item-effects.js"
import { Merp1eInjuryEffect } from "./injury-effects.js"
import { Merp1eEffectCondition } from "./condition.js";
import { toKebabCase } from "../util.js";
//import { findByID } from "./util.js";
import { Merp1eModifier } from "../modifier.js"

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
        const effectTypeKebab = toKebabCase(this.object.effectType);

        return `${path}/effect/${effectTypeKebab}-sheet.html`;
    }


    /** @override */
    getData() {
        let sheetData = super.getData();
        sheetData.rules = game.merp1e.Merp1eRules;
        sheetData.effect = sheetData.data;
        sheetData.hasConditionParameters = this.object.conditionClass.hasParameters;
        
        sheetData.itemAdapterTypes = Merp1eItemEffect.registeredAdapters.reduce( (acc, cls) => { acc.push({ id: cls.adapterName, label: cls.label }); return acc;}, []);
        sheetData.damageAdapterTypes = Merp1eInjuryEffect.registeredAdapters.reduce( (acc, cls) => { acc.push({ id: cls.adapterName, label: cls.label }); return acc;}, []);
        sheetData.conditionTypes = Merp1eEffectCondition.registeredTypes.reduce( (acc, cls) => { acc.push({ id: cls.conditionName, label: cls.label }); return acc;}, []);
        
        sheetData.modifierEnableFunctions = Merp1eModifier.enableFunctions;
        sheetData.modifierValueFunctions = Merp1eModifier.valueFunctions;

        // GAMBIARRA XXX
        if(!sheetData.effect.flags.merp1e.adapterName) {
            sheetData.effect.flags.merp1e.adapterName = sheetData.effect.flags.merp1e.effectType;
            sheetData.effect.flags.merp1e.effectType = "ItemEffect";
        }
        // END OF GAMBIARRA XXX
        this.object.effectClass?.getData(sheetData);

        return sheetData;
    }

    /** @override */
    async _updateObject(event, formData) {
        //this.object.parent.sheet.render(true); // XXX1
        if(this.readOnly) return;
        
        this.object?.updateObject(event, formData);

        return await this.object.update(formData);
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        Merp1eInjuryHelper.activateListeners(html, this);
    }
}

