import { findByID, copyClassFunctions, formatBonus } from "./util.js";

class Merp1eActiveEffectBase {
    applyEffect() {
        console.log("Must implement!");
    }
}

class Merp1eActiveEffectSkillBonus extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.SkillBonus";
    static effectName = "SkillBonus";

    generateDescription() {
        let bonus = parseInt(this.data.flags.merp1e?.SkillBonus?.value || 0);
        if(bonus == 0 || this.data.flags.merp1e?.SkillBonus?.skillReference == null) {
            return "Skill Bonus Effect not configured yet";
        }

        return formatBonus(bonus) + " on skills with reference " + this.data.flags.merp1e?.SkillBonus?.skillReference; // XXX I18
    }

    applyEffect(actor) {
        Object.values(actor.skills).forEach( skill => {
            if(skill.data.data.reference == this.data.flags.merp1e?.SkillBonus?.skillReference ) {
                skill.bonuses.itemBonuses.push({ value: this.data.flags.merp1e.SkillBonus.value }); // put id, and/or a description
            }
        });
    }
}

class Merp1eActiveEffectSkillGroupBonus extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.SkillGroupBonus";
    static effectName = "SkillGroupBonus";

    generateDescription() {
        let bonus = parseInt(this.data.flags.merp1e?.SkillBonus?.value || 0);
        if(bonus == 0 || this.data.flags.merp1e?.SkillRankBonus?.skillReference == null) {
            return "Group Skill Bonus Effect not configured yet";
        }
        return formatBonus(bonus) + " on skills group " + this.data.flags.merp1e?.SkillGroupBonus?.skillGroup; // XXX I18
    }

    applyEffect(actor) {
        Object.values(actor.skills).forEach( skill => {
            if(skill.data.data.group == this.data.flags.merp1e.SkillGroupBonus.skillGroup ) {
                skill.bonuses.itemBonuses.push({ value: this.data.flags.merp1e.SkillGroupBonus.value }); // put id, and/or a description
            }
        });
    }
}

class Merp1eActiveEffectRankSkillBonus extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.RankSkillBonus";
    static effectName = "RankSkillBonus";

    generateDescription() {
        let bonus = parseInt(this.data.flags.merp1e?.SkillRankBonus?.value || 0);
        if(bonus == 0 || this.data.flags.merp1e?.SkillRankBonus?.skillReference == null) {
            return "Rank Skill Bonus Effect not configured yet";
        }

        return formatBonus(bonus) + " per rank on skills with reference " + this.data.flags.merp1e?.SkillRankBonus?.skillReference; // XXX I18
    }

    applyEffect(actor) {
        Object.values(actor.skills).forEach( skill => {
            if(skill.data.data.reference == this.data.flags.merp1e?.SkillRankBonus?.skillReference ) {
                skill.bonuses.itemBonuses.push({ value: this.data.flags.merp1e.SkillRankBonus.value * skill.data.data.ranks }); // put id, and/or a description
            }
        });
    }
}

class Merp1eActiveEffectShield extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.Shield";
    static effectName = "Shield";

    get type() { return this.data?.flags?.merp1e?.Shield?.type; }
    get extraBonus() { 
        if(this.type == "none") return 0;

        return this.data?.flags?.merp1e?.Shield?.extraBonus || 0; 
    }
    generateDescription() {
        if(this.type == undefined) return "Shield Effect not configured yet";
        if(this.type == "none") return "Shield Effect unset";

        return `Set Shield to ${this.type}` + (this.extraBonus != 0 ? " (" + formatBonus(this.extraBonus) + ")" : "");
    }

    applyEffect(actor) {
        if(this.type != null) {
            actor.defense.shield = duplicate(findByID(game.merp1e.Merp1eRules.defense.shieldTypes, this.type, "none"));
            if(this.extraBonus != 0) {
                actor.defense.shield.bonus += this.extraBonus;
            }
        }
    }
}

class Merp1eActiveEffectArmGreaves extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.ArmGreaves";
    static effectName = "ArmGreaves";

    get type() { return this.data?.flags?.merp1e?.ArmGreaves?.type; }
    get extraBonus() { 
        if(this.type == "none") return 0;

        return this.data?.flags?.merp1e?.ArmGreaves?.extraBonus || 0; 
    }
    generateDescription() {
        if(this.type == undefined) return "Arm Greaves Effect not configured yet";
        if(this.type == "none") return "Arm Greaves Effect unset";

        return `Set ArmGreaves to ${this.type}` + (this.extraBonus != 0 ? " (" + formatBonus(this.extraBonus) + ")" : "");
    }

    applyEffect(actor) {
        if(this.type != null) {
            actor.defense.armGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, this.type, "none"));
            if(this.extraBonus != 0) {
                actor.defense.armGreaves.bonus += this.extraBonus;
            }
        }
    }
}

