class Merp1eInjuryHits {
    constructor(actor) { this.actor = actor; }
  
    get maximumToDie() {
      return this.maximumHPOut + this.actor.stats.co.value;
    }
  
    get maximumToPassOut() {
      return this.actor.getSkillValue(game.merp1e.Merp1eRules.skill.BODY_DEVELOPMENT);
    }
  
    get left() {
      return this.maximumHPOut - this.hitsTaken;
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
  
    get total() {
      return this.injuries.reduce((acc, hpr) => acc += hpr.effectAdapter.value, 0);
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
      return this.injuries.reduce((acc, hpr) => acc = hpr.value, 0);
    }
}
  
export class Merp1eInjury {

  constructor(actor) {
      this.actor = actor;
      this.hits = new Merp1eInjuryHits(actor);
      this.hitsPerRound = new Merp1eInjuryHitsPerRound(actor);
      this.penalty = new Merp1eInjuryPenalty(actor);
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

    recover: {
        n days recovering
    }

    bodyGroup = [
        { id: "arm", label: "MERP1E.BodyGroup.arm", paired: true },
        { id: "leg", label: "MERP1E.BodyGroup.leg", paired: true },
        { id: "torso", label: "MERP1E.BodyGroup.torso", paired: false },
        { id: "eye", label: "MERP1E.BodyGroup.eye", paired: true },
        { id: "nose", label: "MERP1E.BodyGroup.nose", paired: false},
        { id: "ear", label: "MERP1E.BodyGroup.ear", paired: true },
        { id: "head", label: "MERP1E.BodyGroup.head", paired: true },
        { id: "organs", label: "MERP1E.BodyGroup.organs", paired: false },
    ]

    
    ImmediateDeath
    ExcessiveHits = BD + CO Stat
    DeathAfterANumberOfRounds
}
*/