import { Merp1eBaseChatCard } from "./base-chatcard.js";
import { TableIHT1 } from "../rules/tables/iht-1.js";
import { Merp1eTimeframe } from "../timeframe.js";
import { findByID } from "../util.js";

export class Merp1eDecayChatCard extends Merp1eBaseChatCard {
    static dummy = this.registerCard(this);

    /**
     * data: timeFrame, frames, actorID
     */
	constructor(data, options = {}, messageID = null) {
        data = mergeObject(data, {
        });
        game.merp1e.Merp1eRules.stats.forEach((stat) => data[stat.id] = { 
            abbr: stat.abbr,
            roll: null,
            reduction: null,
        });
        super(data, options, messageID);
    }

    get title() {
        return "MERP1E.DecayCard.Title";
    }

    _calculateStatReduction(roll, column) {
        if(!roll) return null;
        return TableIHT1.lookup(roll, column);
    }

    getData() {
        const cardData = super.getData();
        const timeframeLabel = findByID(Merp1eTimeframe.timeframes, this.data.timeFrame, "");
        cardData.columnText = this.data.frame + " " + game.i18n.localize(timeframeLabel) + " " + game.i18n.localize("MERP1E.DecayCard.AfterDeath");

        return cardData;
    }

    async roll(event) {
        event.preventDefault();
        const a = event.currentTarget;
        const stat = a.dataset.stat;

        await this._roll(stat);
        this.updateMessage();
    }

    async rollAll(event) {
        game.merp1e.Merp1eRules.stats.forEach((stat) => this._roll(stat.id));
        this.updateMessage();
    }

    async _roll(stat) {
        console.error("roll " + stat);
        let r = await new Roll("1D100");
        await r.roll();

		this.data[stat].roll = await r.result;
        this.data[stat].reduction = _calculateStatReduction(this.data[stat].roll, this.frames);
    }
}