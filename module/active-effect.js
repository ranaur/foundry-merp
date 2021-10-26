import { copyClassFunctions, findByID, formatBonus, toKebabCase, replaceData } from "./util.js";
import { Merp1eEffectCondition } from "./active-effect-condition.js";
import { Merp1eModifier } from "./modifier.js";

export class Merp1eEffect extends ActiveEffect {
    static registeredAdapters = []; // filled by a dummy on each subclass

    static registerParts(templates) {
        this.registeredAdapters.forEach((effect) => templates.push(effect.templatePart));
    }

    static get registeredClasses() {
        return this.registeredAdapters.reduce((acc, cls) => { acc[cls.effectName] = cls; return acc; }, {})
    }

    constructor(data, context) {
        // // From Carter_DC
        // //useless in the present case but cool
        // //creates a derived class for specific item types
        // if ( data?.flags?.merp1e?.effectType in CONFIG.ActiveEffect.documentClasses && !context?.isExtendedClass) {
        //     // specify our custom item subclass here
        //     // when the constructor for the new class will call it's super(),
        //     // the isExtendedClass flag will be true, thus bypassing this whole process
        //     // and resume default behavior
        //     return new CONFIG.ActiveEffect.documentClasses[data?.flags?.merp1e?.effectType](data,{...{isExtendedClass: true}, ...context});
        // }    
        //default behavior, just call super and do random item inits.
        super(data, context);
    }

    prepareBaseData() {
        this.data.flags = mergeObject(this.data.flags, { merp1e: { conditionType: this.data.flags.merp1e?.conditionType || "AlwaysOn" } });
        this.data.icon ??= "icons/svg/aura.svg";
        super.prepareBaseData();
    }

    prepareDerivedData() {
        //let effectType = this.data.flags.merp1e?.effectType || null;
        //let effectClass = Merp1eActiveEffect.effectTypes.reduce((acc, cls) => { return (cls.effectName == effectType) ? cls : acc }, null);
        //if (effectClass != null) copyClassFunctions(this, effectClass);

        super.prepareDerivedData();
    }

    get conditionClass() {
        let conditionType = this.data.flags.merp1e?.conditionType;
        return Merp1eEffectCondition.registeredTypes.find((cls) => cls.conditionName == conditionType);
    }

    get condition() {
        return new this.conditionClass;
    }
    
    get effectType() {
        return this.getFlag("merp1e", "effectType");
    }

    get effectAdapter() {
        if(this.effectType)
        return new CONFIG.ActiveEffect.documentClasses[this.effectType](this);
    }

    get name() {
        return this.effectAdapter?.generateDescription?.() ||  game.i18n.localize("MERP1E.Effect.New");
    }

    get priority() {
        return this.condition?.priority || 100;
    }

    static get defaultConfig() {
        return {
            transfer: false
        };
    }

    /** @override */
    apply(actor, change) {
        // disable
    }

    /* Methods that should be overloaded */
    /**
     * Apply the effect on actor
     */
    applyEffect(data) {
        if(!this.condition.isActive(this, data?.actor)) return;

        return this.effectAdapter?.applyEffect(data);
    }

    /**
     * Remove all effects for this type
     */
    static removeEffects(actor) {
        Object.values(actor.skills).forEach(skill => {
            skill.itemBonuses = skill.itemBonuses.filter((item) => item?.effectName != this.constructor.effectName);
        });
    }
}

class Merp1eEffectAdapter {
    static effectType = "EffectAdapter";
    static effectName = "NotConfigured";

    static get label() {
        return "MERP1E.EffectType." + this.effectName;
    }

    static get templatePart() {
        const path = "systems/merp1e/templates/effect";
        const filename = toKebabCase(this.effectName + this.effectType) + "-part.html";
        return `${path}/${filename}`;
    }

    constructor(effect) {
        this._effect = effect;
    }

    getEffectFlag(name) {
        return this._effect.getFlag("merp1e",this.constructor.effectName+"."+name)
        // return this._effect.data.flags?.merp1e?.[this.constructor.effectName]?.[name]
    }

