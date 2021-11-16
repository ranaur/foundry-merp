import { findByID } from "../util.js";

export class Merp1eRollTable extends RollTable {
    static SEPARATOR = ",";

    static types = [
        {id: "legacyTable", label: "LegacyTable" },
        {id: "attackTable", label: "AttackTable", columns: "pl,ch,rl,sl,no" },
        {id: "maneuverTable", label: "Maneuver Table" },
        {id: "criticalTable", label: "Critical Table" },
        {id: "backgroundOption", label: "Background Option" },
    ];

    get modifiers() {
        return this.data.flags?.merp1e?.modifiers;
    }
    get type() {
        return findByID(Merp1eRollTable.types, this.data?.flags?.merp1e?.type, "legacyTable");
    }
    
    get columns() {
        return this.type.columns.split(Merp1eRollTable.SEPARATOR);
    }
    get shortname() {
        return this.data?.flags?.merp1e?.shortname;
    }

    get reference() {
        return this.data?.flags?.merp1e?.reference;
    }

    get minimumValue() {
        return this.data.results.reduce((acc, rst) => rst.data.range[0] < acc ? rst.data.range[0] : acc, 999999);;
    }

    get maximumValue() {
        return this.data.results.reduce((acc, rst) => rst.data.range[1] > acc ? rst.data.range[1] : acc, -999999);
    }

    getResultsForRoll(value) {
        if(value < this.minimumValue) value = this.minimumValue;
        if(value > this.maximumValue) value = this.maximumValue;
        return super.getResultsForRoll(value);
    }

    getResultsForRollUM(firstDice) {
        if(firstDice < this.minimumValue) firstDice = this.minimumValue;
        if(firstDice > this.maximumValue) firstDice = this.maximumValue;
        const result = super.getResultsForRoll(firstDice);
        if(result.length == 1 && result[0].data.flags.merp1e.um) return result;
        return null;
    }

    lookupTable(firstDice, total, column) {
        if(this.type == "legacyTable") return getResultsForRoll(total);

        let resultLine;
        const UMResult = this.getResultsForRollUM(firstDice);
        if(UMResult) {
            resultLine = UMResult[0].getChatText();;
        } else { // regular roll, use total
            const TR = this.getResultsForRoll(total);

            if(TR.length != 1) return { type: "error", text: `${TR.length} results from UM roll ${total}` };

            resultLine = TR[0].getChatText();
        }

        // Process results
        if(this.columns) {
            if(typeof column === "string" && this.type.columns) {
                column = this.columns.indexOf(column);
            }
            const results = resultLine.split(Merp1eRollTable.SEPARATOR);
            return { type: "result", text: results[column]};
        }
        return { type: "result", text: resultLine};
    }
};
