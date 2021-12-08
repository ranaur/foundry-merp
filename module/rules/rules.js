import { Merp1eManeuverApplication } from '../apps/maneuver-app.js';
import { MerpSpell, MerpSpellList } from "./spell.js";
import { MerpSkill } from "./skill.js";
import { TableMT2 } from "./tables/mt-2.js";
import { TableMT1 } from "./tables/mt-1.js";
import { TableBT1 } from "./tables/bt-1.js";
import { TableBT5, TableBT5Aux } from "./tables/bt-5.js";
import { TableRR1 } from "./tables/rr-1.js";
import { findByID } from '../util.js';
import { Merp1eStaticManeuverChatCard, Merp1eMovingManeuverChatCard, Merp1eResistenceRollChatCard, Merp1eSpecialRollChatCard, Merp1eAttackChatCard } from "../chat/chatcard.js";

export class Merp1eTable {
    constructor(tableReference) {
        //Object.assign(this, tableData);
        this.reference = tableReference;
    }

    static createTable(reference) {
        const table = new Merp1eRealTable(reference);
        if(!table) {
            return new Merp1eMockTable(reference);
        }
        return table;
    }
}

class Merp1eRealTable extends Merp1eTable {
    constructor(tableReference) {
        super(tableReference);
        this.rolltable = game.tables.find((t) => t.reference == tableReference);
        if(!this.rolltable) return undefined;
    }

    lookupTable(firstDice, total, column) {
        return this.rolltable.lookupTable(firstDice, total, column);
    }

    get name() {
        return this.rolltable.name;
    }
}

class Merp1eMockTable extends Merp1eTable {
    static mockTables = [
        { id: "at1", tableReference: "AT-1", label: "MERP1E.AttackTable.1HSlashing", description: "Page 70" },
        { id: "at2", tableReference: "AT-2", label: "MERP1E.AttackTable.1HConcussion", description: "Page 70" },
        { id: "at3", tableReference: "AT-3", label: "MERP1E.AttackTable.2Handed", description: "Page 70" },
        { id: "at4", tableReference: "AT-4", label: "MERP1E.AttackTable.Missile", description: "Page 70" },
        { id: "at5", tableReference: "AT-5", label: "MERP1E.AttackTable.ToothClaw", description: "Page 68" },
        { id: "at6", tableReference: "AT-6", label: "MERP1E.AttackTable.GrapplingUmbalancing", description: "Page 68" },
        { id: "at7", tableReference: "AT-7", label: "MERP1E.AttackTable.BoltSpell", description: "Page 74" },
        { id: "at8", tableReference: "AT-8", label: "MERP1E.AttackTable.BallSpell", description: "Page 74" },
    ];

    constructor(tableReference) {
        super(tableReference);
        this.type = "mockTable";
        this.mocktable = findByID(Merp1eMockTable.mockTables, tableReference, null);
    }

    lookupTable(firstDice, total, column) {
        return { type: "text", text: this?.mocktable?.description || "???" };
    }

    get name() {
        return game.i18n.localize(this.mocktable.label);
    }
}

class Merp1eAttack {
    static criticalSizes = [
            { id: "A", label: "MERP1E.criticalSize.A", adjustment: -20 },
            { id: "B", label: "MERP1E.criticalSize.B", adjustment: -10 },
            { id: "C", label: "MERP1E.criticalSize.C", adjustment: 0 },
            { id: "D", label: "MERP1E.criticalSize.D", adjustment: 10 },
            { id: "E", label: "MERP1E.criticalSize.E", adjustment: 20 },
            { id: "T", label: "MERP1E.criticalSize.T", adjustment: 50 }
    ];
    static criticalTypes = [ 
        { id: "heat", label: "MERP1E.CriticalType.Heat", tableReference: "CT-6", reference: "Page 75" }, 
        { id: "cold", label: "MERP1E.CriticalType.Cold", tableReference: "CT-7", reference: "Page 75" }, 
        { id: "eletricity", label: "MERP1E.CriticalType.Eletricity", tableReference: "CT-8", reference: "Page 75" }, 
        { id: "impact", label: "MERP1E.CriticalType.Impact", tableReference: "CT-9", reference: "Page 75" }, 
        { id: "crush", label: "MERP1E.CriticalType.Crush", tableReference: "CT-1", reference: "Page 75" }, 
        { id: "slash", label: "MERP1E.CriticalType.Slash", tableReference: "CT-2", reference: "Page 72" }, 
        { id: "puncture", label: "MERP1E.CriticalType.Puncture", tableReference: "CT-3", reference: "Page 72" }, 
        { id: "unbalancing", label: "MERP1E.CriticalType.Unbalancing", tableReference: "CT-4", reference: "Page 72" }, 
        { id: "grappling", label: "MERP1E.CriticalType.Grappling", tableReference: "CT-5", reference: "Page 73" }, 
        { id: "large", label: "MERP1E.CriticalType.Large", tableReference: "CT-10", reference: "Page 73" }, 
        { id: "huge", label: "MERP1E.CriticalType.Huge", tableReference: "CT-11", reference: "Page 73" }, 
    ];
    static types = [
            { id: "missileAttack", label: "MERP1E.Attack.MissileAttack" },
            { id: "meleeAttack", label: "MERP1E.Attack.MeleeAttack" },
            { id: "spellAttack", label: "MERP1E.Attack.SpellAttack" },
    ];
    static maxResults = [
        { id: "no", max: 150, label: "MERP1E.MaxResults.No" },
        { id: "small", max: 105, label: "MERP1E.MaxResults.Small" },
        { id: "medium", max: 120, label: "MERP1E.MaxResults.Medium" },
        { id: "large", max: 135, label: "MERP1E.MaxResults.Large" },
        { id: "huge", max: 150, label: "MERP1E.MaxResults.Huge" },
        { id: "shock", max: 90, label: "MERP1E.MaxResults.Shock" },
        { id: "water", max: 110, label: "MERP1E.MaxResults.Water" },
        { id: "ice", max: 130, label: "MERP1E.MaxResults.Ice" },
        { id: "fire", max: 150, label: "MERP1E.MaxResults.Fire" },
        { id: "lightning", max: 150, label: "MERP1E.MaxResults.Lightning" }
    ];

