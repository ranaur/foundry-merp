import { Merp1eRollChatCard } from "./roll-chatcard.js";

export class Merp1eSpecialRollChatCard extends Merp1eRollChatCard {
    static dummy = this.registerCard(this);

    get title() {
        return "MERP1E.SpecialRoll.Title";
    }

    get rollTypeID() { return "SP"; }

    resolveResult(total) {
        return total > 100 ? "MERP1E.SpecialRoll.Success" : "MERP1E.SpecialRoll.Failure"
    }
    
    resolveText(total, data) {
        return total > 100 ? "MERP1E.SpecialRoll.Success" : "MERP1E.SpecialRoll.Failure";
    }
}
