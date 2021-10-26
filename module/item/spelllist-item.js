import { Merp1eItem } from "./base-item.js";

export class Merp1eSpelllistItem extends Merp1eItem {
    static type = "spelllist";
    static dummy = Merp1eItem.registeredTypes.push(this);

    get isLearned() {
        return this.data.data.chanceOfLearning == 100;
    }

    canCast(spellId) {
        let spell = Object.values(this.data.data.spells).find((sp) =>spellId == sp._id);
        const actorLevel = this.parent?.level;

        return this.isLearned && spell.level <= actorLevel;
    }
}
  
