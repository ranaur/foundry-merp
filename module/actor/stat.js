import { findByID } from "../util.js";

export class Merp1eStat {
    constructor(actor, statId, data) {
        let stStat = findByID(game.merp1e.Merp1eRules.stats, statId, null);
        Object.assign(this, stStat);
        this.actor = actor;
        this.id = statId;
        this.value = data?.value;
        this.special = data?.special;
        this.only_value = data?.only_value || false,
        this.itemBonuses = [];
        this.bonuses = {
            me: this,
            actor: actor,
            itemBonuses: this.itemBonuses,
            get race() { return this.actor.race?.getStatBonus?.(this.me.id); },
            get item() { return this.itemBonuses.reduce((acc, itemBonus) => acc + itemBonus.value, 0); },
            get stat() { return game.merp1e.Merp1eRules.resolveStatBonus(this.me.value); },
            get spec() { return parseInt(this.me.special) || 0 }
        };
    }

    get total() {
        return Object.entries(this.bonuses).reduce((a, i) => { return a + (typeof(i[1]) == "number" ? i[1] : 0); }, 0);
    }
  }
  
  export class Merp1eStats {
      static createStats(actor) {
        const stats = actor.data.data.stats;
        if(!stats) {
            return game.merp1e.Merp1eRules.stats.reduce((acc, stat) => { acc[statId] = new Merp1eStat(actor, statId, stat); return acc; }, {});
        } else {
            return Object.keys(stats).reduce((acc, statId) => { acc[statId] = new Merp1eStat(actor, statId, stats[statId]); return acc; }, {});
        }
      }
  }
  