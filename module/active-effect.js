import { findByID, copyClassFunctions, formatBonus, toKebabCase, replaceData } from "./util.js";

export const Merp1eEffects = [];

class Merp1eEffect  {
    static effectType = "AbstractEffect";
    static effectName = "Base";
    constructor(activeEffect) {
        this.activeEffect = activeEffect
    }

    static get label() {
        return "MERP1E.EffectType." + this.effectName;
    }

    static get templatePart() {
        const path = "systems/merp1e/templates/effect";
        const filename = toKebabCase(this.effectName) + "-" + toKebabCase(effectType) + "-part.html";
        return `${path}/${filename}`;
    }

    static get defaultConfig() {
        return {
            transfer: false
        };
    }

    get parent() { return this.activeEffect.parent; }
    get data() { return this.activeEffect.data; }

    /**
     * Apply the effect on actor
     */
    applyEffect(actor) {
    }

    /**
     * Remove all effects for this type
     */
    static removeEffects(actor) {
    }

    getFlag(name) {
        //return this.activeEffect.getFlag("merp1e." + this.effectName, name);
        return this.activeEffect?.flags?.merp1e?.[this.constructor.effectName]?.[name]
    }
    setFlag(name, value) {
        //return this.activeEffect.setFlag("merp1e." + this.this.constructor.effectName, name, value);
        //this.data.flags?. value;
        const newData = {};
        newData[`merp1e.${this.constructor.effectName}.${name}`] = value;
        this.data.flags = mergeObject(this.data.flags, expandObject(newData));        
    }
}

class Merp1eItemEffectBase extends Merp1eEffect {
    static effectType = "ItemEffect";
}

class Merp1eItemEffectSkillBonus extends Merp1eItemEffectBase {
    static effectName = "SkillBonus";

    generateDescription() {
        if (this.value == 0 || this.skillReference == null) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.SkillBonus"),
            {
                BONUS: formatBonus(this.value),
                REFERENCE: this.skillReference
            });
    }

    get value() {
        return parseInt(this.getFlag("value") || 0);
    }

    get skillReference() {
        return this.getFlag("skillReference");
    }

    applyEffect(actor) {
        Object.values(actor.skills).forEach(skill => {
            if (skill.data.data.reference == this.skillReference) {
                skill.bonuses.itemBonuses.push({
                    itemId: this?.parent?.id,
                    type: this.constructor.effectName,
                    value: this.value
                });
            }
        });
    }

    removeEffects(actor) {
        Object.values(actor.skills).forEach(skill => {
            skill.bonuses.itemBonuses = skill.bonuses.itemBonuses.filter((item) => item?.effectName != this.constructor.effectName);
        });
    }
}
Merp1eEffects.push(Merp1eItemEffectSkillBonus);

class Merp1eItemEffectSkillGroupBonus extends Merp1eItemEffectBase {
    static effectName = "SkillGroupBonus";

    generateDescription() {
        if (this.value == 0 || this.skillGroup == null) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }
            
        return replaceData(game.i18n.localize("MERP1E.EffectDescription.SkillGroupBonus"),
            {
                BONUS: formatBonus(this.value),
                GROUP: this.skillGroup
            });
    }

    get value() {
        return parseInt(this.getFlag("value") || 0);
    }

    get skillGroup() {
        return this.getFlag("skillGroup")
    }

    applyEffect(actor) {
        Object.values(actor.skills).forEach(skill => {
            if (skill.data.data.group == this.skillGroup) {
                skill.bonuses.itemBonuses.push({ 
                    itemId: this?.parent?.id,
                    type: this.constructor.effectName,
                    value: this.value 
                });
            }
        });
    }

    removeEffects(actor) {
        Object.values(actor.skills).forEach(skill => {
            skill.bonuses.itemBonuses = skill.bonuses.itemBonuses.filter((item) => item?.effectName != this.constructor.effectName);
        });
    }
}

class Merp1eActiveEffectRankSkillBonus extends Merp1eItemEffectBase {
    static effectName = "RankSkillBonus";

    generateDescription() {
        if (this.value == 0 || this.skillReference == null) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.RankSkillBonus"),
            {
                BONUS: formatBonus(this.value),
                REFERENCE: this.skillReference
            });
    }

    get value() {
        return parseInt(this.getFlag("value") || 0);
    }

    get skillReference() {
        return this.getFlag("skillReference")
    }

    applyEffect(actor) {
        Object.values(actor.skills).forEach(skill => {
            if (skill.data.data.reference == this.skillReference) {
                skill.bonuses.itemBonuses.push({
                    itemId: this?.parent?.id,
                    type: this.constructor.effectName,
                    value: this.value * skill.data.data.ranks
                });
            }
        });
    }

    removeEffects(actor) {
        Object.values(actor.skills).forEach(skill => {
            skill.bonuses.itemBonuses = skill.bonuses.itemBonuses.filter((item) => item?.effectName != this.constructor.effectName);
        });
    }
}

