/* TODO:

    * Localize
    * Allow OriginId (and hide the icon when it does not exist)
    * put light/medium/severe as icons
    * put duration type (combat (sword), time (clock), indefinite (infinite) as icons)

MERP1E.DamageDescription.Hits
MERP1E.EffectType.Hits
*/
import { confirmDialog, min, max, findByID, formatBonus, replaceData } from "../util.js";
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

    get treatedAt() {
        return this.getEffectFlag("treatedAt");
    }

    async applyTreatment() {
        return await this.stampTime("treatedAt");
    }
}

export class Merp1eInjuryEffectAdapter extends Merp1eEffectAdapter {
    static get adapterType() {
        return "InjuryEffect";
    };

    // async _copyEffectToActor(actor) {
    //     return await actor.createEmbeddedDocuments("ActveEffect", [this.effect.toObject()], {renderSheet: false});
    // }

    get hitsValue() { return 0; }

    get actor() {
        return this.effect.parent.documentName == "Actor" ? this.effect.parent : null;
    }

    async onApply(effect) {
        if(this.applied) return false;

        if(!this.actor) return false;

        if(!this.rolled) return this._rollFormula();
    }

    get initialValue() {
        //return parseInt(this.getEffectFlag("initialValue")) || 0;
        return this.getEffectFlag("initialValue");
    }

    get currentValue() {
        //return parseInt(this.getEffectFlag("currentValue")) || 0;
        return this.getEffectFlag("currentValue");
    }

    async setCurrentValue(value) {
        return await this.setEffectFlag("currentValue", value);
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
        let result;
        const regExp = /^\s*-?\d+\s*$/;
        if(this.formula.match(regExp)) {
            result = parseInt(this.formula);
        } else { // it's a roll
            const roll = new Roll(this.formula);
            await roll.evaluate();
            result = await roll.result;
        }
        result = Math.abs(result);
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
        
        sheetData.isTreated = sheetData.data.flags.merp1e.InjuryEffect?.treatedAt ? true : false;
        if(sheetData.isTreated) {
            sheetData.treatedText = new Merp1eTimeStamp(sheetData.data.flags.merp1e.InjuryEffect?.treatedAt).toString();
        } else {
            sheetData.treatedText = "";
        }
        
        sheetData.sides = game.merp1e.Merp1eRules.sides;
        sheetData.injuryLocations = game.merp1e.Merp1eRules.injury.locations;
        sheetData.injuryLocationsBilateral = game.merp1e.Merp1eRules.injury.locationsBilateral;
        sheetData.injuryBodyGroups = game.merp1e.Merp1eRules.injury.bodyGroups;
        sheetData.injuryBodyGroupsBilateral = game.merp1e.Merp1eRules.injury.bodyGroupsBilateral;

        //sheetData.injuryTypes = game.merp1e.Merp1eRules.injury.types;
        //sheetData.injuryDurations = game.merp1e.Merp1eRules.injury.durations;
    }

    get location() {
        return this.getEffectFlag("location");
    }

    get locationIcon() {
        return findByID(game.merp1e.Merp1eRules.injury.locations, this.location, {icon: '<i class="far fa-question-circle"></i>'}).icon;
    }

    get locationObject() {
        return findByID(game.merp1e.Merp1eRules.injury.locations, this.location, null);
    }

    get bodyGroup() {
        return this.locationObject?.bodyGroup;
    }

    get bodyGroupObject() {
        return findByID(game.merp1e.Merp1eRules.injury.bodyGroups, this.bodyGroup, null);
    }

    get bodyGroupIsParied() {
        return this.bodyGroupObject?.paired;
    }

    get side() {
        return this.bodyGroupIsParied ? this.getEffectFlag("side") || "right" : "";
    }

    get bodyGroupBilateral() {
        return this.bodyGroupIsParied ? this.bodyGroup + "-" + this.side : this.bodyGroup;
    }

    get locationBilateral() {
        return this.bodyGroupIsParied ? this.location + "-" + this.side : this.location;
    }

    get statuses() {
        const statuses = duplicate(findByID(game.merp1e.Merp1eRules.injury.locationsBilateral, this.location, null)?.statuses);
        statuses.unshift("none");

        return statuses.reduce((acc, sts) => { acc.push({id: sts, label: "MERP1E.Statuses" + sts})});
    }

    get category() {
        return this.getEffectFlag("category") || this.constructor.resolveCategory(this.initialValue);
    }

    get categoryIcon() {
        return findByID(game.merp1e.Merp1eRules.injury.categories, this.category, {icon: '<i class="far fa-question-circle"></i>'}).icon;
    }

    get treatedAt() {
        return this.effect.treatedAt;
    }

