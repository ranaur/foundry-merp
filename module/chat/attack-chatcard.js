import { findByID } from "../util.js";
import { Merp1eRollChatCard } from "./roll-chatcard.js";
import { Merp1eModifiers, Merp1eModifier } from "../modifier.js";
import { Merp1eItemEffect } from "../effect/item-effects.js";

export class Merp1eAttackChatCard extends Merp1eRollChatCard {
    static dummy = this.registerCard(this);

    get title() {
        return findByID(game.merp1e.Merp1eRules.attack.types, this.data.attackType, null )?.label;
    }

    get rollTypeID() { return "OB"; }

    resolveResult(firstDice, total, data) {
        //const firstDice = data.data?.rollDices[0];
        
        const defenderArmorType = "sl"; // XXX target.actor.armorType
        const fumbleNumber = data.data.fumbleNumber;
        const maximumResult = 150; // XXX
        const result = game.merp1e.Merp1eRules.attack.resolveAttack(firstDice, total, defenderArmorType, data.data.tableReference, fumbleNumber, maximumResult);
        data.data.result = result;
        return result.type;     
    }
    
    resolveText(firstDice, total, data) {
        const result = data.data.result;
        switch(result.type) {
            case "fumble":
                return "FUMBLE: " + result.text;
            case "miss":
                return "MISS!";
            case "critical":
                return "CRITICAL: " + result.critical + " DAMAGE: " + result.damage;
            case "damage":
                return "DAMAGE: " + result.damage;
            case "reference":
                return "See: " + result.text; // XXX
            case "error":
                throw result.text;
            default:
                return result.type + ":" + result.toString();
        }
    }

	_getDataModifiers(cardData) {
        super._getDataModifiers(cardData);
        cardData.skillModifiers.add([
            new Merp1eModifier({
                id: "attackerParry",
                value: 0, // XXX get from the combat control?
                enableFunction: (a) => true,
                valueFunction: 'adHoc',
                label: "MERP1E.Attack.AttackerParry",
                itemId: cardData.skill.id
                })
        ]);
    }

    calculateTotal(cardData) {
        if(!cardData.targetDB) return super.calculateTotal(cardData);

        const mg = cardData.targetSkillModifiers;
        mg.evaluate({
            actor: cardData.target.actor,
            skill: cardData.targetSkill,
            data: { rollTypeID: "DB" }
        });
        const checked = mg.id in cardData.data.modifiersChecked ? cardData.data.modifiersChecked[mg.id] : null;
        const values = mg.id in cardData.data.modifiersValue ? cardData.data.modifiersValue[mg.id] : null;
        const groupTotal = mg.getTotal(checked, values);
        cardData.targetSkillModifiers.total = groupTotal;

        cardData.targetDBTotal = -(cardData.targetDB + cardData.targetSkillModifiers.total);
        super.calculateTotal(cardData);
        cardData.total += cardData.targetDBTotal;
    }

    _getDataActorSkill(cardData) {
        super._getDataActorSkill(cardData);
        cardData.targets = game.merp1e.Merp1eRules.attack.getPossibleTargets(cardData.actor?.id);
        cardData.target = findByID(cardData.targets, cardData.data.targetId, null);
    
        if(cardData.target) {
            cardData.targetDB = cardData.target.actor.defense.total;
            cardData.targetSkill = cardData.target.actor.defense.skill;
            cardData.targetSkillModifiers = new Merp1eModifiers("db", "MERP1E.ManeuverCard.SkillModifiers", cardData.target.actor.defense.modifiers);
            cardData.targetSkillModifiers.add(Merp1eItemEffect.getModifiers({
                actor: cardData.target.actor,
                skill: cardData.targetSkill,
                data: { rollTypeID: "DB" }
            }));
            cardData.targetSkillModifiers.add([
                new Merp1eModifier({
                    id: "defenderParry",
                    value: 0, // XXX get from the combat control?
                    enableFunction: (a) => true,
                    valueFunction: 'adHoc',
                    label: "MERP1E.Attack.DefenderParry",
                    itemId: cardData.targetSkill.id
                    })
            ]);
                cardData.targetSkillModifiers.add()
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}