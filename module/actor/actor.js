/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class Merp1eActor extends Actor {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();
		this.characterInit();
  }

  async _preCreate(createData, options, user) {
    await super._preCreate(createData, options, user);

    if (createData.type === "character") {
      await this.data.update({ "items": this.getDefaultSkills() });
    }
  }

  getSkills() {
    return this.skills;
  }

  getSkillsByReference(reference) {
    return this.items.filter( (item) => item.type == "skill" && item.data.data.reference == reference );
  }

  getLanguageByName(name) {
    // XX use this.languages
    return this.items.filter( (item) => item.type == "language" && item.name == name );
  }

  getDefaultSkills() {
    // add all skills that does not exist already
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

  createEmbeddedDocuments(embeddedName, dataArray, options) {
    for(let data of dataArray) {
		  switch(data.type) {
		    case 'skill':
          // XXX Zero ranks
          data.data.ranks = 0;
          data.data.rankBonus = 0;
          data.data.rankSet = {};
      }
    }
    
    return super.createEmbeddedDocuments(embeddedName, dataArray, options);
  }

  _getRaceStatBonus(stat) {
    if(this.race == null || this.race.data == null ) return 0;
    return this.race.getStatBonus(stat);
  }
  _getProfessionSkillBonus(skillReference) {
    if(this.profession == null || this.profession.data == null ) return 0; 
    return this.profession.getProfessionSkillBonuses(skillReference);
  }

  get realm() {
    return this.profession?.data?.data?.realm || null;
  }

  async _processItems() {
    this.race = {name: null};
    this.profession = {name: null};
    this.languages = {};
    this.skills = {};
    for(let item of this.items) {
      switch(item.type) {
        case "language":
          this.languages[item.id] = item;
          break;
        case "race":
          if(this.race.name != null) {
            console.log("actor has more than one race! Deleting second item.");
            this.deleteEmbeddedDocument("Item", [item.id]);
          }
          this.race = item;
          break;
        case "profession":
          if(this.profession.name != null) {
            console.log("actor has more than one profession! Deleting second item.");
            this.deleteEmbeddedDocument("Item", [item.id]);
          }
          this.profession = item;
          break;
        case "skill":
          this.skills[item.id] = item;
          break;
          /// XXX put skills and other items?
      }
    }
  }
  /**
   * Prepare Character type specific data
   */
  async characterInit() {
		if( this.data.type != 'character') return;

    const actorData = this.data;
    const sheetData = actorData.data;

    actorData.level = game.merp1e.Merp1eRules.resolveLevel(sheetData.xp || 0);
    await this._processItems();

    // STATS
    actorData.stats = actorData.stats || {};
    sheetData.stats = sheetData.stats || game.merp1e.Merp1eRules.stat.list;
    for( let stat of Object.keys(sheetData.stats)) {
      actorData.stats[stat] = { 
        "abbr": stat,
        "value": sheetData.stats[stat].value || 50, 
        "bonuses": {
          "special": sheetData.stats[stat].special || 0,
          "race": this._getRaceStatBonus(stat)
        }, 
      };
      actorData.stats[stat].bonuses.stat = game.merp1e.Merp1eRules.resolveStatBonus(actorData.stats[stat].value);

      /// XXX put itens Stat Bonus

      // Sum all the bonuses
      actorData.stats[stat].total = Object.entries(actorData.stats[stat].bonuses).reduce((a, i) => { return a + (i[1] || 0); }, 0);
    }

    // sum up skill bonuses
    actorData.skills = actorData.skills || {};
    for( let skill of Object.values(this.skills) ) {
      skill.bonuses = {
          rank: game.merp1e.Merp1eRules.resolveSkillBonus(skill.data.data),
          extra: parseInt(skill.data.data.extraBonus) || 0,
          prof: this._getProfessionSkillBonus(skill.data.data.reference) * actorData.level,
          item: 0, /// XXX put itens Skill Bonus
          spec: parseInt(skill.data.data.specialBonus || 0)
      }

      // add stat bonus
      if(skill.data.data.statBonus in actorData.stats) {
        skill.bonuses.stat = actorData.stats[skill.data.data.statBonus].total;
      }

      // Sum all the bonuses
      skill.total = Object.entries(skill.bonuses).reduce((a, i) => { return a + (i[1] || 0); }, 0);
    }

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
}