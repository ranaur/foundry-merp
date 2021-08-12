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
        this._copyClassFunctions(Mer1eRace);
        break;
      case "profession":
        this._copyClassFunctions(Mer1eProfession);
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

class Mer1eRace {
  getStatBonus(stat) {
    return this.data.data.statsBonuses[stat] || 0;
  }
}

class Mer1eProfession {
  getProfessionSkillBonuses(skillReference) {
    return this.data.data.professionSkillBonuses[skillReference] || 0;
  }
}