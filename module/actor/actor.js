import { findByID, max } from "../util.js";
import { Merp1eActiveEffect } from "../active-effect.js";

class Merp1eDefense {
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
    return this.actor.getSkillValue(game.merp1e.Merp1eRules.skill.DEFENSIVE_BONUS) || 0;
  }

  get bonus() { 
    return this.skill + (this.shield?.bonus || 0) + (this.armGreaves?.bonus || 0) + (this.legGreaves?.bonus || 0) + (this.helm?.bonus || 0) + (this.armor?.bonus || 0);
  }
}

class Merp1eXP {
  constructor(actor) {
    this.actor = actor;
  }

  get effective() {
    return this.actor.data.data.xp.effective || 0;
  }
  get awarded() {
    if( game.merp1e.Merp1eRules.settings.xpControlManual ) { 
      return this.actor.data.data.xp.awarded || 0;
    }

    return Object.values(this.actor.xps).reduce( (acc, xp) => { return acc + xp.data.data.value; }, 0 );
  }
  get nextLevel() {
    return game.merp1e.Merp1eRules.resolveExperiencePointsRequired(this.actor.level + 1);
  }
  get toNextLevel() {
    return this.nextLevel - (this.effective + this.awarded);
  }
  get awardedList() {
    return Object.keys(this.actor.xps);
  }
}

class Merp1eHealth {
  constructor(actor) {
    this.actor = actor;
  }

  get maximumHPDie() {
    return this.maximumHPOut + this.actor.stats.co.value;
  }

  get maximumHPOut() {
    return this.actor.getSkillValue(game.merp1e.Merp1eRules.skill.BODY_DEVELOPMENT);
  }

  get hitsTaken() {
    return this.actor.health.status.hitsTaken;
  }

  get hitsLeft() {
    return this.maximumHPOut - this.hitsTaken;
  }

  get status() {
    return this.actor.data.data.healthStatus;
  }

  heal(hits) {
    if(hits < 0) return;

    if( game.merp1e.Merp1eRules.settings.damageControlManual ) {
      this.actor.health.status.hitsTaken -= hits;
      this.update();
    } else { //game.merp1e.Merp1eRules.settings.damageControlAutomatic()
      let hitsToHeal = hits;
      let damagesToUpdate = [];
      for(let damage in this.damages) {
        let damage = this.actor.damages[damageId];
        let currentDamageData = damage.data.data.current;
        if(currentDamageData.additionalHits > 0) {
          if(currentDamageData.additionalHits >= hitsToHeal) {
              // the damage will abosrb all hits to heal
            currentDamageData.additionalHits -= hitsToHeal;
            hitsToHeal = 0;
            damagesToUpdate.push(damage.id);
            break;
          } else { // currentDamageData.additionalHits < hits
              // the healing will zero this damage, and there will be more to heal
            hitsToHeal -= currentDamageData.additionalHits;
            currentDamageData.additionalHits = 0;
            damagesToUpdate.push({ _id: damage.id, data: damage.data } );
          }
        }
      }
      this.updateEmbeddedDocuments("Item", damagesToUpdate);
    }
  }

