export class Merp1eModifier {
    constructor(modifierData, actor, skill) {
        this.optional = modifierData.optional || false;
        this.enabled = modifierData.enabled || true;
        if("enableFunction" in modifierData) {
            this.enabled = modifierData.enableFunction(actor, skill);
        }
        if("optionalFunction" in modifierData) {
            this.optional = modifierData.optionalFunction(actor, skill);
        }
        this.id = modifierData.id;
        this.value = modifierData.value;
        this.label = modifierData.label;
    }
}
export class Merp1eModifiers {
    constructor(modifierData, actor, item) {
        this.modifiers = [];
        this.add(modifierData, actor, item);
    }
    
    /**
     * returns an index to be used as:
     *  mods.value[id] => value for the id
     */
    get value() {
        return this.modifiers.reduce((acc, mod) => { acc[mod.id] = mod.value; return acc; }, {});
    }

    add(modifierData, actor, item) {
        this.modifiers = modifierData.reduce((acc, mod) => {
            mod.id = mod.id || acc.length;
            acc.push(new Merp1eModifier(mod, actor, item));
            return acc;
        }, this.modifiers);
    }

    getTotal(choosed, values) {
        return this.modifiers.reduce((acc, mod) => {
            let value = mod.value || 0;
            if(values && mod.id in values) value = parseInt(values[mod.id]);
            if(mod.enabled) {
                if(mod.optional) {
                    if(choosed && choosed[mod.id]) {
                        return acc + value;
                    }
                } else {
                    return acc + value;
                }
            }
            return acc;
        }, 0);
    
    }
}