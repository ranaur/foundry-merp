export class Merp1eTimeStamp {
    static generateGameTimeStamp() {
        let combat;
        
        if(game?.combat?.data) {
            combat = {
            combatId: game.combat.data.combat,
            sceneId: game.combat.data.scene,
            round: game.combat.data.round,
            turn: game.combat.data.turn
                // XXX Combat Name?
            };
        } else { combat = null; }

        return {
          worldTime: game.time.worldTime,
          realTime: game.time.serverTime,
          combat: combat
        };
    }

    constructor(data = null) {
        if(!data) data = Merp1eTimeStamp.generateGameTimeStamp();
        Object.assign(this, data);
    }

    static Seconds2DateTime(sec) {
        const res = {};
        let reminder = sec;
        res.days = Math.trunc(reminder/86400);
        reminder = reminder % 86400;
        res.hours = Math.trunc(reminder/24);
        reminder = reminder % 24;
        res.minutes = Math.trunc(reminder/60);
        reminder = reminder % 60;
        res.seconds = Math.trunc(reminder/60);
        reminder = reminder % 60;

        return res;
    }
    makeString(option = "worldtime") {

        switch(option) {
            case "worldtime":
                const wt = Merp1eTimeStamp.Seconds2DateTime(this.worldTime); // Add starting day
                return `at ${wt.hours} hours ${wt.minutes}, minutes and ${wt.seconds} of day ${wt.days} of adventure`;
            case "realtime":
                return serverTime.toLocaleString();
            case "combat":
                const c = this.combat;
                return `on combat ${c.combatId} scene ${c.sceneId} round ${c.round} turn ${cc.turn}`; // XXX make it way better
        }
    }
    toString() {
        return this.makeString();
    }
}

