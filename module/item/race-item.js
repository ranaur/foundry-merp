import { Merp1eItem } from "./base-item.js";

export class Merp1eRaceItem extends Merp1eItem {
    static type = "race";
    static dummy = Merp1eItem.registeredTypes.push(this);

    getStatBonus(stat) {
        return this.data.data.statsBonuses[stat] || 0;
    }
}


