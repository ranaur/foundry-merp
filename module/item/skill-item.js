import { Merp1eItem } from "./base-item.js";

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
            get prof() { return this.actor.profession?.getProfessionSkillBonus?.(this.skill.data.data.reference) * this.actor.level; },
            get item() { return this.skill.itemBonuses.reduce((acc, itemBonus) => acc + itemBonus.value, 0); },
            get stat() { return this.skill.data.data.statBonus in this.actor.stats ? this.actor.stats[this.skill.data.data.statBonus].total : null; },
            get extra() { return parseInt(this.skill.data.data.extraBonus) || 0 },
            get spec() { return parseInt(this.skill.data.data.specialBonus) || 0 }
        };
    }

    get total() {
         return Object.entries(this.bonuses).reduce((a, i) => { return a + (typeof(i[1]) == "number" ? i[1] : 0); }, 0);
    }
}
