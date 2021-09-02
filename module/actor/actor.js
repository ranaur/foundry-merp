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

  async _processItems() {
    this.race = {name: null};
    this.profession = {name: null};
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
          if(this.race.name != null) {
            console.log("actor has more than one race! Deleting second item.");
            this.deleteEmbeddedDocument("Item", [item.id]);
          } else {
            this.race = item;
          }
          break;
        case "profession":
          if(this.profession.name != null) {
            console.log("actor has more than one profession! Deleting second item.");
            this.deleteEmbeddedDocument("Item", [item.id]);
          } else {
            this.profession = item;
          }
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
    for(let effect of this.effects) {
      effect.apply(this);
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

    // ************* STATS
    this.stats = {};
    for( let stat of game.merp1e.Merp1eRules.stats) {
      this.stats[stat.abbr] = { 
        "abbr": stat.abbr,
        "value": sheetData.stats[stat.abbr].value, 
        "only_value": stat.only_value || false,
        "bonuses": {
          "special": sheetData.stats[stat.abbr].special || 0,
        }, 
        get total() {
          return Object.entries(this.bonuses).reduce((a, i) => { return a + (i[1] || 0); }, 0);
        }
      };
      this.stats[stat.abbr].bonuses.stat = game.merp1e.Merp1eRules.resolveStatBonus(sheetData.stats[stat.abbr].value);
      this.stats[stat.abbr].bonuses.race = this._getRaceStatBonus(stat.abbr);
      /// XXX put itens Stat Bonus
    }

    await this._processItems();

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
   * Lookup a skill in the actor by a reference name. Can return an array with more than one item.
   */
  getSkillsByReference(reference) {
    return this.items.filter( (item) => item.type == "skill" && item.data.data.reference == reference );
  }

  getSkillValue(reference) {
    return this.getSkillsByReference(reference)[0].total;
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
    let avaliableSkills = game.merp1e.Merp1eRules.getAvaliableSkills();
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

  /** @override */
  _getRaceStatBonus(stat) {
    if(this.race == null || this.race.data == null ) return null;
    return this.race.getStatBonus(stat);
  }

  /** @override */
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

  get realm() {
    let professionRealm = this.profession?.data?.data?.realm || null;
    if( professionRealm == null) return null;

    if( professionRealm == "any") return this.data.data.realm; // chosen realm

    return professionRealm;
  }

  get powerPointsPerLevel() {
    if(this.realm == null) return 0;
    let realmStat = game.merp1e.Merp1eRules.spell.realmStat[this.realm];
    return game.merp1e.Merp1eRules.resolvePowerPointsPerLevel(this.stats[realmStat].value);
  }  
  get powerPointsMultiplier() {
    return 1; // XXX Read from Items with Power Point proprety
  }
  get powerPointsMaximum() {
    return this.powerPointsPerLevel * this.level * this.powerPointsMultiplier;
  }
  get powerPointsCurrent() {
    return this.data.data.pp.value || 0;
  }

  health = {
    actor: this,
    get maximumHPDie() {
      return this.maximumHPOut + this.actor.stats.co.value;
    },

    get maximumHPOut() {
      return this.actor.getSkillValue(game.merp1e.Merp1eRules.skill.BODY_DEVELOPMENT);
    },

    get hitsTaken() {
      return this.actor.health.status.hitsTaken;
    },

    get hitsLeft() {
      return this.maximumHPOut - this.hitsTaken;
    },

    get status() {
      return this.actor.data.data.healthStatus;
    },

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
    },

    max(a, b) {
      return a > b ? a : b;
    },
    
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
        this.status.roundsWeaponStuck = this.max(this.status.roundsWeaponStuck, currentDamageData.roundsWeaponStuck);
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

        this.status.paralyzed = this.max(this.status.paralyzed, currentDamageData.paralyzed);
        this.status.hearingLoss = this.status.hearingLoss | currentDamageData.hearingLoss;
        this.status.eyeLoss = this.status.eyeLoss | currentDamageData.eyeLoss;
      }
    },
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
    },
    die(){
      this.status.dead = true;
      // XXX record in which round the character died?
    },
    get isDead() {
      return this.status.dead == true || this.status.hitsTaken > this.status.maximumHP + this.actor.stats.co.value;
    },
    get isUnconscious() {
      return this.status.hourUnconscious > 0 || (this.status.hitsTaken > this.status.maximumHP && this.status.hitsTaken <= this.status.maximumHP + this.actor.stats.co.value);
    },
    get isOut() {
      return this.status.roundsOut > 0;
    },
    get isDown() {
      return (! this.isOut) && this.status.roundsStunned > 0;
    },
    get isStunned() {
      return (! this.isDown) && this.status.roundsStunned > 0;
    },
    get isParalyzed() {
      return this.status.paralyzed != "0";
    },
    get isDeaf() {
      return this.status.earLoss != "3";
    },
    get isBlind() {
      return this.status.roundsBlinded > 0 && this.status.eyeLoss != "3";
    },
  }

  xp = {
    actor: this,
    get effective() {
      return this.actor.data.data.xp.effective || 0;
    },
    get awarded() {
      if( game.merp1e.Merp1eRules.settings.xpControlManual ) { 
        return this.actor.data.data.xp.awarded || 0;
      }

      return Object.values(this.actor.xps).reduce( (acc, xp) => { return acc + xp.data.data.value; }, 0 );
    },
    get nextLevel() {
      return game.merp1e.Merp1eRules.resolveExperiencePointsRequired(this.actor.level + 1);
    },
    get toNextLevel() {
      return this.nextLevel - (this.effective + this.awarded);
    },
    get awardedList() {
      return Object.keys(this.actor.xps);
    },
  }


}