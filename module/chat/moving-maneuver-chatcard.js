import { Merp1eModifiers } from "../modifier.js";
import { rollOpenEnded } from "../dice.js";
import { Merp1eCards, Merp1eBaseChatCard } from "./base-chatcard.js";

export class Merp1eMovingManeuverChatCard extends Merp1eBaseChatCard {
    static dummy = Merp1eCards.push(this);

    get title() {
        return "Moving Maneuver";
    }

    getData() {
        const data = super.getData();
        let actor;
        if(!data.skill) {
            if(!data.data.actorID) return data;
            if(!data.data.skillID) return data;
            actor = game.actors.get(data.data.actorID);
            if(!actor) return data;
            data.skill = actor.items.get(data.data.skillID);
        }
        if(!data.skill) return data;
        data.rollTypeID = "MM";
        actor.applyEffects(data); // without actor to not apply actor modifiers
		data.isGM = game.user.isGM;

        data.actor = data.skill.parent;

        data.data.chosenDifficulty = data.data.chosenDifficulty || "Medium";
        data.difficulties = game.merp1e.Merp1eRules.skill.difficulties;

        
        // Calculate modifiers
        data.modifiersByGroup = [];
        data.modifiersByGroup.push(new Merp1eModifiers("mmm", "Moving Maneuver Modifiers", game.merp1e.Merp1eRules.skill.modifiers.Movement));
        if(data.skill?.data?.data?.reference) {
            let globalSkill = game.merp1e.Merp1eRules.skill.getAvaliableByReference(data.skill.data.data.reference);
            data.modifiersByGroup.push(new Merp1eModifiers("sgm", "Skill General Modifiers", globalSkill?.data?.data?.modifiers));
        }
        data.modifiersByGroup.push(new Merp1eModifiers("mmm", "Skill Specific Modifiers", data.skill.data?.data?.modifiers));
        data.modifiersByGroup.push(new Merp1eModifiers("itm", "Item Modifiers", data?.modifiers));
        data.data.modifiersChecked = data.data.modifiersChecked || {};
        data.data.modifiersValue = data.data.modifiersValue || {};

        // Calculate total bonus and roll
        data.total = data.skill.total;
        data.modifiersByGroup.forEach((mg) => {
            mg.evaluate(data);
            const checked = mg.id in data.data.modifiersChecked ? data.data.modifiersChecked[mg.id] : null;
            const values = mg.id in data.data.modifiersValue ? data.data.modifiersValue[mg.id] : null;
            data.total += mg.getTotal(checked, values);
        });
        data.total += (data.data.rollTotal || 0);

        data.data.resolveResult = game.merp1e.Merp1eRules.resolveMovingManeuver(data.total, data.data.chosenDifficulty);

        if(data.data.resolveResult && data.data.calcValue) {
            data.calcResult = data.data.calcValue * data.data.resolveResult / 100;
        } else {
            data.calcResult = "";
        }
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.calc-number').prop('disabled', false);
    }

    async roll(event, update) {
        let oer = await rollOpenEnded();

		this.data.rollResult = oer.result;
		this.data.rollTotal = oer.total;
        
        this.updateMessage(event);
        //this.close(event);
    }

}