export class MerpSkill {
    static BODY_DEVELOPMENT = "BodyDevel";

    static groups = {
        "Movement": { order: 10, label: "MERP1E.Group.Movement" },
        "Weapon": { order: 20, label: "MERP1E.Group.Weapon" },
        "General": { order: 30, label: "MERP1E.Group.General" },
        "Subterfuge": { order: 40, label: "MERP1E.Group.Subterfuge" },
        "Magical": { order: 50, label: "MERP1E.Group.Magical" },
        "Miscelaneous": { order: 60, label: "MERP1E.Group.Miscelaneous" },
        "Secondary": { order: 70, label: "MERP1E.Group.Secondary" }
    };
    static modifiers = {
        difficulty: [
            { id: "Routine", value: 30, description: "MERP1E.Modifier.Routine" },
            { id: "Easy", value: 20, description: "MERP1E.Modifier.Easy" },
            { id: "Light", value: 10, description: "MERP1E.Modifier.Light" },
            { id: "Medium", value: 0, description: "MERP1E.Modifier.Medium" },
            { id: "Hard", value: -10, description: "MERP1E.Modifier.Hard" },
            { id: "Very Hard", value: -20, description: "MERP1E.Modifier.VeryHard" },
            { id: "Extremely Hard", value: -30, description: "MERP1E.Modifier.ExtremelyHard" },
            { id: "Sheer Folly", value: -50, description: "MERP1E.Modifier.SheerFolly" },
            { id: "Absurd", value: -70, description: "MERP1E.Modifier.Absurd" },
        ],
        InterectionAndInfluence: [
            { value: 50, description: "Audience is personally loyal or devoted to the character." },
            { value: 20, description: "Audience is under hire to the character." }
        ],
        ReadRunesUseItens: [
            { description: "- (level of the spell)" },
            { value: -30, description: "If the realm of the spell is different from the character’s." },
            { value: -10, description: "If the character does not know what the spell or ability is." },
            { value: 20, description: "If the character knows what the spell or ability is." },
            { value: 30, description: "If the character can cast the spell intrinsically." }
        ],
        PerceptionAndTracking: [
            { value: +20, description: "If the player states that his character is spending time looking for specific information. The number of rounds spent affects the difficulty." }
        ]
    };

    static getAvaliableSkills(group) {
        return game.data.items.filter(item => (item.type == "skill" && item.data.group == group && item.data.showOnEverySheet == true) );
    }


};