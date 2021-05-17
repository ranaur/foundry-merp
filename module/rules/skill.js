export class MerpSkill {
    static sheetOrder = [
        { id: "Movement", skills: ["NoArmor", "SoftLeather", "RigidLeather", "Chain", "Plate"] },
        { id: "Weapon", skills: ["OneHandedEdged", "OneHandedConcussion", "TwoHanded", "Thrown", "Missile", "Polearms"] },
        { id: "General", skills: ["Climb", "Ride", "Swim", "Track"] },
        { id: "Subterfuge", skills: ["Ambush", "StalkHide", "PickLock", "Disarmtrap"] },
        { id: "Magical", skills: ["ReadRunes", "UseItens", "DirectedSpells"] },
        { id: "Miscelaneous", skills: ["Perception", "BodyDevel", "BaseSpells", "LeadershipandInfluence", "DefensiveBonus", "EssenceRR", "ChannelingRR", "PoisonRR", "DiseaseRR"] },
        { id: "Secondary", skills: ["Acrobatics", "Acting", "Caving", "Contortions", "Cookery", "Dance", "Diving", "Fletching", "Foraging", "Gambling", "Herding", "LeatherWorking", "Meditation", "Music", "PublicSpeaking", "RopeMastery", "Rowing", "Sailing", "Signaling", "Skiing", "Smithing", "StarGazing", "TrapBuilding", "Trickery", "Tumbling", "WeatherWatching", "WoodCarving"] }
    ];
    
    static list = {
        NoArmor: {
            group: "Movement",
            statBonus: "ag",
            rollType: "MM",
            extra: 0,
            maxRanks: 2
        },
        SoftLeather: {
            group: "Movement",
            statBonus: "ag",
            rollType: "MM",
            extra: -15,
            maxRanks: 3
        },
        RigidLeather: {
            group: "Movement",
            statBonus: "ag",
            rollType: "MM",
            extra: -30,
            maxRanks: 5
        },
        Chain: {
            group: "Movement",
            statBonus: "st",
            rollType: "MM",
            extra: -45,
            maxRanks: 7
        },
        Plate: {
            group: "Movement",
            statBonus: "st",
            rollType: "MM",
            extra: -60,
            maxRanks: 9
        },        
        OneHandedEdged: {
            group: "Weapon",
            statBonus: "st",
            rollType: "OB"
        },
        OneHandedConcussion: {
            group: "Weapon",
            statBonus: "st",
            rollType: "OB"
        },
        TwoHanded: {
            group: "Weapon",
            statBonus: "st",
            rollType: "OB"
        },
        Thrown: {
            group: "Weapon",
            statBonus: "ag",
            rollType: "OB"
        },
        Missile: {
            group: "Weapon",
            statBonus: "ag",
            rollType: "OB"
        },
        Polearms: {
            group: "Weapon",
            statBonus: "st",
            rollType: "OB"
        },
        Climb: {
            group: "General",
            statBonus: "ag",
            rollType: "MM"
        },
        Ride: {
            group: "General",
            statBonus: "it",
            rollType: "MM"
        },
        Swim: {
            group: "General",
            statBonus: "ag",
            rollType: "MM"
        },
        Track: {
            group: "General",
            statBonus: "ig",
            rollType: "SM"
        },
        Ambush: {
            group: "Subterfuge",
            rollType: "SP"
        },
        StalkHide: {
            group: "Subterfuge",
            statBonus: "pr",
            rollType: "SP"
        },
        PickLock: {
            group: "Subterfuge",
            statBonus: "ig",
            rollType: "SM"
        },
        Disarmtrap: {
            group: "Subterfuge",
            statBonus: "it",
            rollType: "SM"
        },
        ReadRunes: {
            group: "Magical",
            statBonus: "ig",
            rollType: "SM"
        },
        UseItens: {
            group: "Magical",
            statBonus: "it",
            rollType: "SM"
        },
        DirectedSpells: {
            group: "Magical",
            statBonus: "ag",
            rollType: "OB"
        },
        Perception: {
            group: "Miscelaneous",
            statBonus: "it",
            rollType: "SM"
        },
        BodyDevel: {
            group: "Miscelaneous",
            statBonus: "co",
            rollType: "SP",
            extra: 5
        },
        BaseSpells: {
            group: "Miscelaneous",
            rollType: "OB"
        },
        LeadershipandInfluence: {
            group: "Miscelaneous",
            statBonus: "pr",
            rollType: "SM"
        },
        DefensiveBonus: {
            group: "Miscelaneous",
            statBonus: "ag",
            rollType: "DB"
        },
        EssenceRR: {
            group: "Miscelaneous",
            statBonus: "ig",
            rollType: "RR"
        },
        ChannelingRR: {
            group: "Miscelaneous",
            statBonus: "it",
            rollType: "RR"
        },
        PoisonRR: {
            group: "Miscelaneous",
            statBonus: "co",
            rollType: "RR"
        },
        DiseaseRR: {
            group: "Miscelaneous",
            statBonus: "co",
            rollType: "RR"
        },
        Acrobatics: {
            group: "Secondary",
            statBonus: "ag",
            rollType: "MM"
        },
        Acting: {
            group: "Secondary",
            statBonus: "pr",
            rollType: "SM"
        },
        Caving: {
            group: "Secondary",
            statBonus: "ig",
            rollType: "SM"
        },
        Contortions: {
            group: "Secondary",
            statBonus: "ag",
            rollType: "MM"
        },
        Cookery: {
            group: "Secondary",
            statBonus: "it",
            rollType: "SM"
        },
        Dance: {
            group: "Secondary",
            statBonus: "ig",
            rollType: "MM"
        },
        Diving: {
            group: "Secondary",
            statBonus: "ag",
            rollType: "SM"
        },
        Fletching: {
            group: "Secondary",
            statBonus: "ag",
            rollType: "SM"
        },
        Foraging: {
            group: "Secondary",
            statBonus: "it",
            rollType: "SM"
        },
        Gambling: {
            group: "Secondary",
            statBonus: "it",
            rollType: "SM"
        },
        Herding: {
            group: "Secondary",
            statBonus: "pr",
            rollType: "SM"
        },
        LeatherWorking: {
            group: "Secondary",
            statBonus: "ag",
            rollType: "SM"
        },
        Meditation: {
            group: "Secondary",
            statBonus: "pr",
            rollType: "SM"
        },
        Music: {
            group: "Secondary",
            statBonus: "ag",
            rollType: "SM"
        },
        PublicSpeaking: {
            group: "Secondary",
            statBonus: "pr",
            rollType: "SM"
        },
        RopeMastery: {
            group: "Secondary",
            statBonus: "ig",
            rollType: "SM"
        },
        Rowing: {
            group: "Secondary",
            statBonus: "st",
            rollType: "MM"
        },
        Sailing: {
            group: "Secondary",
            statBonus: "it",
            rollType: "MM"
        },
        Signaling: {
            group: "Secondary",
            statBonus: "ig",
            rollType: "SM"
        },
        Skiing: {
            group: "Secondary",
            statBonus: "ag",
            rollType: "MM"
        },
        Smithing: {
            group: "Secondary",
            statBonus: "st",
            rollType: "SM"
        },
        StarGazing: {
            group: "Secondary",
            statBonus: "it",
            rollType: "SM"
        },
        TrapBuilding: {
            group: "Secondary",
            statBonus: "ig",
            rollType: "SM"
        },
        Trickery: {
            group: "Secondary",
            statBonus: "pr",
            rollType: "SM"
        },
        Tumbling: {
            group: "Secondary",
            statBonus: "ag",
            rollType: "MM"
        },
        WeatherWatching: {
            group: "Secondary",
            statBonus: "it",
            rollType: "SM"
        },
        WoodCarving: {
            group: "Secondary",
            statBonus: "ag",
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
    };
};