    static rollAttack(attackData) {
        return new Merp1eAttackChatCard(attackData).sendMessage();
    }

    static resolveAttack(firstDice, total, defenderArmorType, tableReference, fumbleNumber, maximumResult = 150) {
        const table = Merp1eTable.createTable(tableReference);

        if(firstDice <= fumbleNumber) return { type: "fumble", text: "F" };
        if(total <= fumbleNumber) total = fumbleNumber + 1;

        if(typeof maximumResult === "string") {
            maximumResult = findByID(game.merp1e.Merp1eRules.attack.maxResults, maximumResult, 150);
        }
        if(total > maximumResult) total = maximumResult;

        const result = table.lookupTable(firstDice, total, defenderArmorType);
        if(result.type == "result") {
            if(result.text == "F") {
                result.type = "fumble";
            } else {
                if(result.text.slice(-1).match(/[A-Z]/i) ) {
                    result.type = "critical";
                    result.critical = result.text.slice(-1);
                    result.damage = parseInt(result.text.substring(0, result.text.length - 1));
                } else {
                    const damage = parseInt(result.text);
                    if(damage == 0) {
                        result.type = "miss";
                    } else {
                        result.type = "damage";
                        result.damage = damage;
                    }
                }
            }
        }
        return result;
    }

    static getAvaliableTables() {
        const attackTables = game.tables.filter((tbl) => tbl.type.id == "attackTable").reduce((acc, tbl) => { acc.push({ reference: tbl.reference, name: tbl.shortname, type: tbl.type, table: tbl }); return acc }, []);
        Merp1eMockTable.mockTables.forEach((dtb) => {
            const attackTable = attackTables.find((tbl) => tbl.reference == dtb.tableReference);
            if(!attackTable) {
                res.push(
                    { reference: dtb.reference, name: game.i18n.localize(dtb.label), type: "mockTable" }
                );
            }
        } );
        return attackTables;
    }
    static createTable(reference) {
        return Merp1eTable.createTable(reference);
    }
    static getPossibleTargets(actorId) {
        if(!game.combat.started) return [];
        return game.combat.combatants.reduce((acc,ctt) => { acc.push(ctt); return acc;}, []);
    }
}

class Merp1eMovingManeuverTable {
    static resolve(firstDice, total, column) {
        firstDice = firstDice; // ignore firstDice, there is no UM in the table
        if(total > 300) total = 300;
        return Merp1eRules.lookupTable(Merp1eRules.tables.mt1, column, total);
    }
}

export class Merp1eRules {
    static spell = MerpSpell;
    static spelllist = MerpSpellList;
    static skill = MerpSkill;
    static attack = Merp1eAttack;
    static tables = {
        mt2: TableMT2,
        mt1: TableMT1,
        bt1: TableBT1,
        bt5: TableBT5,
        bt5aux: TableBT5Aux,
        rr1: TableRR1
    };
    
