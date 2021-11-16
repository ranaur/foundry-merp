import { Merp1eModifiers } from "../modifier.js";
import { rollOpenEnded } from "../dice.js";
import { Merp1eBaseChatCard } from "./base-chatcard.js";
import { Merp1eItemEffect } from "../effect/item-effects.js";
import { Merp1eTable } from "../rules/rules.js";

export class Merp1eRollChatCard extends Merp1eBaseChatCard {
    // overload
    get title() {
        throw "Abstract Class: must implement method!";
    }

    get rollTypeID() { 
        throw "Abstract Class: must implement method!";
    }

    resolveResult(total, data) {
        throw "Abstract Class: must implement method!";
    }
    
    resolveText(total, data) {
        throw "Abstract Class: must implement method!";
    }
    //    

	_getDataActorSkill(cardData) {
        if(cardData.skill) return;

		if(!cardData.data.actorID) return;
		if(!cardData.data.skillID) return;

		let actor = game.actors.get(cardData.data.actorID);
		cardData.skill = actor?.items?.get(cardData.data.skillID);
		cardData.actor = cardData.skill.parent;
	}

	_getDataDifficulty(cardData) {
        if(!cardData.data.chosenDifficulty) return;
        cardData.difficulties = game.merp1e.Merp1eRules.skill.difficulties;
	}

	_getDataModifiers(cardData) {
            // get skill modifiers
		cardData.skillModifiers = new Merp1eModifiers("skl", "MERP1E.ManeuverCard.SkillModifiers", cardData.skill.modifiers);

        cardData.itemModifiers = new Merp1eModifiers("itm", "MERP1E.ManeuverCard.ItemModifiers", Merp1eItemEffect.getModifiers(cardData));

        cardData.tableModifiers = new Merp1eModifiers("tbl", "MERP1E.ManeuverCard.TableModifiers", cardData?.table?.modifiers);

        cardData.data.modifiersChecked = cardData.data.modifiersChecked || {};
        cardData.data.modifiersValue = cardData.data.modifiersValue || {};
	}
	
    _calculateSkillTotal(skill, difficultiesValues, skillModifiers, itemModifiers, contextData) {
        const skillTotal = skill.total;
        const difficultyTotal = difficultiesValues?.[contextData.data?.chosenDifficulty] || 0;
        const rollTotal = (contextData.data.rollTotal || 0);

        [skillModifiers, itemModifiers].forEach((mg) => {
            mg.evaluate(contextData);
            const checked = contextData?.data?.modifiersChecked?.[mg.id];
            const values = contextData?.data?.modifiersValue?.[mg.id];
            const groupTotal = mg.getTotal(checked, values);
            mg.total = groupTotal;
            skillTotal += groupTotal
        });
        
        return {
            skillTotal: skillTotal,
            difficultyTotal: difficultyTotal,
            rollTotal: rollTotal,
            skillModifiersTotal: skillModifiers.total,
            itemModifiersTotal: itemModifiers.total,
            grandTotal: skillTotal + difficultyTotal + rollTotal + skillModifiers.total + itemModifiers.total
        };
    }
    calculateTotal(contextData) {
        // Calculate total bonus and roll
        contextData.total = contextData?.skill.total;
        contextData.total += contextData.difficultiesValues?.[contextData.data.chosenDifficulty] || 0;
        [contextData.tableModifiers, contextData.skillModifiers, contextData.itemModifiers].forEach((mg) => {
            mg.evaluate(contextData);
            const checked = mg.id in contextData.data.modifiersChecked ? contextData.data.modifiersChecked[mg.id] : null;
            const values = mg.id in contextData.data.modifiersValue ? contextData.data.modifiersValue[mg.id] : null;
            const groupTotal = mg.getTotal(checked, values);
            mg.total = groupTotal;
            contextData.total += groupTotal
        });
        contextData.skillTotal = contextData.skill.total + contextData.skillModifiers.total;
        contextData.total += (contextData.data.rollTotal || 0);
    }
    
    _getTableModifiers(cardData) {
        cardData.table = Merp1eTable.createTable(cardData?.data.tableReference)

        cardData.tableModifiers = new Merp1eModifiers("itm", "MERP1E.ManeuverCard.ItemModifiers", cardData?.table?.modifiers);
    }

    getData() {
        const cardData = super.getData();
        /** 
         * cardData main values:
         *  Input: 
         *    .data.actorID => Id of the actor doing the roll
	     *    .data.skillID => Id of the skill doing the roll
         *    .data.tableReference => table reference
         *    .data.chosenDifficulty => difficulty choosen by the player
         *    .data.modifiersChecked => list of checked modifiers
         *    .data.modifiersValue => list of ad-hoc values
		 *    .data.rollResult => text describing the roll
		 *    .data.rollTotal => sum of the dices (for open ended)
         *    .data.rollDices => array with the dices rolled
         *    .data.actionData => data specific for the action
         * 
         * Output:
         *    .skill => skill item (from skillID)
		 *    .actor => actor item (from actorID)
         *    .rollTypeID => derived the type of the card(maneuver) asked 
         *    .difficulties => list of difficulties to fill the dropdown
         *    .skillModifiers => modifiers from skills (character and global)
         *         .total
         *    .itemModifiers => modifiers from active itens
         *         .total
         *    .table => table (mock or not)
         *    .tableModifiers => modifiers from the table
         *         .total
         *    .total => everything added up
         *    .resolveResult => short description of the result 
         *    .resolveText => long description of the result
         */

        this._getDataActorSkill(cardData);

        cardData.rollTypeID = this.rollTypeID;

        this._getDataDifficulty(cardData);

        this._getDataModifiers(cardData);

        this._getTableModifiers(cardData);

        this.calculateTotal(cardData);

        if(cardData.data.rollResult) {
            cardData.resolveResult = this.resolveResult(cardData.data.rollDices[0], cardData.total, cardData);
            cardData.resolveText = this.resolveText(cardData.data.rollDices[0], cardData.total, cardData);
        }
        return cardData;
    }

    async roll(event, update) {
        let oer = await rollOpenEnded();

		this.data.rollResult = oer.result;
		this.data.rollTotal = oer.total;
        this.data.rollDices = oer.dices;

        this.updateMessage(event);
        //this.close(event);
    }
}
