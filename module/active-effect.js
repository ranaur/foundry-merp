import { findByID, formatBonus, toKebabCase, replaceData } from "./util.js";
import { Merp1eEffectCondition } from "./active-effect-condition.js";
import { Merp1eModifier } from "./modifier.js";

export class Merp1eEffect extends ActiveEffect {
    static effectType = "AbstractEffect";
    static effectName = "Base";
    static registeredTypes = []; // filled by a dummy on each subclass

    static registerParts(templates) {
        this.registeredTypes.forEach((effect) => templates.push(effect.templatePart));
    }
    static get registeredClasses() {
        return this.registeredTypes.reduce((acc, cls) => { acc[cls.effectName] = cls; return acc; }, {})
    }

    constructor(data, context) {
        // From Carter_DC
        //useless in the present case but cool
        //creates a derived class for specific item types
        if ( data?.flags?.merp1e?.effectType in CONFIG.ActiveEffect.documentClasses && !context?.isExtendedClass) {
            // specify our custom item subclass here
            // when the constructor for the new class will call it's super(),
            // the isExtendedClass flag will be true, thus bypassing this whole process
            // and resume default behavior
            return new CONFIG.ActiveEffect.documentClasses[data?.flags?.merp1e?.effectType](data,{...{isExtendedClass: true}, ...context});
        }    
        //default behavior, just call super and do random item inits.
        super(data, context);
 
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
        
        // super(data, context);
        // const effectType = data?.flags?.merp1e?.effectType
        // let effectClass = Merp1eActiveEffect.effectTypes.reduce((acc, cls) => { return (cls.effectName == effectType) ? cls : acc }, null);
        // if(effectClass) this.effect = new effectClass(data, context);
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
        this.condition = Merp1eEffectCondition.registeredTypes.reduce((acc, cls) => { let obj = new cls; return (obj.conditionName == conditionType) ? obj : acc; }, null);
// XXX ^^^^^^^^^ use filter
        super.prepareDerivedData();
    }

    get name() {
        return this?.generateDescription?.() ||  game.i18n.localize("MERP1E.Effect.New");
    }

    /** @override */
    apply(actor, change) {
        // disable
    }

    applyEffect(data, change) {
        if (this.condition && this.applyEffect) {
            if (this.condition.isActive(this, data)) {
                return this.applyEffect(data, change);
            }
        }
        return;
    }

    get priority() {
        return this.condition?.priority || 100;
    }

    static get label() {
        return "MERP1E.EffectType." + this.effectName;
    }

    static get templatePart() {
        const path = "systems/merp1e/templates/effect";
        const filename = toKebabCase(this.effectName + this.effectType) + "-part.html";
        return `${path}/${filename}`;
    }

    static get defaultConfig() {
        return {
            transfer: false
        };
    }

    getEffectFlag(name) {
        return this.getFlag("merp1e",this.constructor.effectName+"."+name)
        // return this.data.flags?.merp1e?.[this.constructor.effectName]?.[name]
    }

    setEffectFlag(name, value) {
        return this.setFlag("merp1e",this.constructor.effectName+"."+name, value);
        // const newData = {};
        // newData[`merp1e.${this.constructor.effectName}.${name}`] = value;
        // this.data.flags = mergeObject(this.data.flags, expandObject(newData));        
    }

        /* Methods that should be overloaded */
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

}

class Merp1eItemEffectBase extends Merp1eEffect {
    static effectType = "ItemEffect";
}

