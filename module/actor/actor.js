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

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;

    data.level = game.merp1e.Merp1eRules.resolveLevel(data.xp);

    // Initialize stats if they don't exist
    data.stats = data.stats || {};
    for( let stat of game.merp1e.Merp1eRules.stats) {
      data.stats[stat] = data.stats[stat] || { "value": 50, "bonuses": {}, "bonus": 0 };
      if("bonuses" in data.stats[stat]) {
        data.stats[stat].bonuses.stat = game.merp1e.Merp1eRules.resolveStatBonus(data.stats[stat].value);
        if("race" in data) {
          data.stats[stat].bonuses.race = data.race.data.statsBonuses[stat];
        } else {
          data.stats[stat].bonuses.race || 0;
        }
        // Sum all the bonuses
        data.stats[stat].total = Object.entries(data.stats[stat].bonuses).reduce((a, i) => { return a + (i[1] || 0); }, 0);
      }
    }

    // Fill skills
    data.skills = data.skills || {};
    for( let [key, defaultSkill] of Object.entries(game.merp1e.Merp1eRules.skill.list)) {
      data.skills[key] = data.skills[key] || defaultSkill;
      data.skills[key].bonuses = data.skills[key].bonuses || {};
      if("statBonus" in defaultSkill) {
        data.skills[key].statBonus = defaultSkill.statBonus;
        data.skills[key].bonuses.stat = data.stats[defaultSkill.statBonus].total;
      }
      data.skills[key].ranks = data.skills[key].ranks || 0; // XXX change to XXX to record each rank
      data.skills[key].bonuses.extra = defaultSkill.extra || 0;
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

    // Calculate skill bonuses
    for( let [key, skill] of Object.entries(data.skills)) {
      if(key != "BodyDevel") {
        skill.bonuses.rank = game.merp1e.Merp1eRules.resolveSkillRankBonus(skill.ranks);
      }
      // Calculate stat bonus
      if("statBonus" in skill) {
        skill.bonuses.stat = data.stats[skill.statBonus].total;
      }
      // Sum all the bonuses
      skill.total = Object.entries(skill.bonuses).reduce((a, i) => { return a + (i[1] || 0); }, 0);
    }

  }
}