    setEffectFlag(name, value) {
        return this._effect.setFlag("merp1e",this.constructor.effectName+"."+name, value);
        // const newData = {};
        // newData[`merp1e.${this.constructor.effectName}.${name}`] = value;
        // this._effect.data.flags = mergeObject(this.data.flags, expandObject(newData));        
    }

    get parent() {
        return this._effect.parent;
    }
}

class Merp1eItemEffectAdapter extends Merp1eEffectAdapter {
    static effectType = "ItemEffect";
}

class Merp1eItemEffectSkillBonus extends Merp1eItemEffectAdapter {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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
                skill.addItemBonus(this?.parent?.id, this.constructor.effectName, this.value);
            }
        });
    }

    removeEffects(actor) {
        Object.values(actor.skills).forEach(skill => {
            skill.itemBonuses = skill.itemBonuses.filter((item) => item?.effectName != this.constructor.effectName);
        });
    }
}

class Merp1eItemEffectSkillGroupBonus extends Merp1eItemEffectAdapter {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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
                skill.addItemBonus(this?.parent?.id, this.constructor.effectName, this.value);
            }
        });
    }

    removeEffects(actor) {
        Object.values(actor.skills).forEach(skill => {
            skill.itemBonuses = skill.itemBonuses.filter((item) => item?.effectName != this.constructor.effectName);
        });
    }
}

class Merp1eItemEffectRollTypeBonus extends Merp1eItemEffectAdapter {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
    static effectName = "RollTypeBonus";

    generateDescription() {
        if (this.value == 0 || this.rollType == null) {
            return game.i18n.localize("MERP1E.Effect.NotConfigured");
        }
            
        return replaceData(game.i18n.localize("MERP1E.EffectDescription.RollTypeBonus"),
            {
                BONUS: formatBonus(this.value),
                ROLLTYPE: this.rollType
            });
    }

    get value() {
        return parseInt(this.getEffectFlag("value") || 0);
    }

    get rollType() {
        return this.getEffectFlag("rollType");
    }
    
    applyEffect(data) {
        if(!data.actor) return;
        Object.values(data.actor.skills).forEach(skill => {
            if (skill?.data?.data?.rollTypeID == this.rollType) {
                skill.addItemBonus(this?.parent?.id, this.constructor.effectName, this.value);
            }
        });
    }
}

class Merp1eItemEffectRankSkillBonus extends Merp1eItemEffectAdapter {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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
                skill.addItemBonus(this?.parent?.id, this.constructor.effectName, this.value * skill.data.data.ranks);
            }
        });
    }

    removeEffects(actor) {
        Object.values(actor.skills).forEach(skill => {
            skill.itemBonuses = skill.itemBonuses.filter((item) => item?.effectName != this.constructor.effectName);
        });
    }
}

class Merp1eItemEffectShield extends Merp1eItemEffectAdapter {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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

class Merp1eItemEffectArmGreaves extends Merp1eItemEffectAdapter {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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

class Merp1eItemEffectLegGreaves extends Merp1eItemEffectAdapter {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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

class Merp1eItemEffectHelm extends Merp1eItemEffectAdapter {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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

class Merp1eItemEffectArmor extends Merp1eItemEffectAdapter {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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

class Merp1eItemEffectPPMultiplier extends Merp1eItemEffectAdapter {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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

class Merp1eItemEffectSpellAdder extends Merp1eItemEffectAdapter {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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

class Merp1eItemModifier extends Merp1eItemEffectAdapter {
    createModifier() {
        return new Merp1eModifier({
            value: this.value,
            enableFunction: this.enableFunction,
            valueFunction: this.valueFunction,
            label: this.label,
            itemId: this.parent.id,
            itemName: this.parent.name,
            itemGlobal: this.parent?.data?.data?.type == "Global Effects",
        });
    }
}

class Merp1eItemEffectSkillModifier extends Merp1eItemModifier {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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
            data.modifiers.push(this.createModifier());
        }
    }
}

class Merp1eItemEffectSkillGroupModifier extends Merp1eItemModifier {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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
            data.modifiers.push(this.createModifier());
        }
    }
}

class Merp1eItemEffectRollTypeModifier extends Merp1eItemModifier {
    static dummy = Merp1eEffect.registeredAdapters.push(this)
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
            data.modifiers.push(this.createModifier());
        }
    }
}