class Merp1eActiveEffectShield extends Merp1eItemEffectBase {
    static effectName = "Shield";

    get type() {
        return this.getFlag("type");
    }

    get extraBonus() {
        if (this.type == "none") return 0;

        return this.getFlag("extraBonus") || 0;
    }

    generateDescription() {
        if (this.type == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        if (this.type == "none") return game.i18n.localize("MERP1E.EffectDescription.ShieldUnset");

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.Shield"),
            {
                TYPE: game.i18n.localize(findByID(game.merp1e.Merp1eRules.defense.shieldTypes, this.type, "none").label),
                EXTRABONUS: " (" + formatBonus(this.extraBonus) + ")"
            });
    }

    applyEffect(actor) {
        if (this.type != null) {
            actor.defense.shield = duplicate(findByID(game.merp1e.Merp1eRules.defense.shieldTypes, this.type, "none"));
            if (this.extraBonus != 0) {
                actor.defense.shield.bonus += this.extraBonus;
            }
        }
    }
    removeEffects(actor) {
        actor.defense.shield = duplicate(findByID(game.merp1e.Merp1eRules.defense.shieldTypes, "none", "none"));
    }
}

class Merp1eActiveEffectArmGreaves extends Merp1eItemEffectBase {
    static effectName = "ArmGreaves";

    get type() { return this.getFlag("type"); }
    get extraBonus() {
        if (this.type == "none") return 0;

        return this.getFlag("extraBonus") || 0;
    }

    generateDescription() {
        if (this.type == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        if (this.type == "none") return game.i18n.localize("MERP1E.EffectDescription.ArmGreavesUnset");

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.ArmGreaves"),
            {
                TYPE: game.i18n.localize(findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, this.type, "none").label),
                EXTRABONUS: " (" + formatBonus(this.extraBonus) + ")"
            });
    }

    applyEffect(actor) {
        if (this.type != null) {
            actor.defense.armGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, this.type, "none"));
            if (this.extraBonus != 0) {
                actor.defense.armGreaves.bonus += this.extraBonus;
            }
        }
    }
    removeEffects(actor) {
        actor.defense.armGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, "none", "none"));
    }
}

class Merp1eActiveEffectLegGreaves extends Merp1eItemEffectBase {
    static effectName = "LegGreaves";

    get type() { return this.getFlag("type"); }
    get extraBonus() {
        if (this.type == "none") return 0;

        return this.getFlag("extraBonus") || 0;
    }

    generateDescription() {
        if (this.type == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        if (this.type == "none") return game.i18n.localize("MERP1E.EffectDescription.LegGreavesUnset");

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.LegGreaves"),
            {
                TYPE: game.i18n.localize(findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, this.type, "none").label),
                EXTRABONUS: " (" + formatBonus(this.extraBonus) + ")"
            });
    }

    applyEffect(actor) {
        if (this.type != null) {
            actor.defense.legGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, this.type, "none"));
            if (this.extraBonus != 0) {
                actor.defense.legGreaves.bonus += this.extraBonus;
            }
        }
    }
    removeEffects(actor) {
        actor.defense.legGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, "none", "none"));
    }
}

class Merp1eActiveEffectHelm extends Merp1eItemEffectBase {
    static effectName = "Helm";

    get type() { return this.getFlag("type"); }
    get extraBonus() {
        if (this.type == "none") return 0;

        return this.getFlag("extraBonus") || 0;
    }

    generateDescription() {
        if (this.type == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        if (this.type == "none") return game.i18n.localize("MERP1E.EffectDescription.HelmUnset");

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.Helm"),
            {
                TYPE: game.i18n.localize(findByID(game.merp1e.Merp1eRules.defense.helmTypes, this.type, "none").label),
                EXTRABONUS: " (" + formatBonus(this.extraBonus) + ")"
            });
    }

    applyEffect(actor) {
        if (this.type != null) {
            actor.defense.helm = duplicate(findByID(game.merp1e.Merp1eRules.defense.helmTypes, this.type, "none"));
            if (this.extraBonus != 0) {
                actor.defense.helm.bonus += this.extraBonus;
            }
        }
    }

    removeEffects(actor) {
        actor.defense.helm = duplicate(findByID(game.merp1e.Merp1eRules.defense.helmTypes, "none", "none"));
    }
}

class Merp1eActiveEffectArmor extends Merp1eItemEffectBase {
    static effectName = "Armor";

