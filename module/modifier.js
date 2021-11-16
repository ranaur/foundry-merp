import { findByID } from "./util.js";

export class Merp1eModifier {
    static enableFunctions = [
        { id: "always", label: "MERP1E.ModifierEnableFunctions.always", func: (data) => true },
        { id: "userChosen", label: "MERP1E.ModifierEnableFunctions.userChosen", func: (data) => true  },
        { id: "isStunned", label: "MERP1E.ModifierEnableFunctions.isStunned", func: (data) => data.actor?.health?.isStunned },
        { id: "isDown", label: "MERP1E.ModifierEnableFunctions.isDown", func: (data) => data.actor?.health?.isDown },
        { id: "isLimbOut", label: "MERP1E.ModifierEnableFunctions.isLimbOut", func: (data) => data.actor?.health?.isLimbOut },
        { id: "heatFireAttack", label: "MERP1E.ModifierEnableFunctions.HeatFireAttack", func: (data) => true /* /* XXX FIX for attack type */ },
        { id: "coldIceAttack", label: "MERP1E.ModifierEnableFunctions.ColdIceAttack", func: (data) => true /* /* XXX FIX for attack type */ }
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
            label: ""
        };
    }

    /**
     * @modifierData: data for the raw modifier. The expected fields are:
     *  {
     *      value: 0,            // value to add or subtract. If null, ask the value to user/gm
     *      enableFunction: null // function(data) that returns true/false if the value must be applied to roll *
     *      valueFunction:       // if it is a function, execute the function to calculate and sets on value
     *      label: ""            // label to show on the roll
     *  -- optional --
     *      itemId: null         // item that creates the modifier
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
        return ["userChosen", "heatFireAttack", "coldIceAttack"].includes(this.enableFunction); /* XXX FIX for attack type */
    }

    get isConstant() {
        return this.valueFunction == "constant";
    }

}
export class Merp1eModifiers {
    constructor(id, label, modifiersData) {
        this.id = id;
        this.label = label;
        this.modifiers = [];
        this.add(modifiersData);
    }
    
    /**
     * returns an index to be used as:
     *  mods.value[id] => value for the id
     */
    get value() {
        return this.modifiers.reduce((acc, mod) => { acc[mod.id] = mod.value; return acc; }, {});
    }

    add(modifiersData) {
        if(!modifiersData) return;
        Object.values(modifiersData).forEach((mod) => {
            mod.id = mod.id || this.id + ":" + this.modifiers.length;
            this.modifiers.push(new Merp1eModifier(mod));
        });
        return;
    }

    evaluate(data) {
        this.modifiers.forEach((mod) => mod.evaluate(data));
    }

    getTotal(choosedModifiers, choosedValues) {
        if(choosedModifiers) Object.entries(choosedModifiers).forEach(([id, choosed]) => {
            const mod = findByID(this.modifiers, id);
            if(mod) mod.choosed = choosed;
        });

        if(choosedValues) Object.entries(choosedValues).forEach(([id, value]) => {
            const mod = findByID(this.modifiers, id);
            if(mod) mod.value = parseInt(value) || 0;
        });
        return this.modifiers.reduce((acc, mod) => {
            if(mod.enabled) {
                if(mod.isUserChosen) {
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

export class Merp1eModifiersHelper {
    constructor(modifiersRoot) {
        this.modifiersRoot = modifiersRoot;
    }

    async onClick(event, sheet) {
        event.preventDefault();
        const a = event.currentTarget;
        const list = a.closest('ol');

        switch ( a.dataset.action ) {
            case "create":
                const newModifierHTML = await renderTemplate( "systems/merp1e/templates/parts/modifiers-line.html", {
                    modifierData: Merp1eModifier.defaultOptions,
                    modifierPath: this.modifiersRoot + "." + (list.childElementCount - 1),
                    modifierValueFunctions: Merp1eModifier.valueFunctions,
                    modifierEnableFunctions: Merp1eModifier.enableFunctions
                });

                let newElement = document.createElement("li");
                var att = document.createAttribute("class");
                att.value = "table-result modifier flexrow";
                newElement.setAttributeNode(att); ;
                newElement.innerHTML = newModifierHTML;
          
                list.appendChild(newElement);
                //return await sheet.submit();
                break;
            case "delete":
                const listItem = a.closest('.modifier');
                list.removeChild(listItem);
                //return await sheet.submit();
                break;
        }
    }

    activateListeners(html, document) {
        html.find(".modifiers-control").click(ev => {
            this.onClick(ev, document)
        });
    }   

    getData(sheetData) {
        sheetData.modifierValueFunctions = Merp1eModifier.valueFunctions;
        sheetData.modifierEnableFunctions = Merp1eModifier.enableFunctions;
        sheetData.modifiersRoot = this.modifiersRoot;
    }

    updateObject(formData) {
        const modifiersData = Object.keys(formData).reduce((acc, key) => {
            if(key.startsWith(this.modifiersRoot)) acc[key.substr(this.modifiersRoot.length + 1)] = formData[key];
            return acc;
        }, {});
        const modifiers = Object.values(expandObject(modifiersData));
        
        // remove entries
        formData = Object.entries(formData).filter(e => !e[0].startsWith(this.modifiersRoot)).reduce((obj, e) => {
            obj[e[0]] = e[1];
            return obj;
          }, {});
        // save as array
        formData[this.modifiersRoot] = modifiers;

        return formData;
    }
}