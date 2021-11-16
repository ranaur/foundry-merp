import { findByID } from "../util.js";
import { Merp1eItem } from "./base-item.js";
import { Merp1eModifiers } from "../modifier.js";

export class Merp1eSkillItem extends Merp1eItem {
    static type = "skill";
    static dummy = Merp1eItem.registeredTypes.push(this);

    addItemBonus(itemId, type, value) {
        this.itemBonuses.push({
            itemId: itemId,
            type: type,
            value: value
        });
    }

    constructor(data, contextopt) {
        super(data, contextopt);
        this.itemBonuses = []; // { value: 0, }
        this.bonuses = {
            actor: this.parent,
            skill: this,
            get rank() { return game.merp1e.Merp1eRules.resolveSkillBonus(this.skill.data.data); },
            get prof() { return (this.actor?.profession?.getProfessionSkillBonus?.(this.skill.data.data.reference) || 0) * this.actor.level; },
            get item() { return this.skill.itemBonuses.reduce((acc, itemBonus) => acc + itemBonus.value, 0); },
            get stat() { return this.skill.data.data.statBonus in this.actor.stats ? this.actor.stats[this.skill.data.data.statBonus].total : null; },
            get extra() { return parseInt(this.skill.data.data.extraBonus) || 0 },
            get spec() { return parseInt(this.skill.data.data.specialBonus) || 0 }
        };
    }

    get total() {
         return Object.entries(this.bonuses).reduce((a, i) => { return a + (typeof(i[1]) == "number" ? i[1] : 0); }, 0);
    }
    get reference() {
        return this.data.data.reference;
    }
    get defaultRollType() {
        return findByID(game.merp1e.Merp1eRules.rollTypes, this.data.data.rollType, null);
    }
    get defaultRollTypeCanRoll() {
        return this.defaultRollType?.rollCard ? true : false;
    }
    get modifiers() {
        if(this.parent) {
            let globalSkill = game.merp1e.Merp1eRules.skill.getAvaliableByReference(this.data?.data?.reference);
            return (this.data?.data?.modifiers || [] ).concat?.(globalSkill.modifiers);
        }
        return this.data?.data?.modifiers || [];
    }
    getModifiersOLD(groupName, label, contextData) {
        const modifiers = new Merp1eModifiers(groupName, label, this.data?.data?.modifiers);
        
        modifiers.evaluate(contextData);
        const checked = contextData?.data?.modifiersChecked?.[modifiers.id];
        const values = contextData?.data?.modifiersValue?.[modifiers.id];
        const groupTotal = modifiers.getTotal(checked, values);
        modifiers.total = groupTotal;
        return modifiers;
    }
}