    static injury = {
        statuses: [
            { id: "knockedout", label: "MERP1E.Statuses.KnockedOut", effectName: "KnockedOut" },
            { id: "knockeddown", label: "MERP1E.Statuses.KnockedDown", effectName: "KnockedDown" },
            { id: "stunned", label: "MERP1E.Statuses.Stunned", effectName: "Stun" },
        ],
        types: [ // IHT3RecoveryTabl
            { id: 'burn', label: 'MERP1E.InjuryType.Burn', recovery: { light: 3, medium: 10, severe: 25 } }, 
            { id: 'tissue', label: 'MERP1E.InjuryType.Tissue', recovery: { light: 3, medium: 10, severe: 25 } }, 
            { id: 'bone', label: 'MERP1E.InjuryType.Bone', recovery: { light: 5, medium: 15, severe: 35 } }, 
            { id: 'muscle', label: 'MERP1E.InjuryType.Muscle', recovery: { light: 5, medium: 15, severe: 35 } }, 
            { id: 'tendon', label: 'MERP1E.InjuryType.Tendon', recovery: { light: 5, medium: 15, severe: 35 } }, 
            { id: 'head', label: 'MERP1E.InjuryType.Head', recovery: { light: 14, medium: 60, severe: 180 } }, 
            { id: 'internalOrgan', label: 'MERP1E.InjuryType.InternalOrgan', recovery: { light: 14, medium: 60, severe: 180 } }, 
        ],
        locations: [
            { id: "hand", label: "MERP1E.BodyPart.Hand", bodyGroup: "arm", antecessor: "arm" }, 
            { id: "arm", label: "MERP1E.BodyPart.Arm", bodyGroup: "arm", antecessor: "elbow" }, 
            { id: "elbow", label: "MERP1E.BodyPart.Elbow", bodyGroup: "arm", antecessor: "forearm" }, 
            { id: "forearm", label: "MERP1E.BodyPart.Forearm", bodyGroup: "arm" }, 

            { id: "foot", label: "MERP1E.BodyPart.Foot", bodyGroup: "leg", antecessor: "calf" }, 
            { id: "calf", label: "MERP1E.BodyPart.Calf", bodyGroup: "leg", antecessor: "lowerLeg" }, 
            { id: "lowerLeg", label: "MERP1E.BodyPart.LowerLeg", bodyGroup: "leg", antecessor: "knee" }, 
            { id: "knee", label: "MERP1E.BodyPart.Knee", bodyGroup: "leg", antecessor: "thigh" }, 
            { id: "thigh", label: "MERP1E.BodyPart.Thigh", bodyGroup: "leg", antecessor: "upperLeg" }, 
            { id: "upperLeg", label: "MERP1E.BodyPart.UpperLeg", bodyGroup: "leg", antecessor: "" }, 

            { id: "hips", label: "MERP1E.BodyPart.Hips", bodyGroup: "torso" }, 
            { id: "chest", label: "MERP1E.BodyPart.Chest", bodyGroup: "torso" }, 
            { id: "side", label: "MERP1E.BodyPart.Side", bodyGroup: "torso" }, 
            { id: "abdomen", label: "MERP1E.BodyPart.Abdomen", bodyGroup: "torso" },

            { id: "forehead", label: "MERP1E.BodyPart.Forehead", bodyGroup: "head" }, 
            { id: "temple", label: "MERP1E.BodyPart.Temple", bodyGroup: "head" }, 
            { id: "neck", label: "MERP1E.BodyPart.Neck", bodyGroup: "head" }, 
            { id: "eye", label: "MERP1E.BodyPart.Eye", bodyGroup: "eye" }, 
            { id: "ear", label: "MERP1E.BodyPart.Ear", bodyGroup: "ear" }, 
            { id: "nose", label: "MERP1E.BodyPart.Nose", bodyGroup: "nose"}, 
            { id: "lungs", label: "MERP1E.BodyPart.Lungs", bodyGroup: "organs" }, 
            { id: "heart", label: "MERP1E.BodyPart.Heart", bodyGroup: "organs" }, 
            { id: "kidneys", label: "MERP1E.BodyPart.Kidneys", bodyGroup: "organs" }, 
            { id: "brain", label: "MERP1E.BodyPart.Brain", bodyGroup: "head" }, 
            { id: "head", label: "MERP1E.BodyPart.Head", bodyGroup: "head" }, 
        ],

        bodyGroups: [
            { id: "arm", label: "MERP1E.BodyGroup.Arm", paired: true, icon: 'far fa-hand-paper', statuses: [ "useless", "broken", "severed"] },
            { id: "leg", label: "MERP1E.BodyGroup.Leg", paired: true, icon: 'fas fa-shoe-prints', statuses: [ "useless", "broken", "severed"] },
            { id: "torso", label: "MERP1E.BodyGroup.Torso", paired: false, icon: 'fas fa-male', statuses: [ "damaged" ] },
            { id: "head", label: "MERP1E.BodyGroup.Head", paired: false, icon: 'far fa-user', statuses: [ "fractured" ]},
            { id: "eye", label: "MERP1E.BodyGroup.Eye", paired: true, icon: 'fas fa-eye', statuses: [ "destroyed" ] },
            { id: "ear", label: "MERP1E.BodyGroup.Ear", paired: true, icon: 'fas fa-deaf', statuses: [ "destroyed" ] },
            { id: "nose", label: "MERP1E.BodyGroup.Nose", paired: false, icon: 'fas fa-user', statuses: [ "destroyed" ] },
            { id: "organs", label: "MERP1E.BodyGroup.Organs", paired: false, icon: 'far fa-lungs', statuses: [ "destroyed" ] }
        ],
        categories: [
            { id: "light", label: "MERP1E.InjuryCategory.Light", abbr: "MERP1E.InjuryCategoryAbbr.Light", icon: 'far fa-star' } ,
            { id: "medium", label: "MERP1E.InjuryCategory.Medium", abbr: "MERP1E.InjuryCategoryAbbr.Medium", icon: 'fas fa-star-half-alt' },
            { id: "severe", label: "MERP1E.InjuryCategory.Severe", abbr: "MERP1E.InjuryCategoryAbbr.Severe", icon: 'fas fa-star' }
        ],
        durations: [
            { id: "indefinite", label: "Indefinite" },
            { id: "combat", label: "Combat" },
            { id: "time", label: "Time" }
        ],
        locationStatuses: [
            { id: "ok",  label: "MERP1E.InjuryStatuses.Ok" },
            { id: "useless",  label: "MERP1E.InjuryStatuses.Useless" },
            { id: "broken",  label: "MERP1E.InjuryStatuses.Broken" },
            { id: "severed", label: "MERP1E.InjuryStatuses.Severed" },
            { id: "damaged", label: "MERP1E.InjuryStatuses.Damaged" },
            { id: "fractured", label: "MERP1E.InjuryStatuses.Fractured" },
            { id: "destroyed", label: "MERP1E.InjuryStatuses.Destroyed" },
        ]
    };
    static sides = [
        { id: "right", label: "MERP1E.Side.Right" },
        { id: "left", label: "MERP1E.Side.Left" }
    ];
    static _processLocations() {
        // create bodyGroupsBilateral, locationsBilateral and fill locations in bodyGroup
        this.injury.bodyGroupsBilateral = [];
        this.injury.bodyGroups.forEach( (bg) => {
            bg.locations = [];

            if(bg.paired) {
                this.injury.bodyGroupsBilateral.push({
                    id: bg.id + "-left", 
                    label: bg.label + "Left", 
                    icon: bg.icon,
                    locations: [],
                    statuses: bg.statuses
                });

                this.injury.bodyGroupsBilateral.push({
                    id: bg.id + "-right", 
                    label: bg.label + "Right", 
                    icon: bg.icon,
                    locations: [],
                    statuses: bg.statuses
                });
            } else {
                this.injury.bodyGroupsBilateral.push({
                    id: bg.id, 
                    label: bg.label, 
                    icon: bg.icon,
                    locations: [],
                    statuses: bg.statuses
                });
            }
        });

        this.injury.locationsBilateral = [];
        this.injury.locations.forEach( (lct) => {
            const bg = findByID(this.injury.bodyGroups, lct.bodyGroup);
            bg.locations.push(lct);

            if(bg.paired) {
                const left = {
                    id: lct.id + "-left", 
                    label: lct.label + "Left",
                    bodyGroup: lct.bodyGroup + "-left",
                    antecessor: lct.antecessor + "-left"
                };

                const right = {
                    id: lct.id + "-right", 
                    label: lct.label + "Right",
                    bodyGroup: lct.bodyGroup + "-right",
                    antecessor: lct.antecessor + "-right"
                };
                this.injury.locationsBilateral.push(left);
                this.injury.locationsBilateral.push(right);

                findByID(this.injury.bodyGroupsBilateral, bg.id + "-left").locations.push(left);
                findByID(this.injury.bodyGroupsBilateral, bg.id + "-right").locations.push(right);
            } else {
                this.injury.locationsBilateral.push(lct);
                findByID(this.injury.bodyGroupsBilateral, bg.id).locations.push(lct);
            }
        });
        return;
    }
    static dummy = Merp1eRules._processLocations();

