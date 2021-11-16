import { findByID, formatBonus, replaceData } from "../util.js";
import { Merp1eModifier } from "../modifier.js";
import { Merp1eAttack } from "../attack.js";
import { Merp1eEffect, Merp1eEffectAdapter } from "./base-effects.js";

export class Merp1eItemEffect extends Merp1eEffect {
    static registeredAdapters = []; // filled by a dummy on each subclass
}

export class Merp1eItemEffectAdapter extends Merp1eEffectAdapter {
    static get adapterType() {
        return "ItemEffect"
    };
    static get adapterName() {
        return this.name.replace("Merp1eItemEffect", "");
    };
}

class Merp1eItemEffectSkillBonus extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "SkillBonus";

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
                skill.addItemBonus(this?.parent?.id, this.constructor.adapterName, this.value);
            }
        });
    }

    static getData(sheetData) {
        sheetData.sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder();
    }

    static removeEffects(actor) {
        Object.values(actor.skills).forEach(skill => {
            skill.itemBonuses = skill.itemBonuses.filter((item) => item?.adapterName != this.constructor.adapterName);
        });
    }
}

class Merp1eItemEffectSkillGroupBonus extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "SkillGroupBonus";

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
                skill.addItemBonus(this?.parent?.id, this.constructor.adapterName, this.value);
            }
        });
    }

    static getData(sheetData) {
        sheetData.sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder();
    }

    static removeEffects(actor) {
        Object.values(actor.skills).forEach(skill => {
            skill.itemBonuses = skill.itemBonuses.filter((item) => item?.adapterName != this.constructor.adapterName);
        });
    }
}

class Merp1eItemEffectRollTypeBonus extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "RollTypeBonus";

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
    
    static getData(sheetData) {
        sheetData.rollTypes = game.merp1e.Merp1eRules.rollTypes;
    }

    applyEffect(data) {
        if(!data.actor) return;
        Object.values(data.actor.skills).forEach(skill => {
            if (skill?.data?.data?.rollTypeID == this.rollType) {
                skill.addItemBonus(this?.parent?.id, this.constructor.adapterName, this.value);
            }
        });
    }
}

class Merp1eItemEffectRankSkillBonus extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "RankSkillBonus";

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
                skill.addItemBonus(this?.parent?.id, this.constructor.adapterName, this.value * skill.data.data.ranks);
            }
        });
    }

    static getData(sheetData) {
        sheetData.sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder();
    }

    static removeEffects(actor) {
        Object.values(actor.skills).forEach(skill => {
            skill.itemBonuses = skill.itemBonuses.filter((item) => item?.adapterName != this.constructor.adapterName);
        });
    }
}

class Merp1eItemEffectShield extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "Shield";

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

    static getData(sheetData) {
        sheetData.shieldBaseBonus = findByID(game.merp1e.Merp1eRules.defense.shieldTypes, sheetData.effect.flags?.merp1e?.Shield?.type, "none").bonus;
    }

    static removeEffects(actor) {
        actor.defense.shield = duplicate(findByID(game.merp1e.Merp1eRules.defense.shieldTypes, "none", "none"));
    }
}

class Merp1eItemEffectArmGreaves extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "ArmGreaves";

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

    static getData(sheetData) {
        sheetData.armGreavesBaseBonus = findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, sheetData.effect.flags?.merp1e?.ArmGreaves?.type, "none").bonus;
    }

    static removeEffects(actor) {
        actor.defense.armGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, "none", "none"));
    }
}

class Merp1eItemEffectLegGreaves extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "LegGreaves";

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

    static getData(sheetData) {
        sheetData.legGreavesBaseBonus = findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, sheetData.effect.flags?.merp1e?.LegGreaves?.type, "none").bonus;
    }

    static removeEffects(actor) {
        actor.defense.legGreaves = duplicate(findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, "none", "none"));
    }
}

