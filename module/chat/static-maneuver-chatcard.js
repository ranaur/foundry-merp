import { Merp1eModifiers } from "../modifier.js";
import { rollOpenEnded } from "../dice.js";
import { findByID } from "../util.js";
import { Merp1eBaseChatCard } from "./base-chatcard.js";

export class Merp1eStaticManeuverChatCard extends Merp1eBaseChatCard {
    static dummy = this.registerCard(this);

    get title() {
        return "Static Maneuver";
    }

    getData() {
        const cardData = super.getData();
        let actor;
        if(!cardData.skill) {
            if(!cardData.data.actorID) return cardData;
            if(!cardData.data.skillID) return cardData;
            actor = game.actors.get(cardData.data.actorID);
            if(!actor) return cardData;
            cardData.skill = actor.items.get(cardData.data.skillID);
        }
        if(!cardData.skill) return cardData;
        cardData.rollTypeID = "SM";
        actor.applyEffects(cardData); // without actor to not apply actor modifiers
		cardData.isGM = game.user.isGM;

        cardData.actor = cardData.skill.parent;

        cardData.data.chosenDifficulty = cardData.data.chosenDifficulty || "Medium";
        cardData.difficulties = game.merp1e.Merp1eRules.skill.difficulties;
		cardData.difficultiesValues = cardData.difficulties.reduce((acc, dif) => { acc[dif.id] = dif.value; return acc; }, {});

        // Calculate modifiers
        cardData.skillModifiers = new Merp1eModifiers("mmm", "MERP1E.ManeuverCard.SkillModifiers", cardData.skill.data?.data?.modifiers);
        if(cardData.skill?.data?.data?.reference) {
            let globalSkill = game.merp1e.Merp1eRules.skill.getAvaliableByReference(cardData.skill.data.data.reference);
            cardData.skillModifiers.add(globalSkill?.data?.data?.modifiers);
        }

        cardData.itemModifiers = new Merp1eModifiers("itm", "MERP1E.ManeuverCard.ItemModifiers", cardData?.modifiers);

        cardData.data.modifiersChecked = cardData.data.modifiersChecked || {};
        cardData.data.modifiersValue = cardData.data.modifiersValue || {};

        // Calculate total bonus and roll
        cardData.total = cardData.skill.total;
        cardData.total += findByID(cardData.difficulties, cardData.data.chosenDifficulty, {value:0}).value;
        [cardData.skillModifiers, cardData.itemModifiers].forEach((mg) => {
            mg.evaluate(cardData);
            const checked = mg.id in cardData.data.modifiersChecked ? cardData.data.modifiersChecked[mg.id] : null;
            const values = mg.id in cardData.data.modifiersValue ? cardData.data.modifiersValue[mg.id] : null;
            const groupTotal = mg.getTotal(checked, values);
            mg.total = groupTotal;
            cardData.total += groupTotal
        });
        cardData.skillTotal = cardData.skill.total + cardData.skillModifiers.total;
        cardData.total += (cardData.data.rollTotal || 0);
        cardData.resolveResult = game.merp1e.Merp1eRules.resolveStaticManeuverLabel(cardData.total);
        cardData.resolveText = game.merp1e.Merp1eRules.resolveStaticManeuverText(cardData.total, cardData.skill);
        return cardData;
    }

    async roll(event, update) {
        let oer = await rollOpenEnded();

		this.data.rollResult = oer.result;
		this.data.rollTotal = oer.total;

        this.updateMessage(event);
        //this.close(event);
    }

}
