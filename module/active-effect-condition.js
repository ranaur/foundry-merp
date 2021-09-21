export class Merp1eEffectCondition {
    static registeredTypes = [];
    
    get priority() { return 100; }

    static get conditionName() {
        return this.name.replace("Merp1eEffectCondition", "");
    }
    static get label() {
        return "MERP1E.EffectCondition." + this.conditionName;
    }
    /*
     * returns a striong explaining why is not active, or true if active.
     */
    reason(effect, actor) {
        console.error("reason must be overloaded!");
        return "Base class must be overloaded"; // XXX I18
    }
    isActive(effect, actor) {
        return this.reason(effect, actor) == true;
    }
}

export class Merp1eEffectConditionAlwaysOn extends Merp1eEffectCondition {
    static dummy = Merp1eEffectCondition.registeredTypes.push(this)

    get priority() { return 30; }
    reason(effect, actor) {
        return true;
    }
}

export class Merp1eEffectConditionOnItemCarried extends Merp1eEffectCondition {
    static dummy = Merp1eEffectCondition.registeredTypes.push(this)

    get priority() { return 40; }

    reason(effect, actor) {
        if (effect.getFlag("merp1e", "conditions.OnItemCarriedPlaces") == "Anywhere") {
            return true;
        }
        let allowedPlaces = effect.getFlag("merp1e", "conditions.OnItemCarriedPlaces").split(",");
        allowedPlaces.forEach((i) => i.trim());
        if (actor.items[effect.origin].carriedPlace in allowedPlaces) {
            return true;
        }
        return "Item not weared."; // XXX I18
    }
}

export class Merp1eEffectConditionOnArmorTypes extends Merp1eEffectCondition {
    static dummy = Merp1eEffectCondition.registeredTypes.push(this)

    get priority() { return 50; }

    reason(effect, actor) {
        if (actor.defense.armor.id in effect.data.flags.merp1e.conditions.OnArmorTypes) {
            if (effect.data.flags.merp1e.conditions.OnArmorTypes[actor.defense.armor.id]) {
                return true;
            }
            return "Actor armor type forbids activation of effect."; // XXX I18
        }
        return "Armor type not in the allowed armor list."; // XXX I18
    }
}

