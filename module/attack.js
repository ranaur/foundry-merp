export class Merp1eAttack {
    static placeType = [ "sheathed", "dominant hand", "non-dominant hand", "both hands" ];

    constructor(attackInfo, effect = null) {
        Object.assign(this, attackInfo);
        if(effect) {
            this.effectID ??= effect?.id;
            this.itemID ??= effect?.parent?.id;
            this.actorID ??= effect?.parent?.parent?.id;
            this.skillID ??= this.skill?.id;
        }
    }

    get effect() {
        return this.item.effects.get(this.effectID);
    }

    get item() {
        return this.actor.items.get(this.itemID);
    }

    get attacks() {
        return this.actor?.attacks;
    }

    get actor() {
        return game.actors.get(this.actorID);
    }

    get skill() {
        return this?.actor?.getSkillByReference(this.skillReference);
    }

    async setPlace(place = null) {
        if(!Merp1eAttack.placeType.includes(place)) return;

        return await this.setItemFlag("place", place);
    }

    get isMissile() {
        return this.attackType == "missileAttack";
    }

    get isMelee() {
        return this.attackType == "meleeAttack";
    }

    get canThrow() {
        return this.attackType == "meleeAttack" && (this.baseRange || 0) > 0;
    }

    get place() {
        return this.getItemFlag("place") || "sheathed";
    }
    get isUnsheathed() {
        return this.place != "sheathed";
    }

    get isUnsheathedBothHands() {
        return this.place == "both hands";
    }

    get isUnsheathedDominantHand() {
        return this.place == "dominant hand";
    }

    get isUnsheathedNonDominantHand() {
        return this.place == "non-dominant hand";
    }

    async unsheathe(dominantHand = true) {
        let place;
        if(this.isTwoHanded) {
            place = "both hands";
            await this.sheatheAll(place);
        } else { // one handed
            place = dominantHand ? "dominant hand" : "non-dominant hand";
            await this.sheatheHand(dominantHand);
        }
        return await this.setPlace(place);
    }

    async sheathe() {
        return await this.setPlace("sheathed");
    }

    async sheatheHand(dominantHand = true) {
        const place = dominantHand ? "dominant hand" : "non-dominant hand";
        return await this.attacks.filter((at) => at.place == place || at.place == "both hands").forEach((at) => at.sheathe());
    }

    async sheatheAll() {
        return await this.attacks.filter((at) => at.place != "sheathed").forEach((at) => at.sheathe());
    }

    async setItemFlag(key, value) {
        return await this.item.setFlag("merp1e", key, value);
    }
    getItemFlag(key) {
        return this.item.getFlag("merp1e", key);
    }

    static async _roll(data, mergeData = {}) {
        return await game.merp1e.Merp1eRules.attack.rollAttack(mergeObject(data, mergeData));
    }

    async rollMelee() {
        if(!this.isMelee) {
            return await ui.notifications.error(game.i18n.localize("MERP1E.AttackError.NotMeleeRoll"));
        }
        return await Merp1eAttack._roll(this);
    }

    async rollMissile() {
        if(!this.isMissile) {
                return await ui.notifications.error(game.i18n.localize("MERP1E.AttackError.NotMissileRoll"));
        }
        return await Merp1eAttack._roll(this);
    }

    async rollThrow() {
        if(!this.isMelee) {
            return await ui.notifications.error(game.i18n.localize("MERP1E.AttackError.NotThrowRoll"));
        }
        if(!this.canThrow) {
            return await ui.notifications.error(game.i18n.localize("MERP1E.AttackError.CannotThrow"));
        }
        return await Merp1eAttack._roll(this, {
            skillReference: "Thrown",
            attackType: "missileAttack"
        });
    }
}