class Merp1eItemEffectHelm extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "Helm";

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

    static getData(sheetData) {
        sheetData.helmBaseBonus = findByID(game.merp1e.Merp1eRules.defense.helmTypes, sheetData.effect.flags?.merp1e?.Helm?.type, "none").bonus;
    }

    static removeEffects(actor) {
        actor.defense.helm = duplicate(findByID(game.merp1e.Merp1eRules.defense.helmTypes, "none", "none"));
    }
}

class Merp1eItemEffectArmor extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "Armor";

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

    static getData(sheetData) {
        sheetData.armorBaseBonus = findByID(game.merp1e.Merp1eRules.defense.armorTypes, sheetData.effect.flags?.merp1e?.Armor?.type, "no").bonus;
    }

    static removeEffects(data) {
        data.actor.defense.armor = duplicate(findByID(game.merp1e.Merp1eRules.defense.armorTypes, "none", "none"));
    }
}

class Merp1eItemEffectPPMultiplier extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "PPMultiplier";

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
        if (this.realm == "Any" || this.realm == data.actor.spellcasting.realm?.id) {
            data.actor.spellcasting.powerPointsMultiplier = data.actor.spellcasting.powerPointsMultiplier * this.value;
        }
    }
}

class Merp1eItemEffectSpellAdder extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "SpellAdder";

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
        if (this.realm == "Any" || this.realm == data.actor.spellcasting.realm?.id) {
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

    applyEffect(data) { // the modifier adapter uses applyModifier
        return;
    }

    getModifier(data) { 
        return false;
    }
}

class Merp1eItemEffectSkillModifier extends Merp1eItemModifier {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "SkillModifier";

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

    static getData(sheetData) {
        sheetData.sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder();
    }

    getModifier(data) {
        if (data?.skill?.data?.data?.reference == this.skillReference) {
            return this.createModifier();
        }
        return false;
    }
}

class Merp1eItemEffectSkillGroupModifier extends Merp1eItemModifier {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "SkillGroupModifier";

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

    static getData(sheetData) {
        sheetData.sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder();
    }

    getModifier(data) {
        if (data?.skill?.data?.data?.group == this.skillGroup) {
            return this.createModifier();
        }
        return false;
    }
}

class Merp1eItemEffectRollTypeModifier extends Merp1eItemModifier {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "RollTypeModifier";

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
            ROLLTYPE: this.rollType,
            LABEL: this.label
        });
    }

    static getData(sheetData) {
        sheetData.rollTypes = game.merp1e.Merp1eRules.rollTypes;
    }

    getModifier(data) {
        if (data?.data?.rollTypeID == this.rollType) {
            return this.createModifier();
        }
        return false;
    }
}

class Merp1eItemEffectAttackTypeModifier extends Merp1eItemModifier {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "AttackTypeModifier";

    get value() { return this.getEffectFlag("value") || 0; }
    get valueFunction() { return this.getEffectFlag("valueFunction"); }
    get enableFunction() { return this.getEffectFlag("enableFunction"); }
    get label() { return this.getEffectFlag("label"); }

    get attackType() {
        return this.getEffectFlag("attackType");
    }

    generateDescription() {
        if (this.valueFunction == undefined || this.enableFunction == undefined || this.label == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");
        // don't care about this.value

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.AttackModifier"),
        {
            ATTACKTYPE: game.i18n.localize(findByID(game.merp1e.Merp1eRules.attack.types, this.attackType, "")?.label),
            LABEL: this.label
        });
    }

    static getData(sheetData) {
        sheetData.attackTypes = game.merp1e.Merp1eRules.attack.types;
    }

    getModifier(data) {
        if (data?.data?.attackType == this.attackType) {
            return this.createModifier();
        }
        return false;
   }
}


