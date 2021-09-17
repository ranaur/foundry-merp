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
    static modifiers = {
        Difficulties: [
            { id: "Routine", value: 30, label: "MERP1E.Modifier.Routine" },
            { id: "Easy", value: 20, label: "MERP1E.Modifier.Easy" },
            { id: "Light", value: 10, label: "MERP1E.Modifier.Light" },
            { id: "Medium", value: 0, label: "MERP1E.Modifier.Medium" },
            { id: "Hard", value: -10, label: "MERP1E.Modifier.Hard" },
            { id: "Very Hard", value: -20, label: "MERP1E.Modifier.VeryHard" },
            { id: "Extremely Hard", value: -30, label: "MERP1E.Modifier.ExtremelyHard" },
            { id: "Sheer Folly", value: -50, label: "MERP1E.Modifier.SheerFolly" },
            { id: "Absurd", value: -70, label: "MERP1E.Modifier.Absurd" },
        ],
        InterectionAndInfluence: [
            { value: 50, optional: true, label: "Audience is personally loyal or devoted to the character." },
            { value: 20, optional: true, label: "Audience is under hire to the character." }
        ],
        ReadRunesUseItens: [
            { value: null, label: "- (level of the spell)" }, // XXX valueFunction?
            { value: -30, optional: true, label: "If the realm of the spell is different from the character’s." },
            { value: -10, optional: true, label: "If the character does not know what the spell or ability is." },
            { value: 20, optional: true, label: "If the character knows what the spell or ability is." },
            { value: 30, optional: true, label: "If the character can cast the spell intrinsically." }
        ],
        PerceptionAndTracking: [
            { value: 20, label: "If the player states that his character is spending time looking for specific information. The number of rounds spent affects the difficulty." }
        ],
        Movement: [
            { value: -50, label: "MERP1E.Maneuver.Stunned", enableFunction: (actor) => actor.health.isStunned }, 
            { value: -70, label: "MERP1E.Maneuver.Down", enableFunction: (actor) => actor.health.isDown }, 
            { value: -30, label: "MERP1E.Maneuver.OneLimbOut", enableFunction: (actor) => actor.health.isLimbOut }
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
    static getAvaliableSkills(group) {
        return game.data.items.filter(item => (item.type == "skill" && item.data.group == group && item.data.showOnEverySheet == true) );
    }

    static getAvaliable() {
        return game.data.items.filter(item => (item.type == "skill" && item.data.showOnEverySheet == true) );
    }

};


