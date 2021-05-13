export class MerpSkill {
    static sheetOrder = [
        { id: "Movement", description: "MERP.SkillGroup.Movement", skills: ["NoArmor", "SoftLeather", "RigidLeather", "Chain", "Plate"] },
        { id: "Weapon", description: "MERP.SkillGroup.Weapon", skills: ["OneHandedEdged", "OneHandedConcussion", "TwoHanded", "Thrown", "Missile", "Polearms"] },
        { id: "General", description: "MERP.SkillGroup.General", skills: ["Climb", "Ride", "Swim", "Track"] },
        { id: "Subterfuge", description: "MERP.SkillGroup.Subterfuge", skills: ["Ambush", "StalkHide", "PickLock", "Disarmtrap"] },
        { id: "Magical", description: "MERP.SkillGroup.Magical", skills: ["ReadRunes", "UseItens", "DirectedSpells"] },
        { id: "Miscelaneous", description: "MERP.SkillGroup.Miscelaneous", skills: ["Perception", "BodyDevel", "BaseSpells", "LeadershipandInfluence", "DefensiveBonus", "EssenceRR", "ChannelingRR", "PoisonRR", "DiseaseRR"] },
        { id: "Secondary", description: "MERP.SkillGroup.Secondary", skills: ["Acrobatics", "Acting", "Caving", "Contortions", "Cookery", "Dance", "Diving", "Fletching", "Foraging", "Gambling", "Herding", "LeatherWorking", "Meditation", "Music", "PublicSpeaking", "RopeMastery", "Rowing", "Sailing", "Signaling", "Skiing", "Smithing", "StarGazing", "TrapBuilding", "Trickery", "Tumbling", "WeatherWatching", "WoodCarving"] }
    ];
    
    static list = {
        OneHandedEdged: {
            group: "Weapon",
            statBonus: "ST",
            rollType: "OB"
        },
        OneHandedConcussion: {
            group: "Weapon",
            statBonus: "ST",
            rollType: "OB"
        },
        TwoHanded: {
            group: "Weapon",
            statBonus: "ST",
            rollType: "OB"
        },
        Thrown: {
            group: "Weapon",
            statBonus: "AG",
            rollType: "OB"
        },
        Missile: {
            group: "Weapon",
            statBonus: "AG",
            rollType: "OB"
        },
        Polearms: {
            group: "Weapon",
            statBonus: "ST",
            rollType: "OB"
        },
        Climb: {
            group: "General",
            statBonus: "AG",
            rollType: "MM"
        },
        Ride: {
            group: "General",
            statBonus: "IT",
            rollType: "MM"
        },
        Swim: {
            group: "General",
            statBonus: "AG",
            rollType: "MM"
        },
        Track: {
            group: "General",
            statBonus: "IG",
            rollType: "SM"
        },
        Ambush: {
            group: "Subterfuge",
            rollType: "SP"
        },
        StalkHide: {
            group: "Subterfuge",
            statBonus: "PR",
            rollType: "SP"
        },
        PickLock: {
            group: "Subterfuge",
            statBonus: "IG",
            rollType: "SM"
        },
        Disarmtrap: {
            group: "Subterfuge",
            statBonus: "IT",
            rollType: "SM"
        },
        ReadRunes: {
            group: "Magical",
            statBonus: "IG",
            rollType: "SM"
        },
        UseItens: {
            group: "Magical",
            statBonus: "IT",
            rollType: "SM"
        },
        DirectedSpells: {
            group: "Magical",
            statBonus: "AG",
            rollType: "OB"
        },
        Perception: {
            group: "Miscelaneous",
            statBonus: "IT",
            rollType: "SM"
        },
        BodyDevel: {
            group: "Miscelaneous",
            statBonus: "CO",
            rollType: "SP",
            extra: 5
        },
        BaseSpells: {
            group: "Miscelaneous",
            rollType: "OB"
        },
        LeadershipandInfluence: {
            group: "Miscelaneous",
            statBonus: "PR",
            rollType: "SM"
        },
        DefensiveBonus: {
            group: "Miscelaneous",
            statBonus: "AG",
            rollType: "DB"
        },
        EssenceRR: {
            group: "Miscelaneous",
            statBonus: "IG",
            rollType: "RR"
        },
        ChannelingRR: {
            group: "Miscelaneous",
            statBonus: "IT",
            rollType: "RR"
        },
        PoisonRR: {
            group: "Miscelaneous",
            statBonus: "CO",
            rollType: "RR"
        },
        DiseaseRR: {
            group: "Miscelaneous",
            statBonus: "CO",
            rollType: "RR"
        },
        Acrobatics: {
            group: "Secondary",
            statBonus: "AG",
            rollType: "MM"
        },
        Acting: {
            group: "Secondary",
            statBonus: "PR",
            rollType: "SM"
        },
        Caving: {
            group: "Secondary",
            statBonus: "IG",
            rollType: "SM"
        },
        Contortions: {
            group: "Secondary",
            statBonus: "AG",
            rollType: "MM"
        },
        Cookery: {
            group: "Secondary",
            statBonus: "IT",
            rollType: "SM"
        },
        Dance: {
            group: "Secondary",
            statBonus: "IG",
            rollType: "MM"
        },
        Diving: {
            group: "Secondary",
            statBonus: "AG",
            rollType: "SM"
        },
        Fletching: {
            group: "Secondary",
            statBonus: "AG",
            rollType: "SM"
        },
        Foraging: {
            group: "Secondary",
            statBonus: "IT",
            rollType: "SM"
        },
        Gambling: {
            group: "Secondary",
            statBonus: "IT",
            rollType: "SM"
        },
        Herding: {
            group: "Secondary",
            statBonus: "PR",
            rollType: "SM"
        },
        LeatherWorking: {
            group: "Secondary",
            statBonus: "AG",
            rollType: "SM"
        },
        Meditation: {
            group: "Secondary",
            statBonus: "PR",
            rollType: "SM"
        },
        Music: {
            group: "Secondary",
            statBonus: "AG",
            rollType: "SM"
        },
        PublicSpeaking: {
            group: "Secondary",
            statBonus: "PR",
            rollType: "SM"
        },
        RopeMastery: {
            group: "Secondary",
            statBonus: "IG",
            rollType: "SM"
        },
        Rowing: {
            group: "Secondary",
            statBonus: "ST",
            rollType: "MM"
        },
        Sailing: {
            group: "Secondary",
            statBonus: "IT",
            rollType: "MM"
        },
        Signaling: {
            group: "Secondary",
            statBonus: "IG",
            rollType: "SM"
        },
        Skiing: {
            group: "Secondary",
            statBonus: "AG",
            rollType: "MM"
        },
        Smithing: {
            group: "Secondary",
            statBonus: "ST",
            rollType: "SM"
        },
        StarGazing: {
            group: "Secondary",
            statBonus: "IT",
            rollType: "SM"
        },
        TrapBuilding: {
            group: "Secondary",
            statBonus: "IG",
            rollType: "SM"
        },
        Trickery: {
            group: "Secondary",
            statBonus: "PR",
            rollType: "SM"
        },
        Tumbling: {
            group: "Secondary",
            statBonus: "AG",
            rollType: "MM"
        },
        WeatherWatching: {
            group: "Secondary",
            statBonus: "IT",
            rollType: "SM"
        },
        WoodCarving: {
            group: "Secondary",
            statBonus: "AG",
            rollType: "SM"
        }
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
    }
};