    async applyTreatment() {
        return await this.effect.applyTreatment();
    }
}

class Merp1eInjuryEffectHits extends Merp1eInjuryEffectAdapter {
    static dummy = Merp1eInjuryEffect.registeredAdapters.push(this)
    static adapterName = "Hits";

    generateDescription() {
        if (!this.formula) {
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
        if (!this.formula) {
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
        if (!this.formula) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }

        return replaceData(game.i18n.localize("MERP1E.InjuryDescription.HitsPerRound"),
            {
                HPR: formatBonus(this.currentValue),
                TREATED: this.treatment == "none" ? "" : "(" + game.i18n.localize("MERP1E.InjuryDescription.Treated") + ")",
            });
    }

    get hitsValue() {
        return this.bleeds.reduce((hits, bleed) => hits + bleed.hits, 0 );
    }

    get bleeds() {
        return this.getEffectFlag("bleeds") || [];
    }

    get treatment() {
        return this.getEffectFlag("treatment");
    }

    async onApply(effect) {
        const ret = await super.onApply(effect);

        await this.setEffectFlag("treatment", "none");
        return ret;
    }

    get effectiveValue() {
        switch(this.treatment) {
            case "bandage":
                return max(0, this.currentValue - 3);
            case "tourniquet":
                return max(0, this.currentValue - 10);
            case "loosenTourniquet":
                return min(3, this.currentValue);
            default:
                return this.currentValue;
        }
    }

    async applyRound() {
        // Test for tourniquet 
        if(this.treatment == "tourniquet") {
            const secondsTourniquet = game.time.worldTime - this.treatedAt.worldTime;
            if(secondsTourniquet > 240) {
                console.error("limb is lost"); // XXX set status of the limb
            }
        }

        return await this.bleed();
    }

    async applyDay() {
        return await this.doBleedTourniquet();
    }

    async bleed() {
        if(this.effectiveValue <= 0 ) return;
        const bleeds = this.bleeds;
        const ts = Merp1eTimeStamp.generateGameTimeStamp();
        bleeds.push({ 
            hits: this.effectiveValue,
            appliedAt: ts,
            appliedAtText: (new Merp1eTimeStamp(ts)).toString(),
        });
        await this.setEffectFlag("bleeds", bleeds);
    }

    async applyTreatment(force = false) {
        if(this.currentValue <= 0 ) return;

        if(this.currentValue > 3 ) {
            return await this.doTourniquet();
        } else {
            return await this.doBandage();
        }
    }

    async doBandage() {
        if(this.currentValue <= 0 ) return;
        this.effect.applyTreatment();
        await this.setEffectFlag("treatment", "bandage");
        await this.setEffectFlag("HealsIn", 8);
        await this.setEffectFlag("HealsInTimeFrame", "hours");
    }

    async undoTreatment() {
        await this.setEffectFlag("treatment", "none");
        await this.effect.setEffectFlag("treatedAt", null);
        await this.setEffectFlag("HealsIn", null);
        await this.setEffectFlag("HealsInTimeFrame", null);
    }

    async doTourniquet() {
        if(this.currentValue <= 0 ) return;
        this.effect.applyTreatment();
        await this.setEffectFlag("treatment", "tourniquet");
        await this.setEffectFlag("HealsIn", null);
        await this.setEffectFlag("HealsInTimeFrame", null);
    }

    async loosenTourniquet() {
        if(this.treatment != "tourniquet" ) return;
        this.effect.applyTreatment();
        await this.setEffectFlag("treatment", "loosenTourniquet");
        await this.setEffectFlag("HealsIn", null);
        await this.setEffectFlag("HealsInTimeFrame", null);
    }

    async heal(value) {
        await this.setEffectFlag("toHeal", null);
        await this.setEffectFlag("currentValue", max(this.currentValue - value, 0));
    }

    static resolveCategory(value) {
        if(value == 0) return "none";
        if(value <= 5) return "light";
        if(value <= 10) return "medium";
        if(value > 10) return "severe";
        return null;
    }

    static getData(sheetData) {
        super.getData(sheetData);
        sheetData.defaultCategory = this.resolveCategory(sheetData.effect.flags.merp1e?.HitsPerRound?.currentValue);
        sheetData.injuryLocations = game.merp1e.Merp1eRules.injury.locations;
        sheetData.injuryCategories = game.merp1e.Merp1eRules.injury.categories;
        sheetData.timeframe = game.merp1e.Merp1eRules.timeframes;

        sheetData.treatments = [
            { id: "none", label: "MERP1E.Treatment.None"},
            { id: "bandage", label: "MERP1E.Treatment.Bandage"},
            { id: "tourniquet", label: "MERP1E.Treatment.Tourniquet"},
            { id: "loosenTourniquet", label: "MERP1E.Treatment.LoosenTourniquet"},
        ];
        sheetData.bleedTotal = sheetData.effect.flags.merp1e?.HitsPerRound?.bleeds?.reduce?.((hits, bleed) => hits + bleed.hits, 0 );
    }

}

class Merp1eInjuryEffectPenalty extends Merp1eInjuryEffectAdapter {
    static dummy = Merp1eInjuryEffect.registeredAdapters.push(this)
    static adapterName = "Penalty";

