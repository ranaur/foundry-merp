export function rollOpenEndedSync(high = true, low = true) {
    const MARGIN = 5; // Normal is 5
    let r = new Roll("1D100", {async: false});
    r.roll();
    r.toMessage();
    let total = r.total;
    let result = "".concat(r.total);
    console.log("first dice: " + r.total);
    let open = 0;
    if(high && r.total > (100 - MARGIN)) open = 1;
    if(low && r.total < (1 + MARGIN)) open = -1;
    while(open != 0) {
        let r = new Roll("1D100", {async: false});
        r.roll();
        r.toMessage();
        console.log("other dice: " + r.total);
        total += r.total * open;
        result = result.concat(open > 0 ? " + " : " - ").concat(r.total);
        if(r.total <= (100 - MARGIN)) open = 0;
    }
    this.data.rollResult = result;
    this.data.rollTotal = total;
}

export async function rollOpenEnded(high = true, low = true) {
    const MARGIN = 5; // Normal is 5
    let r = new Roll("1D100", {async: true});
    await r.roll();
    await r.toMessage();

    let total = r.total;
    let result = "".concat(r.total);
    console.log("first dice: " + r.total);
    let open = 0;
    if(high && r.total > (100 - MARGIN)) open = 1;
    if(low && r.total < (1 + MARGIN)) open = -1;
    while(open != 0) {
        let nr = new Roll("1D100", {async: true});
        await nr.roll();
        await nr.toMessage();
        console.log("other dice: " + nr.total);
        total += nr.total * open;
        result = result.concat(open > 0 ? " + " : " - ").concat(nr.total);
        if(nr.total <= (100 - MARGIN)) open = 0;
    }
    return { result: result, total: total };
}


export class Merp1eRollOpenEnded extends Roll {
    static NO = 0;
    static HIGH = 1;
    static LOW = 2;
    static HIGHLOW = 3;
    static MARGIN = 5; // open on 01-05 // 96-100
    constructor(formula, data, options = {}) {
        super("1D100", data, options);
        this._OEType = formula;
    }

    /* overload */
    evaluate(options) {
        if ( this._evaluated ) {
            throw new Error(`The ${this.constructor.name} has already been evaluated and is now immutable`);
        }
        this._open = 0;
        options.async=false
        super.evaluate(options);
        console.log('RollOpenEnded: First dice: ' + this.dice[0].total );
        if(this._OEType & Merp1eRollOpenEnded.HIGH && this.dice[0].total > (100 - Merp1eRollOpenEnded.MARGIN)) {
            console.log('RollOpenEnded: High open ended result!' );
            this._open = 1;
        }
        if(this._OEType & Merp1eRollOpenEnded.LOW && this.dice[0].total < (1 + Merp1eRollOpenEnded.MARGIN)) {
            console.log('RollOpenEnded: Low open ended result!' );
            this._open = -1;
        }

        while(this._open != 0) {
            this._evaluated = false;
            if(this._open > 0) {
                this.terms.push(new OperatorTerm({operator: "+"}))
            } else {
                this.terms.push(new OperatorTerm({operator: "-"}))
            }
            this.terms.push(new Die({number: 1, faces: 100}));
            super.evaluate(options);
            console.log('RollOpenEnded: next dice: ' + this.dice[this.dice.length - 1].total );
            if(this.dice[this.dice.length - 1].total <= (100 - Merp1eRollOpenEnded.MARGIN)) {
                this._open = 0;
            }
        }
        //this.showDiceRoll();
    }

	showDiceRoll(){
		if( game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(this);
		}
	}
}