export class Merp1eItemEffectAttack extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "Attack";

    static getData(sheetData) {
        sheetData.attackTables = game.merp1e.Merp1eRules.attack.getAvaliableTables();
        sheetData.attackMaximumSizes = game.merp1e.Merp1eRules.attack.maxResults;
        const sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder();
        sheetData.weaponSkills = findByID(sheetOrder, "Weapon", null)?.skills;
        sheetData.avaliableCriticalSizes = game.merp1e.Merp1eRules.attack.criticalSizes;
        sheetData.avaliableCriticals = game.merp1e.Merp1eRules.attack.criticalTypes;
        sheetData.armorTypes = game.merp1e.Merp1eRules.defense.armorTypes;
        sheetData.attackTypes = game.merp1e.Merp1eRules.attack.types;
    }

    get action() { 
        const armorModification = {};
        game.merp1e.Merp1eRules.defense.armorTypes.forEach((armorType) => {
            armorModification[armorType.id] = this.getEffectFlag(`ArmorModification.${armorType.id}`);
        });

        const actionData = {
            tableReference: this.getEffectFlag("table"),
            maximumSize: this.getEffectFlag("maximumSize"),
            skillReference: this.getEffectFlag("skillReference"),
            canUseShield: this.getEffectFlag("canUseShield"),
            fumbleNumber: this.getEffectFlag("fumbleNumber"),
            fumbleCrit: this.getEffectFlag("fumbleCrit"),
            primaryCrit: this.getEffectFlag("primaryCrit"),
            primaryCritMax: this.getEffectFlag("primaryCritMax"),
            secondaryCrit: this.getEffectFlag("secondaryCrit"),
            secondaryCritMax: this.getEffectFlag("secondaryCritMax"),
            isTwoHanded: this.getEffectFlag("isTwoHanded"),
            attackType: this.getEffectFlag("attackType"),
            baseRange: this.getEffectFlag("baseRange"),
            roundsLoad: this.getEffectFlag("roundsLoad"),
            roundsReload: this.getEffectFlag("roundsReload"),
            loadReloadPenalty: this.getEffectFlag("loadReloadPenalty"),
            meleeRange: this.getEffectFlag("meleeRange"),
            bonus: this.getEffectFlag("bonus") || 0,
            armorModification: armorModification
        };

        if (!actionData.tableId == undefined) return undefined;
        if (!actionData.skillReference == undefined) return undefined;
        if (!actionData.fumbleNumber == undefined) return undefined;
        if (!actionData.primaryCrit == undefined) return undefined;

        return actionData;
    }

    generateDescription() {
        const attackInfo = this.action;

        if (!attackInfo == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.Attack"), {
            TYPE: game.i18n.localize(findByID(game.merp1e.Merp1eRules.attack.types, attackInfo.attackType, "???")?.label),
            BONUS: attackInfo.bonus < 0 ? attackInfo.bonus : "+" + attackInfo.bonus,
        });
    }

    applyEffect(data) {
        if(!data.actor) return;

        const attackInfo = this.action;

        if (!attackInfo == undefined) return;

        data.actor.attacks.push(new Merp1eAttack(this.action, this._effect));
    }

    static removeEffects(actor) {
        actor.attacks = [];
    }
}

export class Merp1eItemEffectSkillManeuver extends Merp1eItemEffectAdapter {
    static dummy = Merp1eItemEffect.registeredAdapters.push(this)
    //static adapterName = "SkillManeuver";

    static getData(sheetData) {
        const sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder();
    }

    get action() { 
        const actionData = {
            skillReference: this.getEffectFlag("skillReference"),
            bonus: this.getEffectFlag("bonus") || 0
        };

        if (!actionData.skillReference == undefined) return undefined;

        return actionData;
    }

    generateDescription() {
        const actionData = this.action;

        if (!actionData == undefined) return game.i18n.localize("MERP1E.Effect.NotConfigured");

        return replaceData(game.i18n.localize("MERP1E.EffectDescription.StaticManeuver"), {
            SKILL: actionData.skillReference,
            BONUS: actionData.bonus < 0 ? actionData.bonus : "+" + actionData.bonus,
        });
    }

    applyEffect(data) {
        if(!data.actor) return;

        const actionData = this.action;

        if (!actionData == undefined) return;

        data.actor.actions.push(new Merp1eAction(actionData, this._effect));
    }

    static removeEffects(actor) {
        actor.actions = [];
    }
}

