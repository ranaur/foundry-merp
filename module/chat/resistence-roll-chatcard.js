import { Merp1eRollChatCard } from "./roll-chatcard.js";

export class Merp1eResistenceRollChatCard extends Merp1eRollChatCard {
    static dummy = this.registerCard(this);
    
    constructor(data, options = {}, messageID = null) {
        data = mergeObject(data, {
        });
        super(data, options, messageID);
    }
    
    get title() {
        return "MERP1E.ResistenceRoll.Title";
    }

    get rollTypeID() { return "RR"; }

    resolveResult(firstDice, total, data) {
        data.data.attackLevel ??= 1;
        data.data.targetLevel ??= data.actor.level;

        data.rrBase = game.merp1e.Merp1eRules.resolveResistenceRoll(parseInt(data.data.attackLevel), parseInt(data.data.targetLevel));
        return total >= data.rrBase;
    }
    
    resolveText(firstDice, total, data) {
        return "NOT USED";
    }

    getData() {
        const cardData = super.getData();

        cardData.data.failureText ??= "MERP1E.ResistenceRollCard.Failure";
        cardData.data.successText ??= "MERP1E.ResistenceRollCard.Success";

        return cardData;
    }
}

