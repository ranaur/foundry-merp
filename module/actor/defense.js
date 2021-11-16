import { findByID } from "../util.js";

export class Merp1eDefense {
    constructor(actor) {
      this.actor = actor;
      const sheetData = actor.data.data;
      if(game.merp1e.Merp1eRules.settings.armorControlManual) { // get from sheet data
        this.shield = findByID(game.merp1e.Merp1eRules.defense.shieldTypes, sheetData.defense?.shield?.id, "none");
        this.armGreaves = findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, sheetData.defense?.armGreaves?.id, "none");
        this.legGreaves = findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, sheetData.defense?.legGreaves?.id, "none");
        this.helm = findByID(game.merp1e.Merp1eRules.defense.helmTypes, sheetData.defense?.helm?.id, "none");
        this.armor = findByID(game.merp1e.Merp1eRules.defense.armorTypes, sheetData.defense?.armor?.id, "none");
      } else { // get from item effects
        this.shield = findByID(game.merp1e.Merp1eRules.defense.shieldTypes, "none");
        this.armGreaves = findByID(game.merp1e.Merp1eRules.defense.armGreavesTypes, "none");
        this.legGreaves = findByID(game.merp1e.Merp1eRules.defense.legGreavesTypes, "none");
        this.helm = findByID(game.merp1e.Merp1eRules.defense.helmTypes, "none");
        this.armor = findByID(game.merp1e.Merp1eRules.defense.armorTypes, "no");
      }
    }
  
    get skill() {
      return this.actor.getSkillByReference(game.merp1e.Merp1eRules.skill.DEFENSIVE_BONUS);
    }
  
    get modifiers() {
      return this.skill.modifiers;
    }
    
    get total() { 
      return this.skill.total + (this.shield?.bonus || 0) + (this.armGreaves?.bonus || 0) + (this.legGreaves?.bonus || 0) + (this.helm?.bonus || 0) + (this.armor?.bonus || 0);
    }
  }
  