class Merp1eItemEffectSkillBonus extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
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
        return parseInt(this.getEffectFlag("value") || 0);
    }

    get skillReference() {
        return this.getEffectFlag("skillReference");
    }

    applyEffect(data) {
        if(!data.actor) return;
        Object.values(data.actor.skills).forEach(skill => {
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

class Merp1eItemEffectSkillGroupBonus extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
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
        return parseInt(this.getEffectFlag("value") || 0);
    }

    get skillGroup() {
        return this.getEffectFlag("skillGroup")
    }

    applyEffect(data) {
        if(!data.actor) return;
        Object.values(data.actor.skills).forEach(skill => {
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

class Merp1eItemEffectRankSkillBonus extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
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
        return parseInt(this.getEffectFlag("value") || 0);
    }

    get skillReference() {
        return this.getEffectFlag("skillReference")
    }

    applyEffect(data) {
        if(!data.actor) return;
        Object.values(data.actor.skills).forEach(skill => {
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

class Merp1eItemEffectShield extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
    static effectName = "Shield";

    get type() {
        return this.getEffectFlag("type");
    }

    get extraBonus() {
        if (this.type == "none") return 0;

        return this.getEffectFlag("extraBonus") || 0;
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

    applyEffect(data) {
        if(!data.actor) return;
        if (this.type != null) {
            data.actor.defense.shield = duplicate(findByID(game.merp1e.Merp1eRules.defense.shieldTypes, this.type, "none"));
            if (this.extraBonus != 0) {
                data.actor.defense.shield.bonus += this.extraBonus;
            }
        }
    }
    removeEffects(actor) {
        actor.defense.shield = duplicate(findByID(game.merp1e.Merp1eRules.defense.shieldTypes, "none", "none"));
    }
}

class Merp1eItemEffectArmGreaves extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
    static effectName = "ArmGreaves";

    get type() { return this.getEffectFlag("type"); }
    get extraBonus() {
        if (this.type == "none") return 0;

        return this.getEffectFlag("extraBonus") || 0;
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

    applyEffect(data) {
        if(!data.actor) return;
        if (this.type != null) {
            data.actor.defense.armGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, this.type, "none"));
            if (this.extraBonus != 0) {
                data.actor.defense.armGreaves.bonus += this.extraBonus;
            }
        }
    }
    removeEffects(actor) {
        actor.defense.armGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, "none", "none"));
    }
}

class Merp1eItemEffectLegGreaves extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
    static effectName = "LegGreaves";

    get type() { return this.getEffectFlag("type"); }
    get extraBonus() {
        if (this.type == "none") return 0;

        return this.getEffectFlag("extraBonus") || 0;
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

    applyEffect(data) {
        if(!data.actor) return;
        if (this.type != null) {
            data.actor.defense.legGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, this.type, "none"));
            if (this.extraBonus != 0) {
                data.actor.defense.legGreaves.bonus += this.extraBonus;
            }
        }
    }
    removeEffects(actor) {
        actor.defense.legGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, "none", "none"));
    }
}

class Merp1eItemEffectHelm extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
    static effectName = "Helm";

    get type() { return this.getEffectFlag("type"); }
    get extraBonus() {
        if (this.type == "none") return 0;

        return this.getEffectFlag("extraBonus") || 0;
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

    applyEffect(data) {
        if(!data.actor) return;
        if (this.type != null) {
            data.actor.defense.helm = duplicate(findByID(game.merp1e.Merp1eRules.defense.helmTypes, this.type, "none"));
            if (this.extraBonus != 0) {
                data.actor.defense.helm.bonus += this.extraBonus;
            }
        }
    }

    removeEffects(actor) {
        actor.defense.helm = duplicate(findByID(game.merp1e.Merp1eRules.defense.helmTypes, "none", "none"));
    }
}

class Merp1eItemEffectArmor extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
    static effectName = "Armor";

    get type() { return this.getEffectFlag("type"); }
    get extraBonus() {
        if (this.type == "none") return 0;

        return this.getEffectFlag("extraBonus") || 0;
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

    applyEffect(data) {
        if(!data.actor) return;
        if (this.type != null) {
            data.actor.defense.armor = duplicate(findByID(game.merp1e.Merp1eRules.defense.armorTypes, this.type, "none"));
            if (this.extraBonus != 0) {
                data.actor.defense.armor.bonus += this.extraBonus;
            }
        }
    }

    removeEffects(data) {
        data.actor.defense.armor = duplicate(findByID(game.merp1e.Merp1eRules.defense.armorTypes, "none", "none"));
    }
}

class Merp1eItemEffectPPMultiplier extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
    static effectName = "PPMultiplier";

    get value() { return this.getEffectFlag("value") || 1; }

    get realm() { return this.getEffectFlag("realm"); }

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

    applyEffect(data) {
        if(!data.actor) return;
        if (this.realm == "Any" || this.realm == data.actor.spellcasting.realm) {
            data.actor.spellcasting.powerPointsMultiplier = data.actor.spellcasting.powerPointsMultiplier * this.value;
        }
    }
}

