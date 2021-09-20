import { findByID } from "./util.js";

export class Merp1eModifier {
    static enableFunctions = [
        { id: "always", label: "MERP1E.ModifierEnableFunctions.always", func: (data) => true },
        { id: "userChosen", label: "MERP1E.ModifierEnableFunctions.userChosen", func: (data) => true  },
        { id: "isStunned", label: "MERP1E.ModifierEnableFunctions.isStunned", func: (data) => data.actor?.health?.isStunned },
        { id: "isDown", label: "MERP1E.ModifierEnableFunctions.isDown", func: (data) => data.actor?.health?.isDown },
        { id: "isLimbOut", label: "MERP1E.ModifierEnableFunctions.isLimbOut", func: (data) => data.actor?.health?.isLimbOut },
    ];
    static valueFunctions = [
        { id: "constant", label: "MERP1E.ModifierValueFunctions.constant", func: (data) => data.value },
        { id: "adHoc", label: "MERP1E.ModifierValueFunctions.adHoc", func: (data) => null },
        { id: "level", label: "MERP1E.ModifierValueFunctions.level", func: (data) => data.actor?.level },
        { id: "-spellLevel", label: "MERP1E.ModifierValueFunctions.minusSpellLevel", func: (data) => - data.spell?.level },
    ];

    static get defaultOptions() {
        return {
            enableFunction: "userChosen",
            valueFunction: "constant",
            value: 0,
            choosed: false,
            label: "MERP1E.Modifier.unknown"
        };
    }

    /**
     * @modifierData: data for the raw modifier. The expected fields are:
     *  {
     *      value: 0,            // value to add or subtract. If null, ask the value to user/gm
     *      enableFunction: null // function(data) that returns true/false if the value must be applied to roll *
     *      valueFunction:       // if it is a function, execute the function to calculate and sets on value
     *      label: ""            // label to show on the roll
     *   }
     * 
     *  @data: data can have { actor, skill, spell, value, choosen }
     */
    constructor(modifierData) {
        Object.assign(this, mergeObject(this.constructor.defaultOptions, modifierData));
        if("enableFunction" in this) {
            if(typeof this.enableFunction !== "function") {
                let modFunc = findByID(Merp1eModifier.enableFunctions, this.enableFunction, null);
                if(modFunc) {
                    this.enableFunc = modFunc.func;
                }
            } else { // typeof modifierData.enableFunction === "function"
                this.enableFunc = this.enableFunction;
            }
        }

        if("valueFunction" in this) {
            if(typeof this.valueFunction !== "function") {
                let modFunc = findByID(Merp1eModifier.valueFunctions, this.valueFunction, null);
                if(modFunc) {
                    this.valueFunc = modFunc.func;
                }
            } else { // typeof modifierData.enableFunction === "function"
                this.valueFunc = this.valueFunction;
            }
        }
    }
    evaluate(data) {
        data.id = this.id;
        data.choosed = this.choosed;
        if(this.enableFunc) {
            this.enabled = this.enableFunc(data);
        } else {
            console.error(`Merp1eModifier.constructor: could not find enable function ${modifierData.enableFunction}`);
        }

        if(this.valueFunc) {
            if(!this.isConstant) this.value = this.valueFunc(data);
        } else {
            console.error(`Merp1eModifier.constructor: could not find value function ${modifierData.valueFunction}`);
        }
        return true;
    }
    get isAdHoc() {
        return this.valueFunction == "adHoc";
    }
    get isUserChosen() {
        return this.enableFunction == "userChosen";
    }
    get isConstant() {
        return this.valueFunction == "constant";
    }

}
export class Merp1eModifiers {
    constructor(id, label, modifierData) {
        this.id = id;
        this.label = label;
        this.modifiers = [];
        this.add(modifierData);
    }
    
    /**
     * returns an index to be used as:
     *  mods.value[id] => value for the id
     */
    get value() {
        return this.modifiers.reduce((acc, mod) => { acc[mod.id] = mod.value; return acc; }, {});
    }

    add(modifierData) {
        if(!modifierData) return;
        Object.values(modifierData).forEach((mod) => {
            mod.id = mod.id || this.id + ":" + this.modifiers.length;
            this.modifiers.push(new Merp1eModifier(mod));
        });
        return;
    }

    evaluate(data) {
        this.modifiers.forEach((mod) => mod.evaluate(data));
    }

    getTotal(choosedModifiers, values) {
        if(choosedModifiers) Object.entries(choosedModifiers).forEach(([id, choosed]) => {
            const mod = findByID(this.modifiers, id);
            if(mod) mod.choosed = choosed;
        });
        if(values) Object.entries(values).forEach(([id, value]) => {
            const mod = findByID(this.modifiers, id);
            if(mod) mod.value = parseInt(value);
        });
        return this.modifiers.reduce((acc, mod) => {
            if(mod.enabled) {
                if(mod.enableFunction == "userChosen") {
                    if(mod.choosed) {
                        return acc + mod.value;
                    }
                } else {
                    return acc + mod.value;
                }
            }
            return acc;
        }, 0);
    
    }
}