    static actions = [
        { id: "prepareSpell", name:"MERP1E.Action.PrepareSpell" },
        { id: "castSpell", name:"MERP1E.Action.CastSpell" },
        { id: "missileAttack", name:"MERP1E.Action.MissileAttack" },
        { id: "loadReload", name:"MERP1E.Action.LoadReload" },
        { id: "MM", name:"MERP1E.Action.MovingManeuver" },
        { id: "meleeAttack", name:"MERP1E.Action.MeleeAttack" },
        { id: "movement", name:"MERP1E.Action.Movement" },
        { id: "SM", name:"MERP1E.Action.StaticManeuver" },
        { id: "other", name:"MERP1E.Action.Other" },
    ];
    static currencies = [
        { id: "tp", name:"MERP1E.Currency.TP", namePlural:"MERP1E.CurrencyPlural.TP", abbr: "MERP1E.CurrencyAbbr.TP", unitaryValue: 0.001 },
        { id: "cp", name:"MERP1E.Currency.CP", namePlural:"MERP1E.CurrencyPlural.CP", abbr: "MERP1E.CurrencyAbbr.CP", unitaryValue: 0.01 },
        { id: "bp", name:"MERP1E.Currency.BP", namePlural:"MERP1E.CurrencyPlural.BP", abbr: "MERP1E.CurrencyAbbr.BP", unitaryValue: 0.1 },
        { id: "sp", name:"MERP1E.Currency.SP", namePlural:"MERP1E.CurrencyPlural.SP", abbr: "MERP1E.CurrencyAbbr.SP", unitaryValue: 1 },
        { id: "gp", name:"MERP1E.Currency.GP", namePlural:"MERP1E.CurrencyPlural.GP", abbr: "MERP1E.CurrencyAbbr.GP", unitaryValue: 10 },
        { id: "mp", name:"MERP1E.Currency.MP", namePlural:"MERP1E.CurrencyPlural.MP", abbr: "MERP1E.CurrencyAbbr.MP", unitaryValue: 1000 },
    ];

