import { findByID } from "../util.js";

export class MerpSkill {
    static BODY_DEVELOPMENT = "BodyDevel";
    static DEFENSIVE_BONUS = "DefensiveBonus";

    static groups = [
        { id: "Movement", order: 10, label: "MERP1E.Group.Movement" },
        { id: "Weapon", order: 20, label: "MERP1E.Group.Weapon" },
        { id: "General", order: 30, label: "MERP1E.Group.General" },
        { id: "Subterfuge", order: 40, label: "MERP1E.Group.Subterfuge" },
        { id: "Magical", order: 50, label: "MERP1E.Group.Magical" },
        { id: "Miscelaneous", order: 60, label: "MERP1E.Group.Miscelaneous" },
        { id: "Secondary", order: 70, label: "MERP1E.Group.Secondary" }
    ];
    static rankBonusTypes = [
        { id:"normal", label: "MERP1E.SkillRankBonusMethod.normal" },
        { id:"always 1", label: "MERP1E.SkillRankBonusMethod.always1" },
        { id:"roll per rank", label: "MERP1E.SkillRankBonusMethod.rollPerRank" },
        { id:"no rank", label: "MERP1E.SkillRankBonusMethod.noRank" }
    ];
    static difficulties = [
        { id: "Routine", value: 30, label: "MERP1E.Modifier.Routine" },
        { id: "Easy", value: 20, label: "MERP1E.Modifier.Easy" },
        { id: "Light", value: 10, label: "MERP1E.Modifier.Light" },
        { id: "Medium", value: 0, label: "MERP1E.Modifier.Medium" },
        { id: "Hard", value: -10, label: "MERP1E.Modifier.Hard" },
        { id: "Very Hard", value: -20, label: "MERP1E.Modifier.VeryHard" },
        { id: "Extremely Hard", value: -30, label: "MERP1E.Modifier.ExtremelyHard" },
        { id: "Sheer Folly", value: -50, label: "MERP1E.Modifier.SheerFolly" },
        { id: "Absurd", value: -70, label: "MERP1E.Modifier.Absurd" },
    ];
    static modifiers = {
        InterectionAndInfluence: [
            { value: 50, optional: true, label: "Audience is personally loyal or devoted to the character." },
            { value: 20, optional: true, label: "Audience is under hire to the character." }
        ],
        ReadRunesUseItens: [
            { valueFunction: "adHoc", label: "- (level of the spell)" }, // XXX valueFunction?
            { value: -30, label: "If the realm of the spell is different from the character’s." },
            { value: -10, label: "If the character does not know what the spell or ability is." },
            { value: 20, label: "If the character knows what the spell or ability is." },
            { value: 30, label: "If the character can cast the spell intrinsically." }
        ],
        PerceptionAndTracking: [
            { value: 20, label: "If the player states that his character is spending time looking for specific information. The number of rounds spent affects the difficulty." }
        ],
        Movement: [
            { value: -50, label: "MERP1E.Maneuver.Stunned", enableFunction: "isStunned" }, 
            { value: -70, label: "MERP1E.Maneuver.Down", enableFunction: "isDown" }, 
            { value: -30, label: "MERP1E.Maneuver.OneLimbOut", enableFunction: "isLimbOut" }
        ]
    };

    static getModifier(table, id) {
        return table.reduce((a, m) => m.id == id ? m : a, null);
    }

    static getModifierValue(table, id) {
        return findByID(table, id, {value: 0}).value;
        //let mod = this.getModifier(table, id);
        //return mod == null ? 0 : mod.value;
    }

    static getAvaliableByGroup(group) {
        return game.items.filter(item => (item.type == "skill" && item.data.data.group == group && item.data.data.showOnEverySheet == true) );
    }

    static getAvaliableByReference(reference) {
        const skills = game.items.filter(item => (item.type == "skill" && item.data.data.reference == reference && item.data.data.showOnEverySheet == true) );
        console.assert(skills.length <= 1, "rules.skill.getAvaliableByReference returned more than one line for " & reference);
        return skills.length > 0 ? skills[0] : null;
    }

    static getAvaliable() {
        return game.items.filter(item => (item.type == "skill" && item.data.data.showOnEverySheet == true) );
    }

    static generateSheetOrder(skills = null) {
        if(skills === null) {
            skills = MerpSkill.getAvaliable();
        }

        let skillByGroups = {};
    
        // fill skill groups with skills
        for(let skill of Object.values(skills)) {
            let groupName = skill?.data?.data?.group || skill?.data?.group || "Unknown";
            if(!(groupName in skillByGroups)) {
                const group = findByID(MerpSkill.groups, groupName, { id: "Unknown", order: 0, label: "MERP1E.Group.Unknown" });
                skillByGroups[group.id] = {
                    id: group.id,
                    order: group.order,
                    label: group.label,
                    skills: []
                  }
            }
            //console.log(groupName, skill);
            skillByGroups[groupName].skills.push(skill);
        }
    
        // reorder skills inside the groups and generate sheetOrder array
        let sheetOrder = Object.values(skillByGroups).reduce( (acc, group) => {
          group.skills.sort(function(first, second) {
            const firstOrder = first?.data?.data?.order || first?.data?.order;
            const secondOrder = second?.data?.data?.order || second?.data?.order;
            return firstOrder - secondOrder;
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
};


