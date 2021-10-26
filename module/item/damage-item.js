import { Merp1eItem } from "./base-item.js";

export class Merp1eDamageItem extends Merp1eItem {
    static type = "damage";
    static dummy = Merp1eItem.registeredTypes.push(this);
    
    apply() {
        if(!this.data.data.applied) {
        this.data.data.current = duplicate(this.data.data.initial);

        // Weapon arm = right, shield arm = left (sorry left-handed, improvement needed) XXX
        let armSide = this.data.data.initial.armSide;
        if(this.data.data.initial.armDamage != 0 && armSide == 0) // rules.heath.sideChoose => random
        {
            let coin = new Roll("1d2"); // 1 = shield, 2 = weapon
            coin.roll({async: false});
            armSide = coin.total;
        }
        this.data.data.current.leftArm = (armSide == 1 || armSide == 3 || armSide == 4) ? this.data.data.initial.armDamage : 0;
        this.data.data.current.rightArm = (armSide == 2 || armSide == 3 || armSide == 5) ? this.data.data.initial.armDamage : 0;

        let legSide = this.data.data.initial.legSide;
        if(this.data.data.initial.legDamage != 0 && legSide == 0) // rules.heath.sideChoose => random
        {
            let coin = new Roll("1d2"); // 1 = shield, 2 = weapon
            coin.roll({async: false});
            legSide = coin.total;
        }
        this.data.data.current.leftLeg =  (legSide == 1 || legSide == 3 || legSide == 4) ? this.data.data.initial.legDamage : 0;
        this.data.data.current.rightLeg = (legSide == 2 || legSide == 3 || legSide == 5) ? this.data.data.initial.legDamage : 0;

        this.data.data.applied = true;
        this.update({ _id: this.id, data: this.data.data });
        }
    }
}