    static mainLocations = [
        { id: "wearing", name: "MERP1E.Location.Wearing", item: null },
        { id: "carrying", name: "MERP1E.Location.Carrying", item: null },
        { id: "stored", name: "MERP1E.Location.Stored", item: null },
        { id: "dropped", name: "MERP1E.Location.Dropped", item: null },
    ];

    static stats = [
        { id: "st", label: "MERP1E.Stats.st.Name", abbr: "MERP1E.Stats.st.Abbr" }, 
        { id: "ag", label: "MERP1E.Stats.ag.Name", abbr: "MERP1E.Stats.ag.Abbr" }, 
        { id: "co", label: "MERP1E.Stats.co.Name", abbr: "MERP1E.Stats.co.Abbr" }, 
        { id: "ig", label: "MERP1E.Stats.ig.Name", abbr: "MERP1E.Stats.ig.Abbr" }, 
        { id: "it", label: "MERP1E.Stats.it.Name", abbr: "MERP1E.Stats.it.Abbr" }, 
        { id: "pr", label: "MERP1E.Stats.pr.Name", abbr: "MERP1E.Stats.pr.Abbr" }, 
        { id: "ap", label: "MERP1E.Stats.ap.Name", abbr: "MERP1E.Stats.ap.Abbr", only_value: true }
    ];

    static rollTypes = [
        { id: "MM", label: "MERP1E.RollType.MM", abbr: "MERP1E.RollTypeAbbr.MM", rollCard: (data) => new Merp1eMovingManeuverChatCard(data) },
        { id: "SM", label: "MERP1E.RollType.SM", abbr: "MERP1E.RollTypeAbbr.SM", rollCard: (data) => new Merp1eStaticManeuverChatCard(data) },
        { id: "RR", label: "MERP1E.RollType.RR", abbr: "MERP1E.RollTypeAbbr.RR", rollCard: (data) => new Merp1eResistenceRollChatCard(data) },
        { id: "DB", label: "MERP1E.RollType.DB", abbr: "MERP1E.RollTypeAbbr.DB" },
        { id: "OB", label: "MERP1E.RollType.OB", abbr: "MERP1E.RollTypeAbbr.OB" },
        { id: "SP", label: "MERP1E.RollType.SP", abbr: "MERP1E.RollTypeAbbr.SP", rollCard: (data) => new Merp1eSpecialRollChatCard(data) }
    ];

    static timeframes = [
        { id: "seconds", label: "MERP1E.TimeFrame.Seconds", abbr: "MERP1E.TimeFrameAbbr.Seconds", seconds: 1 },
        { id: "rounds", label: "MERP1E.TimeFrame.Rounds", abbr: "MERP1E.TimeFrameAbbr.Rounds", seconds: 10 },
        { id: "minutes", label: "MERP1E.TimeFrame.Minutes", abbr: "MERP1E.TimeFrameAbbr.Minutes", seconds: 60 },
        { id: "hours", label: "MERP1E.TimeFrame.Hours", abbr: "MERP1E.TimeFrameAbbr.Hours", seconds: 3600 },
        { id: "days", label: "MERP1E.TimeFrame.Days", abbr: "MERP1E.TimeFrameAbbr.Days", seconds: 3600 * 24 },
        { id: "weeks", label: "MERP1E.TimeFrame.Weeks", abbr: "MERP1E.TimeFrameAbbr.Weeks", seconds: 3600 * 24 * 7 },
        { id: "months", label: "MERP1E.TimeFrame.Months", abbr: "MERP1E.TimeFrameAbbr.Months", seconds: 3600 * 24 * 30 },
    ];

    static getSpecialItems() {
        return game.data.items.filter((item) => item.type == "special").reduce((acc, itm) => { acc[itm._id] = itm.name; return acc; }, { "": null });
    }

    static get globalEffect() {
        const globalEffectId = game.settings.get("merp1e", "globalEffect");
        return game.items.get(globalEffectId);
    }

