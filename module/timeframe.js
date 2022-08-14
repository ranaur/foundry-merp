import { findByID } from "./util.js";

export class Merp1eTimeframe {
    static timeframes = [
        { id: "seconds", label: "MERP1E.TimeFrame.Seconds", abbr: "MERP1E.TimeFrameAbbr.Seconds", seconds: 1 },
        { id: "rounds", label: "MERP1E.TimeFrame.Rounds", abbr: "MERP1E.TimeFrameAbbr.Rounds", seconds: 10 },
        { id: "minutes", label: "MERP1E.TimeFrame.Minutes", abbr: "MERP1E.TimeFrameAbbr.Minutes", seconds: 60 },
        { id: "hours", label: "MERP1E.TimeFrame.Hours", abbr: "MERP1E.TimeFrameAbbr.Hours", seconds: 3600 },
        { id: "days", label: "MERP1E.TimeFrame.Days", abbr: "MERP1E.TimeFrameAbbr.Days", seconds: 3600 * 24 },
        { id: "weeks", label: "MERP1E.TimeFrame.Weeks", abbr: "MERP1E.TimeFrameAbbr.Weeks", seconds: 3600 * 24 * 7 },
        { id: "months", label: "MERP1E.TimeFrame.Months", abbr: "MERP1E.TimeFrameAbbr.Months", seconds: 3600 * 24 * 30 },
    ];

    constructor(value, frameId = "seconds") {
        const frame = findByID(Merp1eTimeframe.timeframes, frameId, "seconds");
        this._seconds = value * frame?.seconds;
    }

    get seconds() {
        return this._seconds;
    }

    get frame() {
        return Merp1eTimeframe.timeframes.reduce((acc, tfr) => this.seconds % tfr.seconds == 0 ? tfr : acc, null);
    }

    get value() {
        return this.seconds / this.frame.seconds;
    }

    getValue(frameId)  {
        const frame = findByID(Merp1eTimeframe.timeframes, frameId, "seconds");
        return this.seconds / frame.seconds;
    }
}

export class Merp1eTimeframeHelper {
    static processGetData(sheetData, fieldFrame, fieldNumber, seconds) {
        sheetData.timeframes = Merp1eTimeframe.timeframes;
        if(seconds) {
            const tf = new Merp1eTimeframe(seconds);
            sheetData[fieldFrame] = tf.frame?.id;
            sheetData[fieldNumber] = tf.value;
        } else {
            sheetData[fieldFrame] = null;
            sheetData[fieldNumber] = null;
        }
        return;
    }

    static processUpdate(formData, fieldFrame, fieldNumber) {
        const tf = new Merp1eTimeframe(formData[fieldNumber], formData[fieldFrame]);
        return tf.seconds;
    }

}
