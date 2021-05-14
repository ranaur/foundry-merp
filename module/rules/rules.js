import { MerpSpell, MerpSpellList } from "./spell.js";
import { MerpSkill } from "./skill.js";
import { TableBT1 } from "./tables/bt-1.js";

export class Merp1eRules {
    static spell = MerpSpell;
    static spelllist = MerpSpellList;
    static skill = MerpSkill;
    static stats = ["ST", "AG", "CO", "IG", "IT", "PR", "AP"];
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
        return Merp1eRules.lookupTable(Merp1eRules.tables.bt1, "Bonus", stat);
    };

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

