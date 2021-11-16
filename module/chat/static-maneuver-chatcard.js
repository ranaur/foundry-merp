import { Merp1eRollChatCard } from "./roll-chatcard.js";

export class Merp1eStaticManeuverChatCard extends Merp1eRollChatCard {
    static dummy = this.registerCard(this);

	constructor(data, options = {}, messageID = null) {
        data = mergeObject(data, {
            chosenDifficulty: "Medium"
        });
        super(data, options, messageID);
    }

    get title() {
        return "MERP1E.StaticManeuver.Title";
    }

    get rollTypeID() { return "SM"; }

    resolveResult(firstDice, total, data) {
        return game.merp1e.Merp1eRules.resolveStaticManeuverLabel(total);
    }
    
    resolveText(firstDice, total, data) {
        return game.merp1e.Merp1eRules.resolveStaticManeuverText(total, data.skill);
    }

    calculateTotal(cardData) {
        cardData.difficultiesValues = cardData.difficulties.reduce((acc, dif) => { acc[dif.id] = dif.value; return acc; }, {});
        super.calculateTotal(cardData);
    }
}
