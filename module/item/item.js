/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class Merp1eItem extends Item {
  constructor(data, contextopt) {
    super(data, contextopt);

    switch(this.type) {
      case "race":
        this.language = [];
        break;
    }

    switch(this.type) {
      case "race":
        this._copyClassFunctions(Merp1eRace);
        break;
      case "profession":
        this._copyClassFunctions(Merp1eProfession);
        break;
        case "skill":
          this._copyClassFunctions(Merp1eSkill);
          break;
      case "damage":
        this._copyClassFunctions(Merp1eDamage);
        break;
      }
  }
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();
  }

  _copyClassFunctions(className) {
    for (var prop of Object.getOwnPropertyNames( className.prototype )) {
      if (!(prop in this)) {
          this[prop] = className.prototype[prop];
      }
    }
  }

  async _preCreate(createData, options, user) {
    await super._preCreate(createData, options, user);
    // Default icon
    const path = "systems/merp1e/icons/item";
    const updateData = {};
    updateData['img'] = `${path}/${this.type}.svg`;;
    //updateData['token.img'] = `${path}/${data.type}.svg`;;
    //updateData['token.actorLink'] = true;
    //updateData['token.name'] = createData.name;
    //updateData['token.displayName'] = 50;
    await this.data.update( updateData );
  }
}

class Merp1eRace {
  getStatBonus(stat) {
    return this.data.data.statsBonuses[stat] || 0;
  }
}

class Merp1eProfession {
  getProfessionSkillBonuses(skillReference) {
    return this.data.data.professionSkillBonuses[skillReference] || 0;
  }
}

class Merp1eSkill {
}

class Merp1eDamage {
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

