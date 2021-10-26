import { Merp1eManeuverApplication } from '../apps/maneuver-app.js';
import { MerpSpell, MerpSpellList } from "./spell.js";
import { MerpSkill } from "./skill.js";
import { TableMT2 } from "./tables/mt-2.js";
import { TableMT1 } from "./tables/mt-1.js";
import { TableBT1 } from "./tables/bt-1.js";
import { TableBT5, TableBT5Aux } from "./tables/bt-5.js";
import { TableRR1 } from "./tables/rr-1.js";
import { findByID } from '../util.js';
import { Merp1eStaticManeuverChatCard, Merp1eMovingManeuverChatCard, Merp1eResistenceRollChatCard, Merp1eSpecialRollChatCard } from "../chat/chatcard.js";

export class Merp1eRules {
    static spell = MerpSpell;
    static spelllist = MerpSpellList;
    static skill = MerpSkill;
    static tables = {
        mt2: TableMT2,
        mt1: TableMT1,
        bt1: TableBT1,
        bt5: TableBT5,
        bt5aux: TableBT5Aux,
        rr1: TableRR1
    };
    /* XXX FIX for attack type */
    /*
    static attack = {
        type: [ 
            { id: "heat", label: "MERP1E.AttackType.Heat" }, 
            { id: "cold", label: "MERP1E.AttackType.Cold" }, 
            { id: "Eletricity", label: "MERP1E.AttackType.Eletricity" }, 
            { id: "Impact", label: "MERP1E.AttackType.Impact" }, 
            { id: "Crush", label: "MERP1E.AttackType.Crush" }, 
            { id: "Slash", label: "MERP1E.AttackType.Slash" }, 
            { id: "Puncture", label: "MERP1E.AttackType.Puncture" }, 
            { id: "Unbalancing", label: "MERP1E.AttackType.Unbalancing" }, 
            { id: "Grappling", label: "MERP1E.AttackType.Grappling" }
        ]
    };
    */

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
        { id: "carrying", name: "MERP1E.Location.Carrying", item: null },
        { id: "stored", name: "MERP1E.Location.Stored", item: null },
        { id: "wearing", name: "MERP1E.Location.Wearing", item: null }
    ];

    static stats = [
        { id: "st", label: "MERP1E.Stats.st.Name", abbr: "MERP1E.Stats.st.Abbr" }, 
        { id: "ag", label: "MERP1E.Stats.ag.Name", abbr: "MERP1E.Stats.ag.Abbr" }, 
        { id: "co", label: "MERP1E.Stats.co.Name", abbr: "MERP1E.Stats.co.Abbr" }, 
        { id: "ig", label: "MERP1E.Stats.ig.Name", abbr: "MERP1E.Stats.ig.Abbr" }, 
        { id: "it", label: "MERP1E.Stats.it.Name", abbr: "MERP1E.Stats.it.Abbr" }, 
        { id: "pr", label: "MERP1E.Stats.pr.Name", abbr: "MERP1E.Stats.pr.Abbr" }, 
        { id: "ap", label: "MERP1E.Stats.ap.Name", abbr: "MERP1E.Stats.ap.Abbr" , only_value: true }
    ];
    static rollTypes = [
        { id: "MM", label: "MERP1E.RollType.MM", abbr: "MERP1E.RollTypeAbbr.MM", rollCard: (data) => new Merp1eMovingManeuverChatCard(data) },
        { id: "SM", label: "MERP1E.RollType.SM", abbr: "MERP1E.RollTypeAbbr.SM", rollCard: (data) => new Merp1eStaticManeuverChatCard(data) },
        { id: "RR", label: "MERP1E.RollType.RR", abbr: "MERP1E.RollTypeAbbr.RR", rollCard: (data) => new Merp1eResistenceRollChatCard(data) },
        { id: "DB", label: "MERP1E.RollType.DB", abbr: "MERP1E.RollTypeAbbr.DB", rollCard: (data) => new Merp1eStaticManeuverChatCard(data) },
        { id: "OB", label: "MERP1E.RollType.OB", abbr: "MERP1E.RollTypeAbbr.OB", rollCard: (data) => new Merp1eStaticManeuverChatCard(data) },
        { id: "SP", label: "MERP1E.RollType.SP", abbr: "MERP1E.RollTypeAbbr.SP", rollCard: (data) => new Merp1eSpecialRollChatCard(data) }
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
            { id: "Essence", label: "MERP1E.Realm.Essence", stat: "ig" },
            { id: "Channeling", label: "MERP1E.Realm.Channeling", stat: "it" },
        ],
        realmsAny: [
            { id: "Any", label: "MERP1E.Realm.Any" },
            { id: "Essence", label: "MERP1E.Realm.Essence", stat: "ig" },
            { id: "Channeling", label: "MERP1E.Realm.Channeling", stat: "it" }, // XXX copy from realm on constructor (remove static)
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
            { id: "no", label: "MERP1E.ArmorType.no.Name", abbr: "MERP1E.ArmorType.no.Abbr", bonus: 0, skillReference: "NoArmor" },
            { id: "sl", label: "MERP1E.ArmorType.sl.Name", abbr: "MERP1E.ArmorType.sl.Abbr", bonus: 0, skillReference: "SoftLeather" },
            { id: "rl", label: "MERP1E.ArmorType.rl.Name", abbr: "MERP1E.ArmorType.rl.Abbr", bonus: 0, skillReference: "RigidLeather" },
            { id: "ch", label: "MERP1E.ArmorType.ch.Name", abbr: "MERP1E.ArmorType.ch.Abbr", bonus: 0, skillReference: "Chain" },
            { id: "pl", label: "MERP1E.ArmorType.pl.Name", abbr: "MERP1E.ArmorType.pl.Abbr", bonus: 0, skillReference: "Plate" }
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

    static resolveMovingManeuver(roll, difficulty) {
        if(roll > 300) roll = 300;
        return Merp1eRules.lookupTable(Merp1eRules.tables.mt1, difficulty, roll);
    };

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
    static generateSheetOrder(skills = null) {
        console.error("rules.generateSheetOrder should not be used. Use generateSheetOrder.skill.generateSheetOrder instead!");
        return Merp1eRules.generateSheetOrder(skills);
    }
    
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