    static rollManeuver(skill, rollTypeID = null) {
        if(!skill) return ui.notifications.error(`Must choose a skill to roll a Maneuver!`);
        if(!rollTypeID) rollTypeID = skill?.data?.data?.rollType;
        const rollType = findByID(this.rollTypes, rollTypeID, "SM");
        if(rollType) {
            if(!rollType.rollCard) {
                return ui.notifications.error(`Rolltype ${rollTypeID} cannot be rolled in this manner!`);
            }
            const card = rollType.rollCard({skill: skill, rollTypeID: rollType.id});
            card.sendMessage();
        } else {
            ui.notifications.error(`Rolltype ${rollTypeID} not found!`);
        }
    }
    static special = {
        types: [
            { id: "Background Option", label: "MERP1E.Special.BackgorundOption", abbr: "MERP1E.SpecialAbbr.BackgorundOption", icon: "fas fa-user-plus" },
            { id: "Feature", label: "MERP1E.Special.Feature", abbr: "MERP1E.SpecialAbbr.Feature", icon: "fas fa-notes-medical" },
            { id: "Maneuver Success", label: "MERP1E.Special.ManeuverSuccess", abbr: "MERP1E.SpecialAbbr.ManeuverSuccess", icon: "fas fa-glasses" },
            { id: "Global Effects", label: "MERP1E.Special.GlobalEffects", abbr: "MERP1E.SpecialAbbr.GlobalEffects", icon: "fas fa-globe-americas" }
        ]
    };
    static profession = {
        list: {
            "Warrior": { name: "Warrior" },
            "Scout": { name: "Scout" },
            "Ranger": { name: "Ranger" },
            "Bard": { name: "Bard" },
            "Mage": { name: "Mage" },
            "Animist": { name: "Animist" }
        }
    }; // XXX make a lookkup on item directory
    static magic = {
        realms: [
            { id: "essence", label: "MERP1E.Realm.Essence", stat: "ig" },
            { id: "channeling", label: "MERP1E.Realm.Channeling", stat: "it" },
        ],
        realmsAny: [
            { id: "any", label: "MERP1E.Realm.Any" },
            { id: "essence", label: "MERP1E.Realm.Essence", stat: "ig" },
            { id: "channeling", label: "MERP1E.Realm.Channeling", stat: "it" }, // XXX copy from realm on constructor (remove static)
        ],
        professionalRestrictions: [
            { id: "profession and open", label: "MERP1E.SpellsAllowed.ProfessionOpen" },
            { id: "profession and open up to 5th level", label: "MERP1E.SpellsAllowed.Profession5th" },
            { id: "open up to 5th level", label: "MERP1E.SpellsAllowed.Open5th" },
            { id: "open up to 3rd level", label: "MERP1E.SpellsAllowed.Open3rd" },
        ],

    };

    static defenseTypes = [
        { id: "none", label: "MERP1E.DefenseType.None", bonus: 0 },
        { id: "leather", label: "MERP1E.DefenseType.Leather", bonus: 0 },
        { id: "metal", label: "MERP1E.DefenseType.Metal", bonus: 0 }
    ];

    static defense = {
        armorTypes: [
            { id: "no", label: "MERP1E.ArmorType.no.Name", abbr: "MERP1E.ArmorType.no.Abbr", bonus: 0, skillReference: "NoArmor", attackPos: 4 },
            { id: "sl", label: "MERP1E.ArmorType.sl.Name", abbr: "MERP1E.ArmorType.sl.Abbr", bonus: 0, skillReference: "SoftLeather", attackPos: 3 },
            { id: "rl", label: "MERP1E.ArmorType.rl.Name", abbr: "MERP1E.ArmorType.rl.Abbr", bonus: 0, skillReference: "RigidLeather", attackPos: 2 },
            { id: "ch", label: "MERP1E.ArmorType.ch.Name", abbr: "MERP1E.ArmorType.ch.Abbr", bonus: 0, skillReference: "Chain", attackPos: 1 },
            { id: "pl", label: "MERP1E.ArmorType.pl.Name", abbr: "MERP1E.ArmorType.pl.Abbr", bonus: 0, skillReference: "Plate", attackPos: 0 }
        ],
        armGreavesTypes: Merp1eRules.defenseTypes,
        legGreavesTypes: Merp1eRules.defenseTypes,
        helmTypes: Merp1eRules.defenseTypes,
        shieldTypes: [
            { id: "none", label: "MERP1E.ShieldType.None", bonus: 0 },
            { id: "yes", label: "MERP1E.ShieldType.Shield", bonus: 25 }
        ],
    }
    static health = {
        apendageStatus: [
            { value: "0", label: 'ok', labelI18: 'MERP1E.ApendageStatus.ok' }, 
            { value: "1", label: 'useless', labelI18: 'MERP1E.ApendageStatus.useless' },
            { value: "2", label: 'broken', labelI18: 'MERP1E.ApendageStatus.broken' }, 
            { value: "3", label: 'severed', labelI18: 'MERP1E.ApendageStatus.severed' }
        ],
        apendageIcons: {
            "0": "fas fa-check",
            "1": "fas fa-thumbs-down", 
            "2": "fas fa-unlink", 
            "3": "fas fa-cut"
        },            
        sideStatus: [
            { value: "0", label: 'none', labelI18: 'MERP1E.SideStatus.none' }, 
            { value: "1", label: 'left', labelI18: 'MERP1E.SideStatus.left' },
            { value: "2", label: 'right', labelI18: 'MERP1E.SideStatus.right' }, 
            { value: "3", label: 'both', labelI18: 'MERP1E.SideStatus.both' }
        ],
        sideIcons: {
            "0": "", //fa-check-circle
            "1": "fas fa-chevron-circle-left", 
            "2": "fas fa-chevron-circle-right", 
            "3": "fas fa-times-circle"
        },            
        sideChoose: [
            { value: "0", label: 'random', labelI18: 'MERP1E.SideChoose.random' }, 
            { value: "1", label: 'left', labelI18: 'MERP1E.SideStatus.left' },
            { value: "2", label: 'right', labelI18: 'MERP1E.SideStatus.right' }, 
            { value: "3", label: 'both', labelI18: 'MERP1E.SideChoose.both' },
            { value: "4", label: 'shield', labelI18: 'MERP1E.SideChoose.shield' }, 
            { value: "5", label: 'weapon', labelI18: 'MERP1E.SideChoose.weapon' }
        ],
        paralyzedStatus: [
            { value: "0", label: 'none', labelI18: 'MERP1E.ParalyzedStatus.none' }, 
            { value: "1", label: 'waist', labelI18: 'MERP1E.ParalyzedStatus.waist' },
            { value: "2", label: 'shoulder', labelI18: 'MERP1E.ParalyzedStatus.shoulder' }, 
            { value: "3", label: 'neck', labelI18: 'MERP1E.ParalyzedStatus.neck' }
        ],
        paralyzedIcons: {
            "0": "", //fa-check-circle
            "1": "W", 
            "2": "S", 
            "3": "N"
        },            
    }
    static lookupTable(table, column, number) {
        let ret = null;
        let choosedLine = null;

        if(number == null) return null;

        for (let line of table.table) {
            if(number <= line[0]) {
                choosedLine = line;
                break;
            }
        }
        if(typeof column == 'string') {
            column = table.columns.indexOf(column) + 1;
        }
        if(Array.isArray(choosedLine)) {
            return choosedLine[column];
        } else {
            return null;
        }
    };

