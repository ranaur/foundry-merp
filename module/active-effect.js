import { copyClassFunctions, formatBonus } from "./util.js";

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

export class Merp1eActiveEffect extends ActiveEffect {

    /*
    data.effect.type = 

    */

    static effectTypes = [
        Merp1eActiveEffectSkillBonus,
        Merp1eActiveEffectSkillGroupBonus,
        Merp1eActiveEffectRankSkillBonus
        //{ name: "", label: "MERP1E.EffectType.", class: null },
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