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
        if (bonus == 0 || this.data.flags.merp1e?.SkillBonus?.skillReference == null) {
            return "Skill Bonus Effect not configured yet";
        }

        let cond = "";
        if(this.data.flags.merp1e?.SkillBonus?.isOptional) {
            cond = "some conditions of ";
        }
            
        return formatBonus(bonus) + ` on ${cond}skills with reference ` + this.data.flags.merp1e?.SkillBonus?.skillReference; // XXX I18
    }

    applyEffect(actor) {
        Object.values(actor.skills).forEach(skill => {
            if (skill.data.data.reference == this.data.flags.merp1e?.SkillBonus?.skillReference) {
                if(this.data.flags.merp1e?.SkillBonus?.isOptional) {
                    skill.bonuses.conditionalBonuses = skill.bonuses.conditionalBonuses || [];
                    skill.bonuses.conditionalBonuses.push({ value: this.data.flags.merp1e.SkillBonus.value, conditionText: this.data.flags.merp1e?.SkillBonus?.conditionText });
                } else { // Put bonus on skill
                    skill.bonuses.itemBonuses.push({ value: this.data.flags.merp1e.SkillBonus.value }); // put id, and/or a description
                }
            }
        });
    }
}

class Merp1eActiveEffectSkillGroupBonus extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.SkillGroupBonus";
    static effectName = "SkillGroupBonus";

    generateDescription() {
        let bonus = parseInt(this.data.flags.merp1e?.SkillGroupBonus?.value || 0);
        if (bonus == 0 || this.data.flags.merp1e?.SkillGroupBonus?.skillGroup == null) {
            return "Group Skill Bonus Effect not configured yet";
        }
        let cond = "";
        if(this.data.flags.merp1e?.SkillGroupBonus?.isOptional) {
            cond = "some conditions of ";
        }
            
        return formatBonus(bonus) + ` on ${cond}skills group ` + this.data.flags.merp1e?.SkillGroupBonus?.skillGroup; // XXX I18
    }

    applyEffect(actor) {
        Object.values(actor.skills).forEach(skill => {
            if (skill.data.data.group == this.data.flags.merp1e.SkillGroupBonus.skillGroup) {
                if(this.data.flags.merp1e?.SkillGroupBonus?.isOptional) {
                    skill.bonuses.conditionalBonuses = skill.bonuses.conditionalBonuses || [];
                    skill.bonuses.conditionalBonuses.push({ value: this.data.flags.merp1e.SkillGroupBonus.value, conditionText: this.data.flags.merp1e?.SkillGroupBonus?.conditionText });
                } else { // Put bonus on skill
                    skill.bonuses.itemBonuses.push({ value: this.data.flags.merp1e.SkillGroupBonus.value }); // put id, and/or a description
                }
                
            }
        });
    }
}

