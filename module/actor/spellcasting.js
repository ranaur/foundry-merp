import { findByID } from "../util.js";

export class Merp1eSpellCasting {
    constructor(actor) {
      this.actor = actor;
      this.actor.data.data.spellcasting = this.actor.data.data.spellcasting || {};
      if(game.merp1e.Merp1eRules.settings.spellcastingControlAutomatic) {
        this.actor.data.data.spellcasting.powerPointsMultiplier = 1;
        this.actor.data.data.spellcasting.spellAdderMaximum = 0;
      }
    }
  
    getKnownSpellLists() {
        let res = [];
        Object.values(this.actor.spelllists).forEach((sl) => {
          if(sl.isLearned) {
            let slRes = new Object();
            slRes.spelllist = sl;
            slRes.knownSpells = new Array();
            Object.values(sl.data.data.spells).forEach((sp) => {
              if(sl.canCast(sp._id)) {
                slRes.knownSpells.push({
                  id: sp._id,
                  spell: sp,
                  name: `(${sp.level}) ${sp.name}`
                })
              }
            });
            res.push(slRes);
          }
        });
        return res;
    }

    get realm() {
      let professionRealm = this.actor.profession?.data?.data?.realm || null;
      if( professionRealm == null) return null;
  
      if( professionRealm == "any") professionRealm = this.actor.data.data.spellcasting.realm; // choosen realm
  
      return findByID(game.merp1e.Merp1eRules.magic.realms, professionRealm, null);
    }
  
    get spellAdderMaximum() {
      return this.actor.data.data.spellcasting.spellAdderMaximum || 0;
    }
  
    set spellAdderMaximum(value) {
      this.actor.data.data.spellcasting.spellAdderMaximum = value;
    }
  
    get spellAdderCurrent() {
      let spellAdderCurrent = this.actor.data.data.spellcasting.spellAdderCurrent || 0;
      if( spellAdderCurrent < 0 ) spellAdderCurrent = 0;
      if( spellAdderCurrent > this.spellAdderMaximum )
      {
        this.spellAdderCurrent = this.spellAdderMaximum;
        spellAdderCurrent = this.spellAdderMaximum;
      }
      return spellAdderCurrent;
    }
  
    set spellAdderCurrent(value) {
      this.actor.data.data.spellcasting.spellAdderCurrent = value;
      //this.actor.update( { "data.spellcasting.spellAdderCurrent": value });
    }
  
    get powerPointsPerLevel() {
      if(this.realm == null) return 0;
      let realmStatValue = this.actor.stats[this.realm?.stat]?.value || 0;
      return game.merp1e.Merp1eRules.resolvePowerPointsPerLevel(realmStatValue);
    }  
  
    set powerPointsMultiplier(value) {
      this.actor.data.data.spellcasting.powerPointsMultiplier = value;
      //this.actor.update( { "data.spellcasting.powerPointsMultiplier": this.actor.data.data.spellcasting.powerPointsMultiplier });
    }
  
    get powerPointsMultiplier() {
      return this.actor.data.data.spellcasting.powerPointsMultiplier || 1;
    }
  
    get powerPointsMaximum() {
      return this.powerPointsPerLevel * this.actor.level * this.powerPointsMultiplier;
    }
  
    get powerPointsCurrent() {
      let powerPointsCurrent = this.actor.data.data.spellcasting.powerPointsCurrent || 0;
      if( powerPointsCurrent < 0 ) powerPointsCurrent = 0;
      if( powerPointsCurrent > this.powerPointsMaximum )
      {
        this.powerPointsCurrent = this.powerPointsMaximum;
        powerPointsCurrent = this.powerPointsMaximum;
      }
      return powerPointsCurrent;
    }
  
    set powerPointsCurrent(value) {
      this.actor.data.data.spellcasting.powerPointCurrent = value;
      //this.actor.update( { "data.spellcasting.powerPointCurrent": value });
    }
  
    get reset() {
      this.powerPointsCurrent = this.powerPointsMaximum;
      this.spellAdderCurrent = this.spellAdderMaximum;
    }
  }