    generateDescription() {
        if (!this.formula) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }

        return replaceData(game.i18n.localize("MERP1E.InjuryDescription.Penalty"),
            {
                VALUE: formatBonus(this.currentValue),
            });
    }

    get category() {
        return this.getEffectFlag("category") || this.constructor.resolveCategory(this.initialValue);
    }

    get type() {
        return this.getEffectFlag("type");
    }

    get initialValue() {
        return -Math.abs(super.initialValue);
    }

    get currentValue() {
        return -Math.abs(super.currentValue);
    }

    static resolveCategory(value) {
        if(value >= 0) return "none";
        if(value >= -20) return "light";
        if(value >= -50) return "medium";
        if(value < -50) return "severe";
        return null;
    }

    updateObject(event, formData) {
        const expandedFormData = expandObject(formData);
        const timeFrame = expandedFormData.flags.merp1e.Penalty.HealsInTimeFrame;
        const healsInTime = expandedFormData.flags.merp1e.Penalty.HealsIn;

        const healsInTimeSeconds = healsInTime * findByID(game.merp1e.Merp1eRules.timeframes, timeFrame, 0)?.seconds;
        if(healsInTimeSeconds.isNaN) {
            formData["flags.merp1e.Penalty.HealsInTimeSeconds"] = null;
            formData["flags.merp1e.Penalty.HealsFirstDay"] = null;
            formData["flags.merp1e.Penalty.HealsPerDay"] = null;
        } else {
            formData["flags.merp1e.Penalty.HealsInTimeSeconds"] = healsInTimeSeconds;
            if(healsInTimeSeconds >= 3600 * 24) { // more than a day
                formData["flags.merp1e.Penalty.HealingCycle"] = "day";
                const healsInDays = parseInt(healsInTimeSeconds / 86400);
                const healsPerDay = parseInt(-expandedFormData.flags.merp1e.Penalty.currentValue / healsInDays);
                const healsFirstDay = -expandedFormData.flags.merp1e.Penalty.currentValue - (healsPerDay * healsInDays) + healsPerDay;
                formData["flags.merp1e.Penalty.HealsFirstDay"] = healsFirstDay;
                formData["flags.merp1e.Penalty.HealsPerDay"] = healsPerDay;
            } else if(healsInTimeSeconds >= 3600) { // more than on hour
                formData["flags.merp1e.Penalty.HealingCycle"] = "hour";
                const healsInHours = parseInt(healsInTimeSeconds / 3600);
                const healsPerHour = parseInt(-expandedFormData.flags.merp1e.Penalty.currentValue / healsInHours);
                const healsFirstHour = -expandedFormData.flags.merp1e.Penalty.currentValue - (healsPerHour * healsInHours) + healsPerHour;
                formData["flags.merp1e.Penalty.HealsFirstHour"] = healsFirstHour;
                formData["flags.merp1e.Penalty.HealsPerHour"] = healsPerHour;
            } // else { // round based - not proportional }
        }
    }

    async applyInjury() {
        return;
    }

    static getData(sheetData) {
        super.getData(sheetData);
        sheetData.defaultCategory = this.resolveCategory(sheetData.effect.flags?.merp1e?.Penalty?.initialValue);
        sheetData.injuryLocations = game.merp1e.Merp1eRules.injury.locations;
        sheetData.injuryCategories = game.merp1e.Merp1eRules.injury.categories;
        sheetData.injuryTypes = game.merp1e.Merp1eRules.injury.types;
        sheetData.timeframe = game.merp1e.Merp1eRules.timeframes;
    }

    async applyRound() {
        console.error( "not implemented. Affect duration?");
    }

    async applyDay() {
        if(this.healingCycle == "day") {
            let value = this.naturalRecovery.filter(nr => nr.appliedAt.worldTime >= this.treatedAt.worldTime ).length == 0 ? this.getEffectFlag("HealsFirstDay") : this.getEffectFlag("HealsPerDay");
            await this.doNaturalRecovery(value);
        }
    }

