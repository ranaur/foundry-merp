import { MerpSpell, MerpSpellList } from "./spell.js";
import { MerpSkill } from "./skill.js";
import { TableBT1 } from "./tables/bt-1.js";

export class Merp1eRules {
    static spell = MerpSpell;
    static spelllist = MerpSpellList;
    static skill = MerpSkill;
    static stats = ["st", "ag", "co", "ig", "it", "pr", "ap"];
    static tables = {
        bt1: TableBT1
    };
    static stats = [
        { abbr: "st" }, 
        { abbr: "ag" }, 
        { abbr: "co" }, 
        { abbr: "ig" }, 
        { abbr: "it" }, 
        { abbr: "pr" }, 
        { abbr: "ap" , only_value: true }
    ];
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

    static resolvePowerPointsPerLevel(stat) {
        return Merp1eRules.lookupTable(Merp1eRules.tables.bt1, "Power Points", stat);
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
    static getAvaliableLanguageByName(name) {
        /// XXX add folder of avaliable languages (config option)
        return game.items.filter(item => item.type == "language" && item.name == name );
    }
    static getItem(id) {
        return game.items.filter(item => item.id == id)[0];
    }
    static getAvaliableSkills() {
        /// XXX add folder of avaliable races (config option)
        return game.items.filter(item => { return item.type == "skill" && item.data.data.showOnEverySheet == true; });
    }
    static generateSheetOrder(skills = null) {
        if(skills === null) {
            skills = game.merp1e.Merp1eRules.getAvaliableSkills();
        }

        let skillByGroups = {};
    
        // initialize skill groups with all skill groups in rules
        for(let [name, group] of Object.entries(game.merp1e.Merp1eRules.skill.groups)) {
          skillByGroups[name] = {
            name: name,
            order: group.order,
            label: group.label,
            skills: []
          }
        }
    
        // fill skill groups with skills
        for(let skill of Object.values(skills)) {
          let groupName = skill.data.data.group;
          //console.log(groupName, skill);
          skillByGroups[groupName || "Secondary"].skills.push(skill);
        }
    
        // reorder skills inside the groups and generate sheetOrder array
        let sheetOrder = Object.values(skillByGroups).reduce( (acc, group) => {
          group.skills.sort(function(first, second) {
            return first.data.data.order - second.data.data.order;
          });
          acc.push(group);
          return acc;
        }, []);
        // reorder groups in sheetOrder 
        sheetOrder.sort(function(first, second) {
          return first.order - second.order;
        });
    
        return sheetOrder;
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
        }
    }
}
