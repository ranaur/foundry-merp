export class Merp1eCalendar {
    static ReckoningOfMerp = [
        "Yestarë", 1
        "Narwain", 
        "Ninui", 
        "Gwaeron", 
        "Gwirith", 
        "Lothron" 
        "Nórui" 
        "Loénde", 1
        "Cerveth", 
        "Úrui", 
        "Ivanneth", 
        "Narbeleth", 
        "Hithui", 
        "Girithron", 
        "Mettaré", 1
    ];

    static ReckoningOfRivendell = [
        { name: "Yestarë", numDays: 1, sindarin: "" },
        { name: "Tuilë", numDays: 54, sindarin: "Ethuil" },
        { name: "Lairë", numDays: 72, sindarin: "Laer" },
        { name: "Yávië", numDays: 54, sindarin: "Iavas" },
        { name: "Enderi", numDays: 3, leap: [1 12, 144*3 ] },
        { name: "Enderi", numDays: 6, leap: [12, 144*3 ] },
        { name: "Quellë", numDays: 54, sindarin: "Firith" },
        { name: "Hrívë", numDays: 72, sindarin: "Rhîw" },
        { name: "Coirë", numDays: 54, sindarin: "Echuir" },
        { name: "Mettarë", numDays: 1, sindarin: "" },
    ];

    static ShireReckoning = [
        { name: "Yule", numDays: 1 },
        { name: "Afteryule", numDays: 30 },
        { name: "Solmath", numDays: 30 },
        { name: "Rethe", numDays: 30 },
        { name: "Astron", numDays: 30 },
        { name: "Thrimidge", numDays: 30 },
        { name: "Forelithe", numDays: 30 },
        { name: "Lithe", numDays: 1 },
        { name: "Mid", numDays: 1 },
        { name: "Lithe", numDays: 1 },
        { name: "Overlithe", numDays: 1, leap: [4, 100, 3240] },
        { name: "Afterlithe", numDays: 30 },
        { name: "Wedmath", numDays: 30 },
        { name: "Halimath", numDays: 30 },
        { name: "Winterfilth", numDays: 30 },
        { name: "Blotmath", numDays: 30 },
        { name: "Foreyule", numDays: 30 },
        { name: "Yule", numDays: 1 },
    ];

    static KingsReckoning = [ 
        { name: "yestarë", numDays: 1 },
        { name: "january", numDays: 30 },
        { name: "february", numDays: 30 },
        { name: "march", numDays: 30 },
        { name: "april", numDays: 30 },
        { name: "may", numDays: 30 },
        { name: "june", numDays: 31 },
        { name: "loëndë", numDays: 1, leap: [1, 4, 100] },
        { name: "enderi", numDays: 2, leap: [4, 100] },
        { name: "july", numDays: 31 },
        { name: "august", numDays: 30 },
        { name: "september", numDays: 30 },
        { name: "october", numDays: 30 },
        { name: "november", numDays: 30 },
        { name: "december", numDays: 30 },
        { name: "mettarë", numDays: 1 },
    ];
    static StewardsReckoning = [ 
        { name: "yestarë", numDays: 1 },
        { name: "january", numDays: 30 },
        { name: "february", numDays: 30 },
        { name: "march", numDays: 30 },
        { name: "tuilérë", numDays: 1 },
        { name: "april", numDays: 30 },
        { name: "may", numDays: 30 },
        { name: "june", numDays: 30 },
        { name: "loëndë", numDays: 1, leap: [1, 4, 100] },
        { name: "enderi", numDays: 2, leap: [4, 100] },
        { name: "july", numDays: 30 },
        { name: "august", numDays: 30 },
        { name: "september", numDays: 30 },
        { name: "yáviérë", numDays: 1 },
        { name: "october", numDays: 30 },
        { name: "november", numDays: 30 },
        { name: "december", numDays: 30 },
        { name: "mettarë", numDays: 1 },
    ];

    static daysOfWeek = [
        "Sterday",
        "Sunday",
        "Monday",
        "Trewsday",
        "Hevensday",
        "Mersday",
        "Highday",
    ];
}