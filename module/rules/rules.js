import { MerpSpell, MerpSpellList } from "./spell.js";
import { MerpSkill } from "./skill.js";
import { TableBT1 } from "./tables/bt-1.js";

export class Merp1eRules {
    static spell = MerpSpell;
    static spelllist = MerpSpellList;
    static skill = MerpSkill;
    static stats = ["st", "ag", "co", "ig", "it", "pr", "ap"];
    static rollTypes = ["MM", "SM", "RR", "OB", "SP"];
    static tables = {
        bt1: TableBT1
    };

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
        return MerpRules.lookupTable(tables.bt1, "Bonus", stat);
    };

    static resolveSkillRankBonus(ranks) {
        // Table BT-4
        if(ranks == 0) return -25;
        if(ranks <= 10) return ranks * 5;
        if(ranks <= 20) return 50 + (ranks - 10) * 2;

        return 70 + (ranks - 20);
    }
}

