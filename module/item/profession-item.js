import { Merp1eItem } from "./base-item.js";

export class Merp1eProfessionItem extends Merp1eItem {
    static type = "profession";
    static dummy = Merp1eItem.registeredTypes.push(this);
    
    getProfessionSkillBonus(skillReference) {
        return this.data?.data?.professionSkillBonuses[skillReference] || 0;
    }
}
  
