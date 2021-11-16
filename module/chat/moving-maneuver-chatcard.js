import { Merp1eRollChatCard } from "./roll-chatcard.js";

export class Merp1eMovingManeuverChatCard extends Merp1eRollChatCard {
    static dummy = this.registerCard(this);

	constructor(data, options = {}, messageID = null) {
        data = mergeObject(data, {
            chosenDifficulty: "Medium"
        });
        super(data, options, messageID);
    }

    get title() {
        return "MERP1E.MovingManeuver.Title";
    }

    get rollTypeID() { return "MM"; }

    resolveResult(firstDice, total, data) {
        return game.merp1e.Merp1eRules.resolveMovingManeuver(firstDice, total, data.data.chosenDifficulty);
    }
    
    resolveText(firstDice, total, data) {
        return "NOT USED";
    }

    getData() {
        const cardData = super.getData();

        // Resolve calculation box
        if(cardData.resolveResult && cardData.data.calcValue) {
            cardData.calcResult = cardData.data.calcValue * cardData.resolveResult / 100;
        } else {
            cardData.calcResult = "";
        }
        return cardData;
    }

    activateListeners(html) {
        super.activateListeners(html);
        
        // re-enable calculation box
        html.find('.calc-number').prop('disabled', false);
    }
}