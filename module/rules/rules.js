import { MerpSpell, MerpSpellList } from "./spell.js";
import { MerpSkill } from "./skill.js";
import { TableBT1 } from "./tables/bt-1.js";

export class Merp1eRules {
    static spell = MerpSpell;
    static spelllist = MerpSpellList;
    static skill = MerpSkill;
    static stats = ["st", "ag", "co", "ig", "it", "pr", "ap"]; // XXX Delme?
    static tables = {
        bt1: TableBT1
    };
    static stat = {
        list: {"st": {}, 
            "ag": {}, 
            "co": {}, 
            "ig": {}, 
            "it": {}, 
            "pr": {}, 
            "ap": {}
        }
    };
    static rollType = {
        list: { 
            "MM": {},
            "SM": {},
            "RR": {},
            "DB": {},
            "OB": {},
            "SP": {}
        }
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

    static lookupTable(table, column, number) {
        let ret = null;
        let choosedLine = null;
        for (let line of table.table) {
            if(number <= line[0]) {
                choosedLine = line;
                break;
            }
        }
        if(typeof column == 'string') {
            number = table.columns.indexOf(column) + 1;
        }
        if(Array.isArray(choosedLine)) {
            return choosedLine[number];
        } else {
            return null;
        }
    };

    static resolveStatBonus(stat) {
        return Merp1eRules.lookupTable(Merp1eRules.tables.bt1, "Bonus", stat);
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
    static resolveSkillRankBonus(ranks) {
        if(typeof ranks === "number") {
            // Table BT-4
            if(ranks == 0) return -25;
            if(ranks <= 10) return ranks * 5;
            if(ranks <= 20) return 50 + (ranks - 10) * 2;
            return 70 + (ranks - 20);
        }
        if(Array.isArray(ranks)) {
            // sum the values (Body Development)
            return Merp1eRules.resolveSkillRankBonus(ranks.reduce((a, i) => {return a+i;}, 0));
        }
        // XXX Implement dictionary level/qtd { 0: 1, 1: 2, 2: 1 ...}
        return null;
    }
}