class Merp1eItemEffectSpellAdder extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
    static effectName = "SpellAdder";

    get value() { return this.getEffectFlag("value") || 0; }

    get realm() { return this.getEffectFlag("realm"); }

    generateDescription() {
        if (this.realm == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        if (this.value == 0) return game.i18n.localize("MERP1E.EffectDescription.SpellAdderUnset");

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.SpellAdder"),
        {
            VALUE: this.value,
            REALM: this.realm
        });
    }

    applyEffect(data) {
        if(!data.actor) return;
        if (this.realm == "Any" || this.realm == data.actor.spellcasting.realm) {
            data.actor.spellcasting.spellAdderMaximum = data.actor.spellcasting.spellAdderMaximum + this.value;
        }
    }
}

class Merp1eItemEffectSkillModifier extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
    static effectName = "SkillModifier";

    get value() { return this.getEffectFlag("value") || 0; }
    get valueFunction() { return this.getEffectFlag("valueFunction"); }
    get enableFunction() { return this.getEffectFlag("enableFunction"); }
    get label() { return this.getEffectFlag("label"); }

    get skillReference() {
        return this.getEffectFlag("skillReference");
    }

    generateDescription() {
        if (this.valueFunction == undefined || this.enableFunction == undefined || this.label == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        // don't care about this.value

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.SkillModifier"),
        {
            REFERENCE: this.skillReference
        });
    }

    applyEffect(data) {
        if (data?.skill?.data?.data?.reference == this.skillReference) {
            data.modifiers = data.modifiers || [];
            data.modifiers.push(new Merp1eModifier({
                value: this.value,
                enableFunction: this.enableFunction,
                valueFunction: this.valueFunction,
                label: this.label
            }));
        }
    }
}

class Merp1eItemEffectSkillGroupModifier extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
    static effectName = "SkillGroupModifier";

    get value() { return this.getEffectFlag("value") || 0; }
    get valueFunction() { return this.getEffectFlag("valueFunction"); }
    get enableFunction() { return this.getEffectFlag("enableFunction"); }
    get label() { return this.getEffectFlag("label"); }

    get skillGroup() {
        return this.getEffectFlag("skillGroup");
    }

    generateDescription() {
        if (this.valueFunction == undefined || this.enableFunction == undefined || this.label == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        // don't care about this.value

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.SkillGroupModifier"),
        {
            GROUP: this.skillGroup
        });
    }

    applyEffect(data) {
        if (data?.skill?.data?.data?.group == this.skillGroup) {
            data.modifiers = data.modifiers || [];
            data.modifiers.push(new Merp1eModifier({
                value: this.value,
                enableFunction: this.enableFunction,
                valueFunction: this.valueFunction,
                label: this.label,
                itemId: this.parent.id,
                itemName: this.parent.name
            }));
        }
    }
}

class Merp1eItemEffectRollTypeModifier extends Merp1eItemEffectBase {
    static dummy = Merp1eEffect.registeredTypes.push(this)
    static effectName = "RollTypeModifier";

    get value() { return this.getEffectFlag("value") || 0; }
    get valueFunction() { return this.getEffectFlag("valueFunction"); }
    get enableFunction() { return this.getEffectFlag("enableFunction"); }
    get label() { return this.getEffectFlag("label"); }

    get rollType() {
        return this.getEffectFlag("rollType");
    }

    generateDescription() {
        if (this.valueFunction == undefined || this.enableFunction == undefined || this.label == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        // don't care about this.value

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.RollTypeModifier"),
        {
            ROLLTYPE: this.rollType
        });
    }

    applyEffect(data) {
        if (data?.data?.rollTypeID == this.rollType) {
            data.modifiers = data.modifiers || [];
            data.modifiers.push(new Merp1eModifier({
                value: this.value,
                enableFunction: this.enableFunction,
                valueFunction: this.valueFunction,
                label: this.label,
                itemId: this.parent.id,
                itemName: this.parent.name
            }));
        }
    }
}



