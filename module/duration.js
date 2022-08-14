export class Merp1eDuration {
    static NOT_YET_ACTIVE = -1;
    static ACTIVE = 1;
    static NOT_ACTIVE_ANYMORE = -2;

    static types = [
        { id: "indefinite", label: "MERP1E.Duration.Indefinite"},
        { id: "timeBased", label: "MERP1E.Duration.TimeBased"},
        { id: "combat", label: "MERP1E.Duration.Combat"},
    ];

    constructor( data ) {
        this.data = data || { combat: null, rounds: null, seconds: null, startRound: null, startTime: null, startTurn: null, turns: null };
    }

    get durationType() {
        let ret = "indefinite";
        if(this.rounds != null ) ret = "combat";
        if(this.turns != null) ret = "combat";
        if( Number.isNumeric(this.seconds) ) ret = "timeBased";

        return ret;
    }

    get combat() { return this.data.combat; }
    set combat(value) { this.data.combat = value; }
    
    get rounds() { return this.data.rounds; }
    set rounds(value) { this.data.rounds = value; }

    get seconds() { return this.data.seconds; }
    set seconds(value) { this.data.seconds = value; }

    get startRound() { return this.data.startRound; }
    set startRound(value) { this.data.startRound = value; }

    get startTime() { return this.data.startTime; }
    set startTime(value) { this.data.startTime = value; }

    get startTurn() { return this.data.startTurn; }
    set startTurn(value) { this.data.startTurn = value; }

    get turns() { return this.data.turns; }
    set turns(value) { this.data.turns = value; }

    startByTime( worldTime = game.time.worldTime ) {
        this.startTime = worldTime;
    }

    startByCombat( combat = game?.combat ) {
        if(combat) {
            this.combat = combat.id;
            this.startRound = combat.data.round;
            this.startTurn = combat.data.turn;
            this.startTime = null;
            return true;
        } else { 
            this.combat = null;
            this.startRound = null;
            this.startTurn = null;
            this.startTime = null;
            return false;
        }
    }

    start() {
         this.startByTime();
         this.startCombat();
    }
    
    state( worldTime = game.time.worldTime ) {
        switch(this.durationType) {
            case "indefinite":
                return Merp1eDuration.ACTIVE;
            case "combat":
                if(!this.combat) return Merp1eDuration.NOT_YET_ACTIVE;
                if(!this.startRound) return Merp1eDuration.NOT_YET_ACTIVE;
                const cbt = game.combats.find((c) => c.id == this.combat);
                if(!cbt) return Merp1eDuration.NOT_YET_ACTIVE;

                if(this.rounds && this.turns) {
                    const lastRound = this.startRound + this.rounds;
                    if(cbt.round < this.startRound) return Merp1eDuration.NOT_YET_ACTIVE;
                    if(cbt.round > lastRound) return Merp1eDuration.NOT_ACTIVE_ANYMORE;
                    const lastTurn = this.startTurn + this.turns;
                    if(cbt.round == lastRound) {
                        if(cbt.turn < this.startTurn) return Merp1eDuration.NOT_YET_ACTIVE;
                        if(cbt.turn > lastTurn) return Merp1eDuration.NOT_ACTIVE_ANYMORE;
                    }
                    
                    return Merp1eDuration.ACTIVE;
                }
                if(this.rounds && !this.turns) {
                    const lastRound = this.startRound + this.rounds;
                    if(cbt.round < this.startRound) return Merp1eDuration.NOT_YET_ACTIVE;
                    if(cbt.round > lastRound) return Merp1eDuration.NOT_ACTIVE_ANYMORE;
                    return Merp1eDuration.ACTIVE;
                }
                // if(!this.rounds && this.turns)
                const lastTurn = this.startTurn + this.turns;
                if(cbt.turn < this.startTurn) return Merp1eDuration.NOT_YET_ACTIVE;
                if(cbt.turn > lastTurn) return Merp1eDuration.NOT_ACTIVE_ANYMORE;
                return Merp1eDuration.ACTIVE;

            case "timeBased":
                if(!this.startTime) return Merp1eDuration.NOT_YET_ACTIVE;
                if(this.startTime > worldTime ) return Merp1eDuration.NOT_YET_ACTIVE;
                if(this.startTime + this.seconds <= worldTime ) return Merp1eDuration.NOT_ACTIVE_ANYMORE;
                return Merp1eDuration.ACTIVE;
    
        }
    }

    get isActive() {
        return this.state() == Merp1eDuration.ACTIVE;
    }
}