class Merp1eActiveEffectLegGreaves extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.LegGreaves";
    static effectName = "LegGreaves";

    get type() { return this.data?.flags?.merp1e?.LegGreaves?.type; }
    get extraBonus() { 
        if(this.type == "none") return 0;

        return this.data?.flags?.merp1e?.LegGreaves?.extraBonus || 0; 
    }
    generateDescription() {
        if(this.type == undefined) return "Leg Greaves Effect not configured yet";
        if(this.type == "none") return "Leg Greaves Effect unset";

        return `Set LegGreaves to ${this.type}` + (this.extraBonus != 0 ? " (" + formatBonus(this.extraBonus) + ")" : "");
    }

    applyEffect(actor) {
        if(this.type != null) {
            actor.defense.legGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, this.type, "none"));
            if(this.extraBonus != 0) {
                actor.defense.legGreaves.bonus += this.extraBonus;
            }
        }
    }
}

class Merp1eActiveEffectHelm extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.Helm";
    static effectName = "Helm";

    get type() { return this.data?.flags?.merp1e?.Helm?.type; }
    get extraBonus() { 
        if(this.type == "none") return 0;

        return this.data?.flags?.merp1e?.Helm?.extraBonus || 0; 
    }
    generateDescription() {
        if(this.type == undefined) return "Leg Greaves Effect not configured yet";
        if(this.type == "none") return "Leg Greaves Effect unset";

        return `Set Helm to ${this.type}` + (this.extraBonus != 0 ? " (" + formatBonus(this.extraBonus) + ")" : "");
    }

    applyEffect(actor) {
        if(this.type != null) {
            actor.defense.helm = duplicate(findByID(game.merp1e.Merp1eRules.defense.helmTypes, this.type, "none"));
            if(this.extraBonus != 0) {
                actor.defense.helm.bonus += this.extraBonus;
            }
        }
    }
}

class Merp1eActiveEffectArmor extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.Armor";
    static effectName = "Armor";

    get type() { return this.data?.flags?.merp1e?.Armor?.type; }
    get extraBonus() { 
        if(this.type == "none") return 0;

        return this.data?.flags?.merp1e?.Armor?.extraBonus || 0; 
    }
    generateDescription() {
        if(this.type == undefined) return "Armor Effect not configured yet";
        if(this.type == "none") return "Armor Effect unset";

        return `Set Armor to ${this.type}` + (this.extraBonus != 0 ? " (" + formatBonus(this.extraBonus) + ")" : "");
    }

    applyEffect(actor) {
        if(this.type != null) {
            actor.defense.armor = duplicate(findByID(game.merp1e.Merp1eRules.defense.armorTypes, this.type, "none"));
            if(this.extraBonus != 0) {
                actor.defense.armor.bonus += this.extraBonus;
            }
        }
    }
}

export class Merp1eActiveEffect extends ActiveEffect {

    static effectTypes = [
        Merp1eActiveEffectSkillBonus,
        Merp1eActiveEffectSkillGroupBonus,
        Merp1eActiveEffectRankSkillBonus,
        Merp1eActiveEffectShield,
        Merp1eActiveEffectArmGreaves,
        Merp1eActiveEffectLegGreaves,
        Merp1eActiveEffectHelm,
        Merp1eActiveEffectArmor
    ];
    
    
    constructor(data, context)
    {
        super(data, context);
    }

    _updateClassMethods(method = null) {
        if(method == null || ! (method in this)) {
            let type = this.data.flags.merp1e?.effectType || null;
            let effectClass = Merp1eActiveEffect.effectTypes.reduce( (acc, cls) => { return (cls.effectName == type) ? cls : acc }, null);
            if(effectClass != null) copyClassFunctions(this, effectClass);
        }
    }
    get name() {
        this._updateClassMethods("generateDescription");

        if("generateDescription" in this)
            return this.generateDescription();
        else
            return game.i18n.localize("MERP1E.Effect.New");
    }

    /** @override */
    apply(actor, change)
    {
        this._updateClassMethods("applyEffect");
        return this.applyEffect && this.applyEffect(actor, change);
    }
}