import { max, findByID } from "../util.js";

class Merp1eInjuryHits {
    constructor(actor) { 
      this.actor = actor; 
    }
  
    get maximumToDie() {
      return this.maximumToPassOut + this.actor.stats.co.value;
    }
  
    get maximumToPassOut() {
      return this.actor.getSkillValue(game.merp1e.Merp1eRules.skill.BODY_DEVELOPMENT);
    }
  
    get left() {
      return this.maximumToPassOut - this.taken;
    }
  
    get taken() {
      return this.injuries.reduce((acc, efc) => acc + efc?.hitsValue || 0, 0);
    }

    get injuries() {
      return this.actor?.effects.filter((efc) => (efc.effectName == "Hits" || efc.effectName == "Heal") );
    }

    async _checkDeath() {
      if(this.taken > this.maximumToDie) return await this.actor.health.die();
      if(this.taken > this.maximumToPassOut) return await this.actor.health.passOut();
      return;
    }
}
  
class Merp1eInjuryHitsPerRound {
    constructor(actor) { this.actor = actor; }
  
    get injuries() {
      return this.actor?.effects.filter((efc) => efc.effectName == "HitsPerRound" );
    }
  
    get current() {
      return this.injuries.reduce((acc, hpr) => acc += (hpr.effectAdapter.currentValue || 0), 0);
    }
  
    get effective() {
      return this.injuries.reduce((acc, hpr) => acc += (hpr.effectAdapter.effectiveValue || 0), 0);
    }
  
    get taken() {
      return this.injuries.reduce((acc, efc) => acc + efc?.hitsValue || 0, 0);
    }

    get bleed() {
      this.actor.injury.hits.add(this.total);
    }
}
  
class Merp1eInjuryPenalty {
  constructor(actor) { this.actor = actor; }

  get injuries() {
    return this.actor?.effects.filter((efc) => efc.effectName == "Penalty" );
  }

  get total() {
    return this.injuries.reduce((acc, hpr) => acc += (hpr.effectAdapter.currentValue || 0), 0);
  }
}

class Merp1eInjurySpecificStatus {
  constructor(actor, status) { 
    this.actor = actor;
    this.status = status;
  }

  get injuries() {
    return this.actor?.effects.filter((efc) => efc.effectName == this.status );
  }

  get total() {
    return this.injuries.reduce((acc, hpr) => acc += (hpr.effectAdapter.duration || 0), 0);
  }
}

class Merp1eInjuryStatus {
  constructor(actor) {
    this.actor = actor;
    game.merp1e.Merp1eRules.injury.statuses.forEach((status) => {
      this[status.id] = new Merp1eInjurySpecificStatus(actor, status.effectName);
    });
  }

  get current() {
    for (const status of game.merp1e.Merp1eRules.injury.statuses) {
      if(this[status.id].total > 0) return status.id;
    }
    return null;
  }

  get currentLabel() {
    return findByID(game.merp1e.Merp1eRules.injury.statuses, this.current, null)?.label;
  }

  async advanceRound() {
    for (const status of game.merp1e.Merp1eRules.injury.statuses) {
      if(this[status.id].total > 0) {
        for (const injury of this[status.id].injuries) {
          if(injury.effectAdapter.currentValue > 0) {
            await injury.effectAdapter.setCurrentValue(injury.effectAdapter.currentValue - 1);
            return;
          }
        }
      }
    }
    return;
  }
}

class Merp1eInjurySpecificLocation {
  constructor(actor, bodyGroup) {
    this.actor = actor;
    this.bodyGroup = bodyGroup
    this.bodyGroupObject = findByID(game.merp1e.Merp1eRules.injury.bodyGroupsBilateral, bodyGroup, null);
  }

  get injuries() {
    return this.actor?.effects.filter((efc) => efc.effectName == "ByLocation" && efc.effectAdapter.bodyGroupBilateral == this.bodyGroup );
  }

  get total() {
    return this.injuries.reduce((acc, hpr) => acc += (hpr.effectAdapter.duration || 0), 0);
  }

  get worstStatus() {
    const possibleValues = duplicate(this.bodyGroupObject.statuses);
    possibleValues.unshift("ok");
    let worstStatusIdx = this.injuries.reduce(
      (acc, efc) => {
        const idx = possibleValues.findIndex(s => s == efc.effectAdapter.currentValue);
        return max(acc, idx);
      }, 0 // possibleValues.findIdx(s => s == "ok") 
    );
    return possibleValues[worstStatusIdx];
  }
}

class Merp1eInjuryByLocation {
  constructor(actor) {
    this.actor = actor;
    game.merp1e.Merp1eRules.injury.bodyGroupsBilateral.forEach((bg) => {
      this[bg.id] = new Merp1eInjurySpecificLocation(actor, bg.id);
    });
  }

  get current() {
    for (const status of game.merp1e.Merp1eRules.injury.statuses) {
      if(this[status.id].total > 0) return status.id;
    }
    return null;
  }

  get currentLabel() {
    return findByID(game.merp1e.Merp1eRules.injury.statuses, this.current, null)?.label;
  }

  get statuses() {
    const status = [];
    if(this["eye-left"].worstStatus != "ok" && this["eye-right"].worstStatus != "ok") status.push('blind');
    if(this["ear-left"].worstStatus != "ok" && this["ear-right"].worstStatus != "ok") status.push('deaf');


    return status.reduce((acc, itm) => { acc.push({id: itm, label: "MERP1E.Status." + itm }); return acc; }, []);
  }

  get orphans() {
    return this.actor?.effects.filter((efc) => efc.effectName == "ByLocation" && (!efc.effectAdapter.bodyGroup || !efc.effectAdapter.side) );
  }

  async advanceRound() {
  }
}


export class Merp1eInjury {

  constructor(actor) {
      this.actor = actor;
      this.hits = new Merp1eInjuryHits(actor);
      this.hitsPerRound = new Merp1eInjuryHitsPerRound(actor);
      this.penalty = new Merp1eInjuryPenalty(actor);
      this.status = new Merp1eInjuryStatus(actor);
      this.bylocation = new Merp1eInjuryByLocation(actor);
  }

  get hitsTaken() {
    return this.hits.taken + this.hitsPerRound.taken;
  }
}

/*
      /**
       * Health data: actor.data.health ...
       *  
       *    hitsTaken: number
       *    hitsPerRound: [
       *        { type: damageType, value: number, treated: boolean, startTime: timestamp, origin: criticalId, originalText: text, severity: id(*calculated*), place: text(*list*) }
       *      ]
       *    subtractionToActivity: [
       *      ]
       *    roundsStunned
       *    roundsDown
       *    roundsOut
       *    specificInjuries 
       *    dying
       *    dead
       * 
       *  Common data:
       *    timestamp: { worldtime: number, realtime: number, combat: { name: text, startRound: number, startTurn: number } }
       *    duration: { seconds: number, rounds: number, hours: number, days: number }
       *    type: [ "hitsperRound", "subtractionToActivity", 
       * 
       * /

export class Merp1eInjury {
    static IHT1StatDeteriorationTable = [
        [ 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
        [ 30, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2 ],
        [ 75, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
        [ 90, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
        [ 100, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5 ],
    ];

    duration = {
        indefinite => true/false
        startTime => worldtime/realTime
        endTime
        rounds
        turns
        days
        note
        - while with shield
    }


    
    ImmediateDeath
    ExcessiveHits = BD + CO Stat
    DeathAfterANumberOfRounds
}
*/