    get type() { return this.getFlag("type"); }
    get extraBonus() {
        if (this.type == "none") return 0;

        return this.getFlag("extraBonus") || 0;
    }

    generateDescription() {
        if (this.type == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        if (this.type == "none") return game.i18n.localize("MERP1E.EffectDescription.ArmorUnset");

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.Armor"),
            {
                TYPE: game.i18n.localize(findByID(game.merp1e.Merp1eRules.defense.armorTypes, this.type, "none").label),
                EXTRABONUS: " (" + formatBonus(this.extraBonus) + ")"
            });
    }

    applyEffect(actor) {
        if (this.type != null) {
            actor.defense.armor = duplicate(findByID(game.merp1e.Merp1eRules.defense.armorTypes, this.type, "none"));
            if (this.extraBonus != 0) {
                actor.defense.armor.bonus += this.extraBonus;
            }
        }
    }

    removeEffects(actor) {
        actor.defense.armor = duplicate(findByID(game.merp1e.Merp1eRules.defense.armorTypes, "none", "none"));
    }
}

class Merp1eActiveEffectPPMultiplier extends Merp1eItemEffectBase {
    static effectName = "PPMultiplier";

    get value() { return this.getFlag("value") || 1; }

    get realm() { return this.getFlag("realm"); }

    generateDescription() {
        if (this.realm == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        if (this.value < 1) return game.i18n.localize("MERP1E.EffectDescription.PPMultiplierUnset");

        let realmText = this.realm == "Any" ? "" : ` for ${this.realm}`;
        return replaceData(game.i18n.localize("MERP1E.EffectDescription.PPMultiplier"),
            {
                VALUE: this.value,
                REALM: this.realm
            });
    }

    applyEffect(actor) {
        if (this.realm == "Any" || this.realm == actor.spellcasting.realm) {
            actor.spellcasting.powerPointsMultiplier = actor.spellcasting.powerPointsMultiplier * this.value;
        }
    }
}

class Merp1eActiveEffectSpellAdder extends Merp1eItemEffectBase {
    static effectName = "SpellAdder";

    get value() { return this.getFlag("value") || 0; }

    get realm() { return this.getFlag("realm"); }

    generateDescription() {
        if (this.realm == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        if (this.value == 0) return game.i18n.localize("MERP1E.EffectDescription.SpellAdderUnset");

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.SpellAdder"),
        {
            VALUE: this.value,
            REALM: this.realm
        });
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
        Merp1eItemEffectSkillBonus,
        Merp1eItemEffectSkillGroupBonus,
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
        // // Instanciate in the right Class Type
        // if(data?._instanciated || !data?.flags?.merp1e?.effectType) {
        //     delete data._instanciated;
        //     super(data, context);
        // } else {
        //     const effectType = data.flags.merp1e.effectType
        //     data._instanciated = true;
        //     let effectClass = Merp1eActiveEffect.effectTypes.reduce((acc, cls) => { return (cls.effectName == effectType) ? cls : acc }, null);
        //     return new effectClass(data, context);
        // }
        // Instanciate in the right Class Type
        super(data, context);
        const effectType = data?.flags?.merp1e?.effectType
        let effectClass = Merp1eActiveEffect.effectTypes.reduce((acc, cls) => { return (cls.effectName == effectType) ? cls : acc }, null);
        if(effectClass) this.effect = new effectClass(data, context);
    }


    prepareBaseData() {
        this.data.flags = mergeObject(this.data.flags, { merp1e: { conditionType: this.data.flags.merp1e?.conditionType || "AlwaysOn" } });
        super.prepareBaseData();
    }

    prepareDerivedData() {
        //let effectType = this.data.flags.merp1e?.effectType || null;
        //let effectClass = Merp1eActiveEffect.effectTypes.reduce((acc, cls) => { return (cls.effectName == effectType) ? cls : acc }, null);
        //if (effectClass != null) copyClassFunctions(this, effectClass);

        let conditionType = this.data.flags.merp1e?.conditionType;
        this.condition = Merp1eActiveEffect.conditionTypes.reduce((acc, cls) => { let obj = new cls; return (obj.conditionName == conditionType) ? obj : acc; }, null);

        super.prepareDerivedData();
    }

    get name() {
        if (this.effect)
            return this?.effect?.generateDescription();
        else
            return game.i18n.localize("MERP1E.Effect.New");
    }

    /** @override */
    apply(actor, change) {
        if (this.condition && this.effect.applyEffect) {
            if (this.condition.isActive(this, actor)) {
                return this.effect.applyEffect(actor, change);
            }
        }
        return;
    }

    get priority() {
        return this.condition?.priority || 100;
    }
}