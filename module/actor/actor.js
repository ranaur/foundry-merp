import { confirmDialog, min } from "../util.js";
import { Merp1eItemEffect } from "../effect/item-effects.js";
import { Merp1eDefense } from "./defense.js";
import { Merp1eXP } from "./xp.js";
import { Merp1eHealth } from "./health.js";
import { Merp1eSpellCasting } from "./spellcasting.js";
import { Merp1eStats } from "./stat.js";
import { Merp1eRules } from "../rules/rules.js";
import { Merp1eAction } from "./action.js";
import { Merp1eDecayChatCard } from "../chat/decay-chatcard.js";
import { Merp1eInjury } from "./injury.js"

class Merp1eDeath {
  constructor(actor) {
    this.actor = actor;
  }

  //  DEATH HANDLING ROUTINES
  /**
   * 
   * @param {*} worldTime Time of the death (in worldTime - seconds since epoch)
   * 
   * Returns: nothing, because nothing returns from death :-)
   */
  async die(worldTime = null) {
    worldTime ??= game.time.worldTime;

    await this.actor.setFlag("merp1e", "deathTime", worldTime);
  }
  get deathTime() {
    return this.actor.getFlag("merp1e", "deathTime");
  }

  isDead(worldTime = null) {
    worldTime ??= game.time.worldTime;

    return (this.deathTime != null) && (worldTime >= this.deathTime);
  }

  get isDeadNow() { return this.isDead(); }
  /*  
  get secondsDead() {
    const since = this.since;
    if(!since) return null;
    if(game.time.worldTime < since)  return null;
    return (game.time.worldTime - this.since);
  }

  getDeadSinceInTimeframe( timeframeId ) {
    return new Merp1eTimeframe(this.secondsDead).getValue(timeframeId);
  }

  get roundsDead() {
    return this.getDeadSinceInTimeframe("rounds");
  }

  get daysDead() {
    return this.getDeadSinceInTimeframe("days");
  }
  */

  async ressurrect() {
    await this.actor.setFlag("merp1e", "deathTime", null);
    // clear preserved status
    await this.actor.setFlag("merp1e", "preserveTime", null);
    await this.actor.setFlag("merp1e", "preservedFor", null);
    // clear life keep status
    await this.actor.setFlag("merp1e", "lifeKeepTime", null);
    await this.actor.setFlag("merp1e", "lifeKeepdFor", null);
  }

  get isAliveNow() {
    return !this.isDead;
  }

  async preserve(forSeconds, worldTime = null ) {
    worldTime ??= game.time.worldTime;
    await this.actor.setFlag("merp1e", "preserveTime", worldTime);
    await this.actor.setFlag("merp1e", "preservedFor", forSeconds);
  }

  get preserveTime() { return this.actor.getFlag("merp1e", "preserveTime"); }
  get preservedFor() { return this.actor.getFlag("merp1e", "preservedFor"); }
  get preserveEndTime() { return (this.preserveTime + this.preservedFor) || null; }

  isPreserved( worldTime = null ) {
    if(!this.isDead(worldTime)) return true;

    worldTime ??= game.time.worldTime;

    if(worldTime >= this.preserveTime && worldTime < this.preserveEndTime) return true;

    return false;
  }
  //get isPreservedNow() { return this.isPreserved(); }

  async lifeKeep( forSeconds, worldTime = null ) {
    worldTime ??= game.time.worldTime;
    await this.actor.setFlag("merp1e", "lifeKeepTime", worldTime);
    await this.actor.setFlag("merp1e", "lifeKeepdFor", forSeconds);
  }

  get lifeKeepTime() { return this.actor.getFlag("merp1e", "preserveTime"); }
  get lifeKeepdFor() { return this.actor.getFlag("merp1e", "preservedFor"); }
  get lifeKeepEndTime() { return (this.lifeKeepTime + this.lifeKeepdFor) || null; }
  isLifeKeepd( worldTime = null ) {
    if(!this.isDead(worldTime)) return true;

    worldTime ??= game.time.worldTime;

    if(worldTime >= this.lifeKeepTime && worldTime < this.lifeKeepEndTime) return true;

    return false;
  }
  //get isLifeKeepdNow() { return this.isLifeKeepd(); }

  async decayStats(frames, timeFrame) {
    return new Merp1eDecayChatCard({
      actorID: this.id,
      frames: frames,
      timeFrame: timeFrame,
    })
  }
}


