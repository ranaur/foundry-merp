import { Merp1eInjuryHelper } from './injury-helper.js';
import { Merp1eItemEffect } from "./item-effects.js"
import { Merp1eInjuryEffect } from "./injury-effects.js"
import { Merp1eEffectCondition } from "./condition.js";
import { toKebabCase } from "../util.js";
import { Merp1eTimeframeHelper } from "../timeframe.js";
import { Merp1eModifier } from "../modifier.js";
import { Merp1eDuration } from "../duration.js";
import { Merp1eCalendar } from "../calendar.js";

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

        sheetData.durationTypes = Merp1eDuration.types;
        
        sheetData.hasDuration = this.object.hasDuration;
        sheetData.effectActive = this.object.isActive;
        if(sheetData.hasDuration) {
            Merp1eTimeframeHelper.processGetData(sheetData, "durationFrame", "durationNumber", sheetData.data.duration.seconds)

            if(sheetData.data.duration.startTime != null) {
                const startDate = Merp1eCalendar.world2date(sheetData.data.duration.startTime);
                sheetData.durationStartTimeText = startDate.strTime + "\n" + startDate.strDate;
                sheetData.durationEndTime = sheetData.data.duration.startTime + sheetData.data.duration.seconds;
                const endDate = Merp1eCalendar.world2date(sheetData.durationEndTime);
                sheetData.durationEndTimeText = endDate.strTime + "\n" + endDate.strDate;;
            } else {
                sheetData.durationStartTimeText = "";
                sheetData.durationEndTime = null;
                sheetData.durationEndTimeText = "";
            }
    
            sheetData.durationType = "indefinite";
            if(sheetData.data.duration.rounds != null ) sheetData.durationType = "combat";
            if(sheetData.data.duration.turns != null) sheetData.durationType = "combat";
            if(sheetData.data.duration.seconds != null ) sheetData.durationType = "timeBased";
        }

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

        switch(formData.durationType) {
            case "indefinite":
                formData["duration.rounds"] = null;
                formData["duration.turns"] = null;
                formData["duration.seconds"] = null;
                break;
            case "timeBased":
                formData["duration.rounds"] = null;
                formData["duration.turns"] = null;
                formData["durationFrame"] ??= "seconds";
                formData["durationNumber"] ??= 1;
                formData["duration.seconds"] = Merp1eTimeframeHelper.processUpdate(formData, "durationFrame", "durationNumber");
                break;
            case "combat":
                formData["duration.rounds"] ??= 1;
                formData["duration.turns"] ??= 0;
                formData["duration.seconds"] = null;
                break;
        }
        

        return await this.object.update(formData);
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        Merp1eInjuryHelper.activateListeners(html, this);
    }
}

