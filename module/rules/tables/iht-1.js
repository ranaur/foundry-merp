import { lookupTable } from "../../util.js";

export class TableIHT1 {
    static name = "Stat Deterioration Table";
    static reference = "MERP p42";
    static id = "IHT-5";
    static columns = [
        "ROLL",
        "1-6",
        "7-17",
        "18+",
    ];
    static table = [
        [ 10, 0, 0, 0 ],
        [ 25, 0, 0, 1 ],
        [ 30, 0, 1, 2 ],
        [ 75, 1, 2, 3 ],
        [ 90, 1, 2, 4 ],
        [ 100, 1, 1, 5 ],
    ];
    static lookup(roll, column) {
        let c;
        if(column >= 18) c = 3;
        if(column >= 7) c = 2;
        if(column >= 1) c = 1;

        lookupTable(this, roll, c);
    }
};

