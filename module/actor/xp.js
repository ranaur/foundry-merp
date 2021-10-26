export class Merp1eXP {
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
  
  