  consolidateDamage() {
    if( game.merp1e.Merp1eRules.settings.damageControlManual ) return;

    this.status.hitsTaken = 0;
    this.status.hitsPerRound = 0;
    this.status.activityPenalty = 0;
    this.status.roundsDown = 0;
    this.status.roundsOut = 0;
    this.status.roundsUntilDeath = -1;
    this.status.roundsStunned = 0;
    this.status.roundsBlinded = 0;
    this.status.unconsciousComa = 0;
    this.status.rightArm = 0;
    this.status.leftArm = 0;
    this.status.rightLeg = 0;
    this.status.leftLeg = 0;
    this.status.paralyzed = 0;
    this.status.hearingLoss = 0;
    this.status.eyeLoss = 0;

    for(let damageId in this.actor.damages) {
      let damage = this.actor.damages[damageId];
      damage.apply();
      let currentDamageData = damage.data.data.current;

      this.status.hitsTaken += currentDamageData.additionalHits || 0;
      this.status.hitsPerRound += currentDamageData.hitsPerRound || 0;
      if(currentDamageData.roundsActivityPenalty != 0) {
        this.status.activityPenalty += currentDamageData.activityPenalty;
      }
      this.status.roundsStunned += currentDamageData.roundsStunned || 0;
      this.status.roundsDown += currentDamageData.roundsDown || 0;
      this.status.roundsOut += currentDamageData.roundsOut || 0;
      this.status.roundsBlinded += currentDamageData.roundsBlinded || 0;
      this.status.unconsciousComa += currentDamageData.unconsciousComa || 0;
      this.status.roundsWeaponStuck = max(this.status.roundsWeaponStuck, currentDamageData.roundsWeaponStuck);
      if(currentDamageData.roundsUntilDeath > 0) {
        if(this.status.roundsUntilDeath == -1) { 
          this.status.roundsUntilDeath = currentDamageData.roundsUntilDeath;
        } else {
          this.status.roundsUntilDeath = this.status.roundsUntilDeath > currentDamageData.roundsUntilDeath ? currentDamageData.roundsUntilDeath : this.status.roundsUntilDeath;
        }
      }
      this.status.rightArm = this.status.rightArm | currentDamageData.rightArm; // 01 right, 10 left, 11 both
      this.status.leftArm = this.status.leftArm | currentDamageData.leftArm; 
      this.status.rightLeg = this.status.rightLeg | currentDamageData.rightLeg;
      this.status.leftLeg = this.status.leftLeg | currentDamageData.leftLeg;

      this.status.paralyzed = max(this.status.paralyzed, currentDamageData.paralyzed);
      this.status.hearingLoss = this.status.hearingLoss | currentDamageData.hearingLoss;
      this.status.eyeLoss = this.status.eyeLoss | currentDamageData.eyeLoss;
    }
  }
  nextRound() {
    if( game.merp1e.Merp1eRules.settings.damageControlManual ) return;

    this.consolidateDamage();
    let adjustedStunDownOut = false;
    let idsToUpdate = [];

    for(let damageId in this.actor.damages) {
      let damage = this.actor.damages[damageId];
      let currentDamageData = damage.data.data.current;
      if(currentDamageData.hitsPerRound > 0) {
        currentDamageData.additionalHits += currentDamageData.hitsPerRound;
      }
      if(currentDamageData.activityPenaltyTemporary) {
        if(currentDamageData.roundsActivityPenalty > 0) {
          currentDamageData.roundsActivityPenalty--;
        }
      }
      if(currentDamageData.roundsUntilDeath > 0 ) {
        currentDamageData.roundsUntilDeath--;
        if( currentDamageData.roundsUntilDeath == 0 ) {
          this.die();
        }
      }
      if(currentDamageData.roundsBlinded > 0) currentDamageData.roundsBlinded--;

      if(!adjustedStunDownOut) {
        if(this.status.roundsOut > 0) {
          if(currentDamageData.roundsOut > 0) { currentDamageData.roundsOut--; adjustedStunDownOut = true; }
        } else if (this.status.roundsDown > 0 ){
          if(currentDamageData.roundsDown > 0) { currentDamageData.roundsDown--; adjustedStunDownOut = true; }
        } else if (this.status.roundsStunned > 0 ){
          if(currentDamageData.roundsStunned > 0) { currentDamageData.roundsStunned--; adjustedStunDownOut = true; }
        }
      }
      idsToUpdate.push({ _id: damageId, data: damage.data.data });
    }
    this.actor.updateEmbeddedDocuments("Item", idsToUpdate);
    this.consolidateDamage();
  }
  die(){
    this.status.dead = true;
    // XXX record in which round the character died?
  }
  get isDead() {
    return this.status.dead == true || this.status.hitsTaken > this.status.maximumHPDie;
  }
  get isUnconscious() {
    return !this.isDead && this.status.hourUnconscious > 0 && this.status.hitsTaken >= this.status.maximumHPOut;
  }
  get isOut() {
    return this.status.roundsOut > 0;
  }
  get isDown() {
    return (! this.isOut) && this.status.roundsDown > 0;
  }
  get isStunned() {
    return (! this.isDown) && this.status.roundsStunned > 0;
  }
  get isParalyzed() {
    return this.status.paralyzed != "0";
  }
  get isLimbOut() {
    return  this.status.rightArm != "0" ||
      this.status.leftArm != "0" ||
      this.status.rightLeg != "0" ||
      this.status.leftLeg != "0";
  }
  get isDeaf() {
    return this.status.earLoss != "3";
  }
  get isBlind() {
    return this.status.roundsBlinded > 0 && this.status.eyeLoss != "3";
  }
}

class Merp1eSpellCasting {
  constructor(actor) {
    this.actor = actor;
    this.actor.data.data.spellcasting = this.actor.data.data.spellcasting || {};
    if(game.merp1e.Merp1eRules.settings.spellcastingControlAutomatic) {
      this.actor.data.data.spellcasting.powerPointsMultiplier = 1;
      this.actor.data.data.spellcasting.spellAdderMaximum = 0;
    }
  }

