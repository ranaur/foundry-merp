export class TableBT5 {
    static name = "Encumbrance Penalty Table";
    static reference = "MERP p32";
    static id = "BT-5";
    static columns = [
        "CHARACTER'S WEIGHT",
        "25",
        "35",
        "45",
        "60",
        "80",
        "100",
        "120",
        "140",
        "160"
    ];
    static table = [
        [  41,	0,	"NA", "NA", "NA",	"NA",	"NA",	"NA",	"NA",	"NA",	"NA"],
        [  60,	0,	  30,   60, "NA",	"NA",	"NA",	"NA",	"NA",	"NA",	"NA"],
        [  80,	0,	  20,   35,   60,	  80,	"NA",	"NA",	"NA",	"NA",	"NA"],
        [ 100,	0,	  15,   25,   40,	  60,	"NA",	"NA",	"NA",	"NA",	"NA"],
        [ 120,	0,	  15,   20,   30,	  40,	  60,	"NA",	"NA",	"NA",	"NA"],
        [ 140,	0,	  10,   15,   25,	  35,	  40,	  60,	"NA",	"NA",	"NA"],
        [ 160,	0,	  10,   15,   20,	  30,	  35,	  40,	  60,	"NA",	"NA"],
        [ 180,	0,	   5,   10,   15,	  25,	  30,	  35,	  45,	  60,	"NA"],
        [ 200,	0,	   5,   10,   15,	  20,	  25,	  30,	  35,	  50,	  60],
        [ 220,	0,	   5,   10,   15,	  20,	  25,	  30,	  35,	  45,	  55],
        [ 240,	0,	   0,   10,   10,	  15,	  20,	  25,	  30,	  40,	  50],
        [ 260,	0,	   0,   10,   10,	  15,	  20,	  25,	  30,	  35,	  45],
        [ 280,	0,	   0,    5,   10,	  15,	  15,	  20,	  25,	  30,	  40],
        [ 300,	0,	   0,    5,    5,	  10,	  15,	  20,	  25,	  30,	  35],
        [ 350,	0,	   0,    0,    5,	  10,	  10,	  20,	  25,	  25,	  35],
        [ 400,	0,	   0,    0,	   0,	   5,	  10,	  15,	  20,	  25,	  30],
    ]; 
};

export class TableBT5Aux {
    static name = "Encumbrance Penalty Table (Aux)";
    static reference = "MERP p32";
    static id = "BT-5Aux";
    static columns = [
        "WEIGHT CARRIED",
    ];
    static table = [
        [ 15, 1 ],
        [ 25, 2 ],
        [ 35, 3 ],
        [ 45, 4 ],
        [ 60, 5 ],
        [ 80, 6 ],
        [ 100, 7 ],
        [ 120, 8 ],
        [ 140, 9 ],
        [ 160, 10 ]
    ]; 
};