    async applyHour() {
        if(this.healingCycle == "hour") {
            let value = this.naturalRecovery.filter(nr => nr.appliedAt.worldTime >= this.treatedAt.worldTime ).length == 0 ? this.getEffectFlag("HealsFirstHour") : this.getEffectFlag("HealsPerHour");
            await this.doNaturalRecovery(value);
        }
    }

    get healingCycle() {
        return this.getEffectFlag("HealingCycle");
    }

    get naturalRecovery() {
        return this.getEffectFlag("naturalRecovery") || [];
    }

    async doNaturalRecovery(value) {
        if(this.currentValue >= 0 ) return;
        const naturalRecovery = this.naturalRecovery;
        const ts = Merp1eTimeStamp.generateGameTimeStamp();
        naturalRecovery.push({ 
            value: value,
            appliedAt: ts,
            appliedAtText: (new Merp1eTimeStamp(ts)).toString(),
        });
        await this.setEffectFlag("naturalRecovery", naturalRecovery);
        const recovery = naturalRecovery.reduce((acc, val) => acc + val.value, 0);
        await this.setEffectFlag("currentValue", min(0, this.initialValue + recovery));
    }

    async applyTreatment(force = false) {
        if(!force && this.treatedAt) {
            confirmDialog("MERP1E.Treatment.Title", "MERP1E.Treatment.Text", () => this.applyTreatment(true));
            return;
        }
        await super.applyTreatment();

        const recovery = findByID(game.merp1e.Merp1eRules.injury.types, this.type, null)?.recovery;
        const recoveryTime = recovery?.[this.category];

        await this.setEffectFlag("HealsIn", recoveryTime);
        await this.setEffectFlag("HealsInTimeFrame", "days");
    }

}

/////////////////////////////////////////////////////
class Merp1eStatusEffectPenalty extends Merp1eInjuryEffectAdapter {
    get duration() {
        return this.currentValue;
    }

    set duration(value) {
        this.setEffectFlag("currentValue", value);
    }

    decrement() {
        this.duration = this.duration - 1;
    }
}

class Merp1eStunEffectPenalty extends Merp1eStatusEffectPenalty {
    static dummy = Merp1eInjuryEffect.registeredAdapters.push(this)
    static adapterName = "Stun";

    generateDescription() {
        if (!this.formula) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }

        return replaceData(game.i18n.localize("MERP1E.InjuryDescription.Stun"),
            {
                DURATION: this.duration,
            });
    }
}

class Merp1eKnockedDownEffectPenalty extends Merp1eStatusEffectPenalty {
    static dummy = Merp1eInjuryEffect.registeredAdapters.push(this)
    static adapterName = "KnockedDown";

    generateDescription() {
        if (!this.formula) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }

        return replaceData(game.i18n.localize("MERP1E.InjuryDescription.KnockedDown"),
            {
                DURATION: this.duration,
            });
    }
}

class Merp1eKnockedOutEffectPenalty extends Merp1eStatusEffectPenalty {
    static dummy = Merp1eInjuryEffect.registeredAdapters.push(this)
    static adapterName = "KnockedOut";

    generateDescription() {
        if (!this.formula) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }

        return replaceData(game.i18n.localize("MERP1E.InjuryDescription.KnockedOut"),
            {
                DURATION: this.duration,
            });
    }
}

////////////////////////////////////////////////////////////
class Merp1eByLocationEffect extends Merp1eInjuryEffectAdapter {
    static dummy = Merp1eInjuryEffect.registeredAdapters.push(this)
    static adapterName = "ByLocation";

    static getData(sheetData) {
        super.getData(sheetData);
        let possibleValues = sheetData.document.effectAdapter.bodyGroupObject?.statuses;
        if(possibleValues) {
            possibleValues = duplicate(possibleValues);
            possibleValues.unshift("ok");
            sheetData.possibleValues = game.merp1e.Merp1eRules.injury.locationStatuses.filter((st) => possibleValues.find(e => e == st.id) );
        } else {
            sheetData.possibleValues = [];
        }
        
    }

    get currentLabel() {
        return findByID(game.merp1e.Merp1eRules.injury.locationStatuses, this.currentValue, null)?.label;
    }

    async onApply(actor, change) {
        if(!this.currentValue && !!this.initialValue) {
            this.setEffectFlag("currentValue", this.initialValue);
        }
        return !!this.initialValue;
    }
}

////////////////////////////////////////////////////////////
class Merp1eByDelayedDeathEffect extends Merp1eInjuryEffectAdapter {
    static dummy = Merp1eInjuryEffect.registeredAdapters.push(this)
    static adapterName = "DelayedDeath";

    static getData(sheetData) {
        super.getData(sheetData);
    }
}

