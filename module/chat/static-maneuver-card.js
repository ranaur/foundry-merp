import { Merp1eModifiers } from "../modifier.js";
import { rollOpenEnded } from "../dice.js";
import { findByID } from "../util.js";
import { Merp1eCards, Merp1eBaseChatCard } from "./base-chat-card.js";

export class Merp1eStaticManeuverChatCard extends Merp1eBaseChatCard {
    get title() {
        return "Static Maneuver";
    }

    getData() {
        const data = super.getData();
        const actor = game.actors.get(data.data.actorID);
        if(!actor) return data;

        data.actor = actor;
        const skill = actor.items.get(data.data.skillID);

        if(!skill) return data;
        data.skill = skill;
        data.data.chosenDifficulty = data.data.chosenDifficulty || "Medium";
        data.difficulties = game.merp1e.Merp1eRules.skill.difficulties;
		data.difficultiesValues = data.difficulties.reduce((acc, dif) => { acc[dif.id] = dif.value; return acc; }, {});

        // Calculate modifications
        data.modifications = [];
        data.modifications.push(new Merp1eModifiers("mmm", "Movement Modifiers", game.merp1e.Merp1eRules.skill.modifiers.Movement));
        if(skill?.data?.data?.reference) {
            let globalSkill = game.merp1e.Merp1eRules.skill.getAvaliableByReference(skill.data.data.reference);
            data.modifications.push(new Merp1eModifiers("sgm", "Skill General Modifiers", globalSkill?.data?.data?.modifiers));
        }
        data.modifications.push(new Merp1eModifiers("mmm", "Skill Specific Modifiers", skill.data?.data?.modifiers));
        data.data.modifiersChecked = data.data.modifiersChecked || {};
        data.data.modifiersValue = data.data.modifiersValue || {};

        // Calculate total bonus and roll
        data.total = skill.total;
        data.total += findByID(data.difficulties, data.data.chosenDifficulty, {value:0}).value;
        data.modifications.forEach((mg) => {
            mg.evaluate(data);
            const checked = mg.id in data.data.modifiersChecked ? data.data.modifiersChecked[mg.id] : null;
            const values = mg.id in data.data.modifiersValue ? data.data.modifiersValue[mg.id] : null;
            data.total += mg.getTotal(checked, values);
        });
        data.total += (data.data.rollTotal || 0);
        return data;
    }

    static create(actorID, skillID, conditions = [], options = {}) {
        return new Merp1eStaticManeuverChatCard(
            {
                actorID: actorID,
                skillID: skillID,
                conditions: conditions
            },
            options);
    }

    async roll(event, update) {
		// Old implementation
		//let r = new Merp1eRollOpenEnded();
        //r.roll();
        //r.toMessage();
        //this.data.rollResult = r.result;
        //this.data.rollTotal = r.total;

        let oer = await rollOpenEnded();

		this.data.rollResult = oer.result;
		this.data.rollTotal = oer.total;
	
        this.close(event);
    }

}
Merp1eCards.push(Merp1eStaticManeuverChatCard);
