/* TODO:

    * Localize
    * Allow OriginId (and hide the icon when it does not exist)
    * put light/medium/severe as icons
    * put duration type (combat (sword), time (clock), indefinite (infinite) as icons)

MERP1E.DamageDescription.Hits
MERP1E.EffectType.Hits
*/
import { formatBonus, replaceData } from "../util.js";
import { Merp1eEffect, Merp1eEffectAdapter } from "./base-effects.js";
import { Merp1eTimeStamp } from "../timestamp.js";
import { Merp1eOrigin } from "../origin.js";

export class Merp1eInjuryEffect extends Merp1eEffect {
    static registeredAdapters = []; // filled by a dummy on each subclass

    _onCreate(data, options, userId) {
        data.origin = new Merp1eOrigin(options.origin);
    }

    get hitsValue() {
        return this.effectAdapter?.hitsValue;
    }

    // origin control
    get origin() {
        return new Merp1eOrigin(this.getEffectFlag("origin"));
    }

    // apply control
    apply(actor, change) {
        if(this.applied) return;

        super.apply(actor, change);

        this.asyncApply(actor, change);
    }

    async asyncApply(actor, change) {
        if(!await this.effectAdapter?.onApply(actor, change)) return;
        
        await this.stampTime("appliedAt");
    }
    get applied() {
        return this.appliedAt != null;
    }
    
    get appliedAt() {
        return this.getEffectFlag("appliedAt");
    }

    get appliedAtText() {
        return new Merp1eTimeStamp(this.getEffectFlag("appliedAt")).makeString();
    }

    // candy for flag manipulation
    getEffectFlag(name) {
        return this.getFlag("merp1e", "InjuryEffect." + name);
    }
    
    async setEffectFlag(name, value) {
        return await this.setFlag("merp1e", "InjuryEffect." + name, value);
    }

    async stampTime(flagName = "timestamp") {
        return await this.setEffectFlag(flagName, Merp1eTimeStamp.generateGameTimeStamp());
    }
}

export class Merp1eInjuryEffectAdapter extends Merp1eEffectAdapter {
    static get adapterType() {
        return "InjuryEffect";
    };

    // async _copyEffectToActor(actor) {
    //     return await actor.createEmbeddedDocuments("ActveEffect", [this.effect.toObject()], {renderSheet: false});
    // }

    get actor() {
        return this.effect.parent.documentName == "Actor" ? this.effect.parent : null;
    }

    async onApply(effect) {
        if(this.applied) return false;

        if(!this.actor) return false;

        if(!this.rolled) return this._rollFormula();
    }

    get initialValue() {
        return parseInt(this.getEffectFlag("initialValue")) || null;
    }

    get currentValue() {
        return parseInt(this.getEffectFlag("currentValue")) || null;
    }

    set currentValue(value) {
        return this.setEffectFlag("currentValue", value);
    }

    get formula() {
        return this.getEffectFlag("formula");
    }

    get rolled() {
        return this.getEffectFlag("rolled") || false;
    }

    async _rollFormula() {
        if(!this.formula) return false;
        if(this.formula == "") return false;
        const roll = new Roll(this.formula);
        await roll.evaluate();
        const result = await roll.result;
        await this.setEffectFlag("rolled", true);
        await this.setEffectFlag("initialValue", result);
        await this.setEffectFlag("currentValue", result);

        return true;
    }

    static getData(sheetData) {
        sheetData.isRolled = sheetData.data.flags.merp1e.Hits?.rolled || false;
        sheetData.isApplied = sheetData.data.flags.merp1e.InjuryEffect?.appliedAt ? true : false;
        if(sheetData.isApplied) {
            sheetData.appliedText = new Merp1eTimeStamp(sheetData.data.flags.merp1e.InjuryEffect?.appliedAt).toString();
        } else {
            sheetData.appliedText = "";
        }
        
        //sheetData.injuryTypes = game.merp1e.Merp1eRules.injury.types;
        //sheetData.injuryLocations = game.merp1e.Merp1eRules.injury.locations;
        //sheetData.injuryCategories = game.merp1e.Merp1eRules.injury.categories;
        //sheetData.injuryDurations = game.merp1e.Merp1eRules.injury.durations;
    }
}

class Merp1eInjuryEffectHits extends Merp1eInjuryEffectAdapter {
    static dummy = Merp1eInjuryEffect.registeredAdapters.push(this)
    static adapterName = "Hits";

    generateDescription() {
        if (this.initialValue == 0) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }

        return replaceData(game.i18n.localize("MERP1E.InjuryDescription.Hits"),
            {
                HITS: this.rolled ? this.initialValue : this.formula,
            });
    }

    get hitsValue() {
        return this.currentValue || 0;
    }
}

class Merp1eInjuryEffectHeal extends Merp1eInjuryEffectAdapter {
    static dummy = Merp1eInjuryEffect.registeredAdapters.push(this)
    static adapterName = "Heal";

    generateDescription() {
        if (this.initialValue == 0) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }

        return replaceData(game.i18n.localize("MERP1E.InjuryDescription.Heal"),
            {
                HITS: this.rolled ? this.initialValue : this.formula,
            });
    }

    get hitsValue() {
        return -(this.currentValue || 0);
    }
}

class Merp1eInjuryEffectHitsPerRound extends Merp1eInjuryEffectAdapter {
    static dummy = Merp1eInjuryEffect.registeredAdapters.push(this)
    static adapterName = "HitsPerRound";

    generateDescription() {
        if (this.initialValue == 0) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }

        return replaceData(game.i18n.localize("MERP1E.DamageDescription.HitsPerRound"),
            {
                VALUE: formatBonus(this.initialValue),
            });
    }

    get initialValue() {
        return parseInt(this.getEffectFlag("value") || 0);
    }

    get category() {
        return this.getEffectFlag("category") || this.constructor.resolveCategory(this.initialValue);
    }

    static resolveCategory(value) {
        if(value == 0) return null;
        if(value <= 5) return "light";
        if(value <= 10) return "medium";
        return "severe";
    }

    static getData(sheetData) {
        super.getData(sheetData);
        sheetData.defaultCategory = this.resolveCategory(sheetData.effect.flags.merp1e.HitsPerRound.value);
    }

}

class Merp1eInjuryEffectPenalty extends Merp1eInjuryEffectAdapter {
    static dummy = Merp1eInjuryEffect.registeredAdapters.push(this)
    static adapterName = "Penalty";

    generateDescription() {
        if (this.initialValue == 0) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }

        return replaceData(game.i18n.localize("MERP1E.DamageDescription.Penalty"),
            {
                VALUE: formatBonus(this.initialValue),
            });
    }

    get initialValue() {
        return parseInt(this.getEffectFlag("value") || 0);
    }

    get category() {
        return this.getEffectFlag("category") || this.constructor.resolveCategory(this.initialValue);
    }

    get location() {
        return this.getEffectFlag("location");
    }

    get type() {
        return this.getEffectFlag("type");
    }

    static resolveCategory(value) {
        if(value >= 0) return null;
        if(value >= -20) return "light";
        if(value >= -50) return "medium";
        return "severe";
    }
    
    async applyInjury() {
        return;
    }

    static getData(sheetData) {
        super.getData(sheetData);
        sheetData.defaultCategory = this.resolveCategory(sheetData.effect.flags.merp1e.Penalty.value);
    }
}