    static resolveStatBonus(stat) {
        return Merp1eRules.lookupTable(Merp1eRules.tables.bt1, "Bonus", stat);
    };

    static resolvePowerPointsPerLevel(stat) {
        return Merp1eRules.lookupTable(Merp1eRules.tables.bt1, "Power Points", stat);
    };

    static resolveResistenceRoll(attackLevel, targetLevel) {
        if(attackLevel < 1) return null;
        if(targetLevel < 1) return null;
        let al = attackLevel > 15 ? 15 : attackLevel;
        let tl = targetLevel > 15 ? 15 : targetLevel;
        let adj = (targetLevel > 15 ? 15 - targetLevel : 0) - (attackLevel > 15 ? 15 - attackLevel : 0);
        return Merp1eRules.tables.rr1.table[tl-1][al-1] + adj;
    };

    static resolveMovingManeuver(firstDice, total, difficulty) {
        return Merp1eMovingManeuverTable.resolve(firstDice, total, difficulty);
    }
        

    static resolveStaticManeuver(roll) {
        if(roll > 300) roll = 300;
        return Merp1eRules.lookupTable(Merp1eRules.tables.mt2, "id", roll);
    };
    static resolveStaticManeuverLabel(roll) {
        if(roll > 300) roll = 300;
        return game.i18n.localize(Merp1eRules.lookupTable(Merp1eRules.tables.mt2, "label", roll));
    };
    static resolveStaticManeuverText(roll, skill = null) {
        let label;
        
        if(skill) {
            const id = this.resolveStaticManeuver(roll);
            label = skill?.data?.data?.staticManeuverTexts?.[id];
        }
        if(!label) {
            if(roll > 300) roll = 300;
            label = Merp1eRules.lookupTable(Merp1eRules.tables.mt2, "text", roll);
        }
        return game.i18n.localize(label);
    }
    static staticManeuverResults() {
        return Merp1eRules.tables.mt2.toObjectArray();
        //return Merp1eRules.tables.mt2.table.reduce((acc, row) => { acc.push({id: row[1], label: row[2], text: row[3]}); return acc;}, []);
    }

    static resolveEncumbrance(characterWeight, weightCarried) {
        let excessWeight;
        if(weightCarried > 160) {   
            excessWeight = weightCarried - 160;
            weightCarried = 160;
        } else {
            excessWeight = 0;
        }
        const col = Merp1eRules.lookupTable(Merp1eRules.tables.bt5aux, "WEIGHT CARRIED", weightCarried);
        const res = Merp1eRules.lookupTable(Merp1eRules.tables.bt5, col, characterWeight);
        if(res == "NA") return res;
        return res + Math.ceil(excessWeight / 10 * 5);
    };

    static getRolltableByDescription(description) {
        return game.rolltables.find((rt) => rt.data.description == description );
    }