/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class Merp1eActor extends Actor {
  /* --------------------------------------------------
   * Class overrides
   * -------------------------------------------------- */
  getCombats() {
    return game.combats.filter((cbt) => {
      const tokens = cbt.combatants.filter((a) => a.actor?.id == this.actor?.id);
      
      return tokens.length > 0;
    });
  }

  /*
   *  Enhance the class preparing the data for use.
   */
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
    this.death = new Merp1eDeath(this);
    this._characterInit();
  }

  /*
   *  Set "defaults" for fields when creating a new actor.
   */
  /** @override */
  async _preCreate(createData, options, user) {
    await super._preCreate(createData, options, user);

    if (createData.type === "character") {
      await this.data.update({ "items": this.getDefaultSkills() });
      await this.data.update({
        "items": [{
          "name": game.i18n.localize("MERP1E.XP.Initial"),
          "type": "xp",
          "data": {
            "description": "See section 3.4, page 28",
            "gmnotes": "",
            "refecence": game.i18n.localize("MERP1E.XP.Initial"),
            "value": 10000
            }
          }]
      });
    }
  }

  /*
   *  Set "defaults" for embedded item. Tipically, erases eventual values/statuses that could come from a copy.
   */
  /** @override */
  createEmbeddedDocuments(embeddedName, dataArray, options) {
    if(embeddedName == "Item") {
      for(let data of dataArray) {
        switch(data.type) {
          case 'skill':
            data.data.ranks = 0;
            data.data.rankBonus = 0;
            data.data.rankSet = {};
            data.data.group = data.data.group || "Secondary";
  //        case 'damage':
  //          data.data.current = duplicate(data.data.initial || {});
            break;
          case 'equipment':
            data.data.location = "carrying";
        }
      }
    }
    
    return super.createEmbeddedDocuments(embeddedName, dataArray, options);
  }

  _processUniqueItem(type, def) {
    let items = this.items.filter( (item) => item.type == type );
    if(items.length == 0) {
      return def;
    } else {
      if(items.length > 1) {
        console.log(`actor has more than one ${type}! Deleting remaining items.`);
        
        this.deleteEmbeddedDocuments("Item", items.filter((data, idx) => idx !== 0 ).reduce((acc, item) => { acc.push(item.id); return acc; }, []));
      }
      return items[0];
    }
  }

  applyActorEffects() {
    this.effects.forEach(efc => {
      efc.apply(this);
    });
  }

  applyItemEffects(data = { actor: this }) {
    this.itemEffectsByType = {}

    // Add global Effect, if exist
    if(game.merp1e.Merp1eRules.globalEffect) {
      for(let effect of game.merp1e.Merp1eRules.globalEffect.effects) {
        let effectName = effect.getFlag("merp1e", "effectName");
        if(!(effectName in this.itemEffectsByType)) {
          this.itemEffectsByType[effectName] = [];
        }
        this.itemEffectsByType[effectName].push(effect);
      }
    }

    // Add all actor's items
    for(let item of this.items) {
      for(let effect of item.effects) {
        let effectName = effect.getFlag("merp1e", "effectName");
        if(!(effectName in this.itemEffectsByType)) {
          this.itemEffectsByType[effectName] = [];
        }
        this.itemEffectsByType[effectName].push(effect);
      }
    }

    // Apply each effect
    for(let effectClass of Merp1eItemEffect.registeredAdapters) {
      let effectName = effectClass.effectName;
      if(effectName in this.itemEffectsByType) {
        for(let effect of this.itemEffectsByType[effectName]) {
          effect.applyEffect(data);
        }
      }
    }
  }

  /************************** languages **************************/
  /*
   * Lookup a language that the actor knows by name. Can return an array with more than one item.
   */
  getLanguageByName(name) {
    // XX use this.languages
    return this.items.filter( (item) => item.type == "language" && item.name == name );
  }


  async _processItems() {
    this.languages = {};
    this.skills = {};
    this.spelllists = {};
    this.equipments = {};
    this.locations = [];
    this.xps = {};
    //this.damages = {};
    this.specials = {};
    
    for(let item of this.items) {
      switch(item.type) {
        case "language":
          this.languages[item.id] = item;
          break;
        case "race":
        case "profession":
          break;
        case "skill":
          item.itemBonuses = [];
          this.skills[item.id] = item;
          break;
        case "spelllist":
          this.spelllists[item.id] = item;
          break;
        case "xp":
          this.xps[item.id] = item;
          break;
        //case "damage":
        //  this.damages[item.id] = item;
        //  break;
        case "special":
          this.specials[item.id] = item;
          break;
        default:
          if(item.data?.data?.isContainer) {
            this.locations.push({id: item.id, name: item.name, item: item});
          }
          this.equipments[item.id] = item;
          break;
      }
    }
  }

  /**
   * Prepare Character type specific data. That includes:
   */
  async _characterInit() {
		if( this.data.type != 'character') return;

    const sheetData = this.data.data;

    // Initialize with defaults
    sheetData.xp = sheetData.xp || { effective: 0, awarded: 0 };
    sheetData.choosedRealm = sheetData.choosedRealm || null;
    sheetData.pp = sheetData.pp || { value: 0 };
    sheetData.hp = sheetData.hp || { value: 0 };
    sheetData.healthStatus = sheetData.healthStatus || { 
      hitsTaken: 0,
      hitsPerRound: 0,
      activityPenalty: 0,
      roundsDown: 0,
      roundsOut: 0,
      roundsUntilDeath: 0,
      roundsStunned: 0,
      roundsWeaponStuck: 0,
      unconsciousComa: 0,
      rightArm: "",
      leftArm: "",
      rightLeg: "",
      leftLeg: "",
      paralyzed: 0,
      hearingLoss: 0,
      eyeLoss: 0,
      roundsBlinded: 0
    };

    this.stats = new Merp1eStats(this);
    this.defense = new Merp1eDefense(this);
    this.xp = new Merp1eXP(this);
    this.health = new Merp1eHealth(this);
    this.spellcasting = new Merp1eSpellCasting(this);
    this.action = new Merp1eAction(this);
    this.injury = new Merp1eInjury(this);

    this.race = this._processUniqueItem("race", {name: null});
    this.profession = this._processUniqueItem("profession", {name: null});;

    await this._processItems();
    await this.applyItemEffects();
    await this.applyActorEffects();
  }

  /* --------------------------------------------------
   * Functions used in the game
   * -------------------------------------------------- */

  /*
   * Lookup skills in the actor.
   */
  getAvaliableSkills() {
    return this.items.filter( (item) => item.type == "skill" );
  }

  /**
   * 
   * @param {*} skillID - skillID or "MM" to get the maneuver skill for the armor being worn.
   * @returns the skill Item.
   */
  getSkillByID(skillID) {
    if(skillID == "MM") return this.getSkillMovement();
    return this.getOwnedItem(skillID);
  }

  /*
   * Lookup a skill in the actor by a reference name. Can return an array with more than one item.
   */
  getSkillByReference(reference) {
    //return this.items.filter( (item) => item.type == "skill" && item.data.data.reference == reference );
    return this.items.find( (item) => item.type == "skill" && item.data.data.reference == reference );
  }

  getSkillValue(reference) {
    //return this.getSkillByReference(reference)?.[0]?.total || 0;
    return this.getSkillByReference(reference)?.total || 0;
  }

  getSkillMovement() {
    //return this.getSkillByReference(this.defense.armor.skillReference)?.[0];
    return this.getSkillByReference(this.defense.armor.skillReference);
  }

  /*
   * Returns an array with all skills that the actor does not already has.
   */
  getDefaultSkills() {
    let avaliableSkills = game.merp1e.Merp1eRules.skill.getAvaliable();
    let newSkills = [];
    avaliableSkills.forEach(skill => {
      if(!this.getSkillByReference(skill.data?.data?.reference)) {
        let item = skill.toObject();
        item.data.ranks = 0;
        item.data.rankBonus = 0;
        item.data.rankSet = {};
        newSkills.push(item);
      }
    });
    return newSkills;
  }

  get level() {
    return game.merp1e.Merp1eRules.resolveLevel(this.effectiveXP);
  }

  get effectiveXP() {
    return this.data.data.xp.effective;
  }

  get characterWeight() {
    return this.data.data?.description?.weight;
  }

  _getWeightByLocation(location) {
    return Object.values(this.equipments).reduce((acc, eqp) => {
      if(eqp.data.data.location == "wearing" && eqp.data.data.isWeightlessWhenWeared) return acc;
      
      if(eqp.data.data.location == location) {
        return acc + eqp.weight;
      } else {
        return acc;
      }
    }, 0);
  }
  get carryingWeight() {
    return this._getWeightByLocation("carrying");
  }

  get wearingWeight() {
    return this._getWeightByLocation("wearing");
  }

  get totalWeight() {
    return this.carryingWeight + this.wearingWeight;
  }

  get encumbrance() {
    const weight = this.data.data.weightType == "total" ? this.totalWeight : this.wearingWeight;
    return Merp1eRules.resolveEncumbrance(this.characterWeight, weight);
  }

  get encumbrancePenalty() {
    const stBonus = this.stats.st.total;
    const enc = this.encumbrance;
    if(enc == "NA") return enc;
    return min(0, stBonus - enc);
  }

  get defensiveBonusSkill() {
    return this.getSkillByReference("DefensiveBonus");
  }

  async advanceRound() {
    this.injury.status.advanceRound();
  }

  async advanceHour() {
    console.error("NEXT HOUR!")
  }
  async advanceDay() {
    console.error("NEXT DAY!")
  }

}