class Merp1eActiveEffectRankSkillBonus extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.RankSkillBonus";
    static effectName = "RankSkillBonus";

    generateDescription() {
        let bonus = parseInt(this.data.flags.merp1e?.SkillRankBonus?.value || 0);
        if (bonus == 0 || this.data.flags.merp1e?.SkillRankBonus?.skillReference == null) {
            return "Rank Skill Bonus Effect not configured yet";
        }

        return formatBonus(bonus) + " per rank on skills with reference " + this.data.flags.merp1e?.SkillRankBonus?.skillReference; // XXX I18
    }

    applyEffect(actor) {
        Object.values(actor.skills).forEach(skill => {
            if (skill.data.data.reference == this.data.flags.merp1e?.SkillRankBonus?.skillReference) {
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
        if (this.type == "none") return 0;

        return this.data?.flags?.merp1e?.Shield?.extraBonus || 0;
    }
    generateDescription() {
        if (this.type == undefined) return "Shield Effect not configured yet";
        if (this.type == "none") return "Shield Effect unset";

        return `Set Shield to ${this.type}` + (this.extraBonus != 0 ? " (" + formatBonus(this.extraBonus) + ")" : "");
    }

    applyEffect(actor) {
        if (this.type != null) {
            actor.defense.shield = duplicate(findByID(game.merp1e.Merp1eRules.defense.shieldTypes, this.type, "none"));
            if (this.extraBonus != 0) {
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
        if (this.type == "none") return 0;

        return this.data?.flags?.merp1e?.ArmGreaves?.extraBonus || 0;
    }
    generateDescription() {
        if (this.type == undefined) return "Arm Greaves Effect not configured yet";
        if (this.type == "none") return "Arm Greaves Effect unset";

        return `Set ArmGreaves to ${this.type}` + (this.extraBonus != 0 ? " (" + formatBonus(this.extraBonus) + ")" : "");
    }

    applyEffect(actor) {
        if (this.type != null) {
            actor.defense.armGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, this.type, "none"));
            if (this.extraBonus != 0) {
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
        if (this.type == "none") return 0;

        return this.data?.flags?.merp1e?.LegGreaves?.extraBonus || 0;
    }
    generateDescription() {
        if (this.type == undefined) return "Leg Greaves Effect not configured yet";
        if (this.type == "none") return "Leg Greaves Effect unset";

        return `Set LegGreaves to ${this.type}` + (this.extraBonus != 0 ? " (" + formatBonus(this.extraBonus) + ")" : "");
    }

    applyEffect(actor) {
        if (this.type != null) {
            actor.defense.legGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, this.type, "none"));
            if (this.extraBonus != 0) {
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
        if (this.type == "none") return 0;

        return this.data?.flags?.merp1e?.Helm?.extraBonus || 0;
    }
    generateDescription() {
        if (this.type == undefined) return "Leg Greaves Effect not configured yet";
        if (this.type == "none") return "Leg Greaves Effect unset";

        return `Set Helm to ${this.type}` + (this.extraBonus != 0 ? " (" + formatBonus(this.extraBonus) + ")" : "");
    }

    applyEffect(actor) {
        if (this.type != null) {
            actor.defense.helm = duplicate(findByID(game.merp1e.Merp1eRules.defense.helmTypes, this.type, "none"));
            if (this.extraBonus != 0) {
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
        if (this.type == "none") return 0;

        return this.data?.flags?.merp1e?.Armor?.extraBonus || 0;
    }
    generateDescription() {
        if (this.type == undefined) return "Armor Effect not configured yet";
        if (this.type == "none") return "Armor Effect unset";

        return `Set Armor to ${this.type}` + (this.extraBonus != 0 ? " (" + formatBonus(this.extraBonus) + ")" : "");
    }

    applyEffect(actor) {
        if (this.type != null) {
            actor.defense.armor = duplicate(findByID(game.merp1e.Merp1eRules.defense.armorTypes, this.type, "none"));
            if (this.extraBonus != 0) {
                actor.defense.armor.bonus += this.extraBonus;
            }
        }
    }
}

class Merp1eActiveEffectPPMultiplier extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.PPMultiplier";
    static effectName = "PPMultiplier";

    get value() { return this.data?.flags?.merp1e?.PPMultiplier?.value || 1; }

    get realm() { return this.data?.flags?.merp1e?.PPMultiplier?.realm; }

    generateDescription() {
        if (this.realm == undefined) return "PP Multiplier not configured yet";
        if (this.value < 1) return "PP Multiplier unset";

        let realmText = this.realm == "Any" ? "" : ` for ${this.realm}`;
        return `${this.value}X PP Multiplier${realmText}`;
    }

    applyEffect(actor) {
        if (this.realm == "Any" || this.realm == actor.spellcasting.realm) {
            actor.spellcasting.powerPointsMultiplier = actor.spellcasting.powerPointsMultiplier * this.value;
        }
    }
}

class Merp1eActiveEffectSpellAdder extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.SpellAdder";
    static effectName = "SpellAdder";

    get value() { return this.data?.flags?.merp1e?.SpellAdder?.value || 1; }

    get realm() { return this.data?.flags?.merp1e?.SpellAdder?.realm; }

    generateDescription() {
        if (this.realm == undefined) return "Spell Adder not configured yet";
        if (this.value < 1) return "Spell Adder unset";

        let realmText = this.realm == "Any" ? "" : ` for ${this.realm}`;
        return `+${this.value} Spell Adder${realmText}`;
    }

    applyEffect(actor) {
        if (this.realm == "Any" || this.realm == actor.spellcasting.realm) {
            actor.spellcasting.spellAdderMaximum = actor.spellcasting.spellAdderMaximum + this.value;
        }
    }
}

class Merp1eActiveEffectBaseCondition {
    get priority() { return 100; }

    get conditionName() {
        return this.constructor.name.replace("Merp1eActiveEffectCondition", "");
    }
    get label() {
        return "MERP1E.ActiveEffectCondition." + this.conditionName;
    }
    /*
     * returns a striong explaining why is not active, or true if active.
     */
    reason(effect, actor) {
        console.error("reason must be overloaded!");
        return "Base class must be overloaded"; // XXX I18
    }
    isActive(effect, actor) {
        return this.reason(effect, actor) == true;
    }
}

class Merp1eActiveEffectConditionAlwaysOn extends Merp1eActiveEffectBaseCondition {
    get priority() { return 30; }
    reason(effect, actor) {
        return true;
    }
}

class Merp1eActiveEffectConditionOnItemCarried extends Merp1eActiveEffectBaseCondition {
    get priority() { return 40; }

    reason(effect, actor) {
        if (effect.getFlag("merp1e", "conditions.OnItemCarriedPlaces") == "Anywhere") {
            return true;
        }
        let allowedPlaces = effect.getFlag("merp1e", "conditions.OnItemCarriedPlaces").split(",");
        allowedPlaces.forEach((i) => i.trim());
        if (actor.items[effect.origin].carriedPlace in allowedPlaces) {
            return true;
        }
        return "Item not weared."; // XXX I18
    }
}

class Merp1eActiveEffectConditionOnArmorTypes extends Merp1eActiveEffectBaseCondition {
    get priority() { return 50; }

    reason(effect, actor) {
        if (actor.defense.armor.id in effect.data.flags.merp1e.conditions.OnArmorTypes) {
            if (effect.data.flags.merp1e.conditions.OnArmorTypes[actor.defense.armor.id]) {
                return true;
            }
            return "Actor armor type forbids activation of effect."; // XXX I18
        }
        return "Armor type not in the allowed armor list."; // XXX I18
    }
}


export class Merp1eActiveEffect extends ActiveEffect {
    static conditionTypes = [
        Merp1eActiveEffectConditionAlwaysOn,
        Merp1eActiveEffectConditionOnItemCarried,
        Merp1eActiveEffectConditionOnArmorTypes,
    ];
    static effectTypes = [
        Merp1eActiveEffectSkillBonus,
        Merp1eActiveEffectSkillGroupBonus,
        Merp1eActiveEffectRankSkillBonus,
        Merp1eActiveEffectShield,
        Merp1eActiveEffectArmGreaves,
        Merp1eActiveEffectLegGreaves,
        Merp1eActiveEffectHelm,
        Merp1eActiveEffectArmor,
        Merp1eActiveEffectPPMultiplier,
        Merp1eActiveEffectSpellAdder
    ];

    constructor(data, context) {
        super(data, context);
    }


    prepareBaseData() {
        this.data.flags = mergeObject(this.data.flags, { merp1e: { conditionType: this.data.flags.merp1e?.conditionType || "AlwaysOn" } });
        super.prepareBaseData();
    }

    prepareDerivedData() {
        let effectType = this.data.flags.merp1e?.effectType || null;
        let effectClass = Merp1eActiveEffect.effectTypes.reduce((acc, cls) => { return (cls.effectName == effectType) ? cls : acc }, null);
        if (effectClass != null) copyClassFunctions(this, effectClass);

        let conditionType = this.data.flags.merp1e?.conditionType;
        this.condition = Merp1eActiveEffect.conditionTypes.reduce((acc, cls) => { let obj = new cls; return (obj.conditionName == conditionType) ? obj : acc; }, null);

        super.prepareDerivedData();
    }

    get name() {
        if ("generateDescription" in this)
            return this.generateDescription();
        else
            return game.i18n.localize("MERP1E.Effect.New");
    }

    /** @override */
    apply(actor, change) {
        if (this.condition && this.applyEffect) {
            if (this.condition.isActive(this, actor)) {
                return this.applyEffect(actor, change);
            }
        }
        return;
    }

    get priority() {
        return this.condition?.priority || 100;
    }
}