    static getMaxResult(sizeId) {
        return findById(this.attack.maxResults, sizeId, 150);
    }

    static resolveAttackTable(tableId, roll, total, armorId, sizeId = null) {
        const table = findByID(this.attack.tables, tableId, null);
        if(!table) return null;
        const rollTable = this.getRolltableByDescription(table.tableReference);
        if(!rollTable) { // table not found
            return table;
        }

        let resultLine;
        // handle UM
        const rollResultLine = rollTable.getResultsForRoll(roll);
        if(rollResultLine.substr(rollResultLine.length - 4) == "(UM)") {
            resultLine = rollResultLine.substr(0, rollResultLine.length - 4);
        } else {
            total = min(total, this.getMaxResult(sizeId));
            resultLine = rollTable.getResultsForRoll(total);
        }

        // Parse Armor
        const results = resultLine.split(",");
        const armor = findById(this.armorTypes, armorId, null);
        if(!armor){
            throw `Invalid armor type "${armorId}""`;
        }

        return results[armor.attackPos];
    }

    // Maps XP to the level
    static resolveLevel(xp) {
        const x = Math.floor(xp/10000);
        if(x < 5) return x;
        if(x < 17) return Math.floor(((x - 5)/2)+5);
        return null;
    }

    // Returns how many XPs is needed to advance to the new level
    static resolveExperiencePointsRequired(level) {
        // Table ET-5
        if(level <= 5) return 10000 * level;
        if(level <= 10) return 50000 + (20000 * (level - 5));
        
        return null;
    }
    static resolveNormalSkillRankBonus(ranks) {
        // Table BT-4
        if(ranks == 0) return -25;
        if(ranks <= 10) return ranks * 5;
        if(ranks <= 20) return 50 + (ranks - 10) * 2;
        return 70 + (ranks - 20);
    }

    static resolveSkillRankBonus(ranks, rankBonus, method) {
        switch(method) {
            case "no rank":
                return null;
            case "normal":
                return this.resolveNormalSkillRankBonus(ranks);
            case "always 1":
                return ranks * 1;
            case "roll per rank":
                return rankBonus;
            default:
                return null;
        }
    }
    static resolveSkillBonus(skill) {
        return this.resolveSkillRankBonus(skill.ranks || 0, skill.rankBonus || 0, skill.rankBonusMethod);
    }

    static getAvaliableProfessions() {
        /// XXX add folder of avaliable professions (config option)
        /// Add localization
        return game.items.filter(item => item.type == "profession").reduce((res, prof) => { res[prof.id] = prof.name; return res; }, { null: game.i18n.localize("MERP1E.Race.ChooseOne")});
    }
    static getAvaliableRaces() {
        /// XXX add folder of avaliable races (config option)
        return game.items.filter(item => item.type == "race").reduce((res, race) => { res[race.id] = race.name; return res; }, { null: game.i18n.localize("MERP1E.Race.ChooseOne")});
    }
    static getItemByTypeIdName(type, id, name) {
        return game.items.find(item => item.type == type && item.id == id) || game.items.find(item => item.type == type && item.name == name); 
    }
    
    static getAvaliableLanguageByName(name) {
        /// XXX add folder of avaliable languages (config option)
        return game.items.filter(item => item.type == "language" && item.name == name );
    }
    static getItem(id) {
        return game.items.filter(item => item.id == id)[0];
    }
    static getActors() {
        return game.actors.filter(actor => { return actor.type == "character" && actor.permission == CONST.ENTITY_PERMISSIONS.OWNER; });
    }
/*    static generateSheetOrder(skills = null) {
        console.error("rules.generateSheetOrder should not be used. Use generateSheetOrder.skill.generateSheetOrder instead!");
        return MerpSkill.generateSheetOrder(skills);
    }
*/  
    static settings = {
        get damageControl() {
            return game.settings.get("merp1e", "damageControl");
        },
        get damageControlManual() {
            return this.damageControl == "manual";
        },
        get damageControlAutomatic() {
            return this.damageControl == "automatic";
        },
        
        get xpControl() {
            return game.settings.get("merp1e", "xpControl");
        },
        get xpControlManual() {
            return this.xpControl == "manual";
        },
        get xpControlAutomatic() {
            return this.xpControl == "automatic";
        },

        get armorControl() {
            return game.settings.get("merp1e", "armorControl");
        },
        get armorControlManual() {
            return this.armorControl == "manual";
        },
        get armorControlAutomatic() {
            return this.armorControl == "automatic";
        },
        
        get spellcastingControl() {
            return game.settings.get("merp1e", "spellcastingControl");
        },
        get spellcastingControlManual() {
            return this.spellcastingControl == "manual";
        },
        get spellcastingControlAutomatic() {
            return this.spellcastingControl == "automatic";
        }
    }

    static async maneuver(event = {}, options ={}){
        const rolled = await Merp1eManeuverApplication.create({});
        
        console.log(rolled);
    }

}