  get realm() {
    let professionRealm = this.actor.profession?.data?.data?.realm || null;
    if( professionRealm == null) return null;

    if( professionRealm == "any") return this.actor.data.data.spellcasting.realm; // chosen realm

    return professionRealm;
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
    let realm = game.merp1e.Merp1eRules.magic.realms.find((r) => r.id == this.realm);
    let realmStat = realm?.stat;
    let realmStatValue = this.actor.stats[realmStat]?.value || 0;
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

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class Merp1eActor extends Actor {
  /* --------------------------------------------------
   * Class overrides
   * -------------------------------------------------- */

  /*
   *  Enhance the class preparing the data for use.
   */
  /** @override */
  prepareData() {
    super.prepareData();
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
    }
  }

  /*
   *  Set "defaults" for embedded item. Tipically, erases eventual values/statuses that could come from a copy.
   */
  /** @override */
  createEmbeddedDocuments(embeddedName, dataArray, options) {
    for(let data of dataArray) {
		  switch(data.type) {
		    case 'skill':
          data.data.ranks = 0;
          data.data.rankBonus = 0;
          data.data.rankSet = {};
          data.data.group = data.data.group || "Secondary";
//        case 'damage':
//          data.data.current = duplicate(data.data.initial || {});
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
  
        this.deleteEmbeddedDocument("Item", items.filter((data, idx) => idx !== 0 ) );
      }
      return items[0];
    }
  }

  _applyEffects_old() {
    let orderedEffects = this.effects.reduce((a, e) => { a.push(e); return a; }, []);
    orderedEffects.sort(function(first, second) {
      return first.priority - second.priority;
    });

    for(let effect of orderedEffects) {
      let origin = effect.data.origin.split(".");
      let actorID = origin[1];
      let itemID = origin[3] || null;
      let item = null;

      if(itemID) {
        item = this.getEmbeddedDocument("Item", itemID);
        if(item == undefined)
        {
          this.deleteEmbeddedDocuments("ActiveEffect", [effect.id]); // XXX Should be here?
        } else {
          effect.apply(this);
        }
      }
    }
  }
  
  _applyEffects() {
    this.itemEffectsByType = {}
    for(let item of this.items) {
      for(let effect of item.effects) {
        let effectType = effect.getFlag("merp1e", "effectType");
        if(!(effectType in this.itemEffectsByType)) {
          this.itemEffectsByType[effectType] = [];
        }
        this.itemEffectsByType[effectType].push(effect);
      }
    }

    for(let effectClass of Merp1eActiveEffect.effectTypes) {
      let effectType = effectClass.effectName;
      if(effectType in this.itemEffectsByType) {
        for(let effect of this.itemEffectsByType[effectType]) {
          effect.apply(this);
        }
      }
    }
  }
  
  async _processItems() {
    this.languages = {};
    this.skills = {};
    this.spelllists = {};
    this.equipments = {};
    this.xps = {};
    this.damages = {};
    for(let item of this.items) {
      switch(item.type) {
        case "language":
          this.languages[item.id] = item;
          break;
        case "race":
        case "profession":
          break;
        case "skill":
          item.bonuses = {
            actor: this,
            itemBonuses: [],
            skill: item,
            rank: game.merp1e.Merp1eRules.resolveSkillBonus(item.data.data),
            get prof() { return this.actor._getProfessionSkillBonus(this.skill.data.data.reference) * this.actor.level; },
            get item() { return this.itemBonuses.reduce((acc, itemBonus) => acc + itemBonus.value, 0); }, /// XXX put itens Skill Bonus
            stat: item.data.data.statBonus in this.stats ? this.stats[item.data.data.statBonus].total : null,
            extra: parseInt(item.data.data.extraBonus) || 0,
            spec: parseInt(item.data.data.specialBonus || 0),
          };
          if(! item.hasOwnProperty('total')) {
            Object.defineProperty(item, 'total', {
              get: function() { return Object.entries(this.bonuses).reduce((a, i) => { return a + (typeof(i[1]) == "number" ? i[1] : 0); }, 0); }
            });
          }
          this.skills[item.id] = item;
          break;
        case "spelllist":
          this.spelllists[item.id] = item;
          break;
        case "xp":
          this.xps[item.id] = item;
          break;
        case "damage":
          this.damages[item.id] = item;
          break;
        case "backgorundOption":
          this.spelllists[item.id] = item;
          break;
        default:
          this.equipments[item.id] = item;
          break;
      }
    }
  }

  /**
   * Prepare Character type specific data. That includes:
   *  this.stat[*stat*]
   */
  async _characterInit() {
		if( this.data.type != 'character') return;

    const sheetData = this.data.data;

    // Initialize with defaults
    sheetData.xp = sheetData.xp || { effective: 0, awarded: 0 };
    sheetData.choosedRealm = sheetData.choosedRealm || null;
    sheetData.stats = sheetData.stats || {
      st: { value: null, special: 0 },
      ag: { value: null, special: 0 },
      co: { value: null, special: 0 },
      ig: { value: null, special: 0 },
      it: { value: null, special: 0 },
      pr: { value: null, special: 0 },
      ap: { value: null, special: 0 }
    };
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

    this.defense = new Merp1eDefense(this);
    this.xp = new Merp1eXP(this);
    this.health = new Merp1eHealth(this);
    this.spellcasting = new Merp1eSpellCasting(this);

    this.race = this._processUniqueItem("race", {name: null});
    this.profession = this._processUniqueItem("profession", {name: null});;

    // ************* STATS
    this.stats = {};
    for( let stat of game.merp1e.Merp1eRules.stats) {
      this.stats[stat.id] = { 
        "id": stat.id,
        "value": sheetData.stats[stat.id].value, 
        "only_value": stat.only_value || false,
        "bonuses": {
          "special": sheetData.stats[stat.id].special || 0,
        }, 
        get total() {
          return Object.entries(this.bonuses).reduce((a, i) => { return a + (i[1] || 0); }, 0);
        }
      };
      this.stats[stat.id].bonuses.stat = game.merp1e.Merp1eRules.resolveStatBonus(sheetData.stats[stat.id].value);
      this.stats[stat.id].bonuses.race = this._getRaceStatBonus(stat.id);
      /// XXX put itens Stat Bonus
    }

    await this._processItems();
    this._applyEffects();
/*

    // Iterate through items, allocating to containers
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;

      switch(i.type) {
        case 'skill':
          break;
        case 'race':
          if(data.race === null) {
            data.race = i;
          } else {
            console.log("more than one race, deleting. This souldn't happen");
            this.deleteEmbeddedDocuments("Item", [i.id], {renderSheet: false});
          }
          break;
        case 'profession':
        case 'spelllist':
        case 'spell':
          console.log(i.type + ' not implementet yet')
      }
    }


    // Filter spelllist
    data.spelllists = this.items.filter(item => item.type == "spelllist");
    if( "profession" in data ) {
      if( "professionSkillBonuses" in data.profession.data ) {
        for(let [skill, skillBonus] of Object.entries(data.profession.data.professionSkillBonuses)) {
          data.skills[skill].bonuses.prof = skillBonus * data.level;
        }
      }
    }
*/
  }

  /* --------------------------------------------------
   * Functions used in the game
   * -------------------------------------------------- */

  /*
   * Lookup skills in the actor.
   */
  getSkills() {
    return this.items.filter( (item) => item.type == "skill" );
  }

  /*
   * Lookup a skill in the actor by a reference name. Can return an array with more than one item.
   */
  getSkillsByReference(reference) {
    return this.items.filter( (item) => item.type == "skill" && item.data.data.reference == reference );
  }

  getSkillValue(reference) {
    return this.getSkillsByReference(reference)[0].total || 0;
  }

  getSkillMovement() {
    return this.getSkillsByReference(this.defense.armor.skillReference)[0];
  }

  /*
   * Lookup a language that the actor knows by name. Can return an array with more than one item.
   */
  getLanguageByName(name) {
    // XX use this.languages
    return this.items.filter( (item) => item.type == "language" && item.name == name );
  }

  /*
   * Returns an array with all skills that the actor does not already has.
   */
  getDefaultSkills() {
    let avaliableSkills = game.merp1e.Merp1eRules.skill.getAvaliable();
    let newSkills = [];
    avaliableSkills.forEach(skill => {
      if(this.getSkillsByReference(skill.data.data.reference).length == 0) {
        let item = {
          name: skill.name,
          type: 'skill',
          data: skill.data.data
        };
        item.data.ranks = 0;
        item.data.rankBonus = 0;
        item.data.rankSet = {};
        newSkills.push(item);
      }
    });
    return newSkills;
  }

  _getRaceStatBonus(stat) {
    if(this.race == null || this.race.data == null ) return null;
    return this.race.getStatBonus(stat);
  }

  _getProfessionSkillBonus(skillReference) {
    if(this.profession == null || this.profession.data == null ) return null; 
    return this.profession.getProfessionSkillBonuses(skillReference);
  }

  get level() {
    return game.merp1e.Merp1eRules.resolveLevel(this.effectiveXP);
  }

  get effectiveXP() {
    return this.data.data.xp.effective;
  }
}
