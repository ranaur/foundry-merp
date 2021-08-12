export class MerpSkill {
    /*static sheetOrder = [
        { id: "Movement", skills: ["NoArmor", "SoftLeather", "RigidLeather", "Chain", "Plate"] },
        { id: "Weapon", skills: ["OneHandedEdged", "OneHandedConcussion", "TwoHanded", "Thrown", "Missile", "Polearms"] },
        { id: "General", skills: ["Climb", "Ride", "Swim", "Track"] },
        { id: "Subterfuge", skills: ["Ambush", "StalkHide", "PickLock", "Disarmtrap"] },
        { id: "Magical", skills: ["ReadRunes", "UseItens", "DirectedSpells"] },
        { id: "Miscelaneous", skills: ["Perception", "BodyDevel", "BaseSpells", "LeadershipandInfluence", "DefensiveBonus", "EssenceRR", "ChannelingRR", "PoisonRR", "DiseaseRR"] },
        { id: "Secondary", skills: ["Acrobatics", "Acting", "Caving", "Contortions", "Cookery", "Dance", "Diving", "Fletching", "Foraging", "Gambling", "Herding", "LeatherWorking", "Meditation", "Music", "PublicSpeaking", "RopeMastery", "Rowing", "Sailing", "Signaling", "Skiing", "Smithing", "StarGazing", "TrapBuilding", "Trickery", "Tumbling", "WeatherWatching", "WoodCarving"] }
    ];*/
    static groups = {
        "Movement": { order: 10 },
        "Weapon": { order: 20 },
        "General": { order: 30 },
        "Subterfuge": { order: 40 },
        "Magical": { order: 50 },
        "Miscelaneous": { order: 60 },
        "Secondary": { order: 70 }
    };
    static modifiers = {
        difficulty: [
            { id: "Routine", value: 30, description: "MERP.Modifier.Routine" },
            { id: "Easy", value: 20, description: "MERP.Modifier.Easy" },
            { id: "Light", value: 10, description: "MERP.Modifier.Light" },
            { id: "Medium", value: 0, description: "MERP.Modifier.Medium" },
            { id: "Hard", value: -10, description: "MERP.Modifier.Hard" },
            { id: "Very Hard", value: -20, description: "MERP.Modifier.VeryHard" },
            { id: "Extremely Hard", value: -30, description: "MERP.Modifier.ExtremelyHard" },
            { id: "Sheer Folly", value: -50, description: "MERP.Modifier.SheerFolly" },
            { id: "Absurd", value: -70, description: "MERP.Modifier.Absurd" },
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