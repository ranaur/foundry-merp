import { Merp1eEffectCondition } from "./condition.js";
import { toKebabCase } from "../util.js";

export class Merp1eEffect extends ActiveEffect {
    static registerParts(templates) {
        this.registeredAdapters.forEach((adapter) => templates.push(adapter.templatePart));
    }

    static get registeredAdapterClasses() {
        return this.registeredAdapters.reduce((acc, cls) => { acc[cls.adapterName] = cls; return acc; }, {})
    }

    constructor(data, context) {
        // // From Carter_DC
        // //useless in the present case but cool
        // //creates a derived class for specific item types
        if ( data?.flags?.merp1e?.effectType in CONFIG.ActiveEffect.documentClasses && !context?.isExtendedClass) {
            return new CONFIG.ActiveEffect.documentClasses[data?.flags?.merp1e?.effectType](data,{...{isExtendedClass: true}, ...context});
        }    
        //default behavior, just call super and do random item inits.
        super(data, context);
        this._isActive = false;
    }

    prepareBaseData() {
        this.data.flags = mergeObject({
            merp1e: {
                conditionType: "AlwaysOn"
            }
        }, this.data.flags);
        this.data.icon ??= "icons/svg/aura.svg";
        super.prepareBaseData();
    }

    get conditionClass() {
        let conditionType = this.data.flags.merp1e?.conditionType;
        return Merp1eEffectCondition.registeredTypes.find((cls) => cls.conditionName == conditionType);
    }

    get condition() {
        return new this.conditionClass;
    }
    
    get effectType() {
        // GAMBIARRA XXX
        return this.getFlag("merp1e", "adapterName") ? this.getFlag("merp1e", "effectType") : "ItemEffect";
        //return this.getFlag("merp1e", "effectType");
        // END OF GAMBIARRA XXX
    }

    get effectName() {
        // GAMBIARRA XXX
        return this.getFlag("merp1e", "adapterName") || this.getFlag("merp1e", "effectType");
        //return this.getFlag("merp1e", "adapterName");
        // END OF GAMBIARRA XXX
    }

    get effectClass() {
        if(!this.effectType) return null;
        if(!this.effectName) return null;
        
        //return CONFIG.ActiveEffect.adapterClasses?.[this.effectType]?.[this.effectName];
        return CONFIG.ActiveEffect.documentClasses?.[this.effectType]?.registeredAdapterClasses?.[this.effectName];
    }

    get effectAdapter() {
        const cls = this.effectClass;
        if(!cls) return null;
        return new cls(this);
    }

    get name() {
        // GAMBIARRA XXX
        const gambi = this.getFlag("merp1e", "adapterName") ? "" : "*";
        // END OF GAMBIARRA XXX
        return (this.effectAdapter?.generateDescription?.() ||  game.i18n.localize("MERP1E.Effect.New")) + gambi;
    }

    get priority() {
        return this.condition?.priority || 100;
    }

    updateObject(event, formData) {
        return this.effectAdapter?.updateObject?.(event, formData);
    }

    static get defaultConfig() {
        return {
            transfer: false
        };
    }

    /** @override */
    apply(actor, change) {
        // disable
    }

    /* Methods that should be overloaded */
    /**
     * Apply the effect on actor
     */
    applyEffect(data) {
        if(!this.condition.isActive(this, data?.actor)) return;
        return this.effectAdapter?.applyEffect(data);
    }

    static getModifiers(data) {
        const modifiers = [];

        for(let effect of game.merp1e.Merp1eRules.globalEffect.effects) {
            if(effect.condition.isActive(effect, data?.actor)) {
                if(effect?.effectAdapter?.getModifier) {
                    const modifier = effect.effectAdapter.getModifier(data);
                    if(modifier) modifiers.push(modifier);
                }
            }
        }

        for(let item of data?.actor?.items) {
            for(let effect of item.effects) {
                if(effect.condition.isActive(effect, data?.actor)) {
                    if(effect?.effectAdapter?.getModifier) {
                        const modifier = effect.effectAdapter.getModifier(data);
                        if(modifier) modifiers.push(modifier);
                    }
                }
            }
        }
      
        return modifiers;
    }

    /**
     * Remove all effects for this type
     */
    static removeEffects(actor) {
        Object.values(actor.skills).forEach(skill => {
            skill.itemBonuses = skill.itemBonuses.filter((item) => item?.effectName != this.constructor.effectName);
        });
    }
}

export class Merp1eEffectAdapter {
    static get adapterType() {
        throw "Abstract class";
    };
    static get adapterName() {
        throw "Abstract class";
    };

    static get label() {
        return "MERP1E.EffectType." + this.adapterName;
    }

    static get templatePart() {
        const path = "systems/merp1e/templates/effect";
        const filename = toKebabCase(this.adapterName + this.adapterType) + "-part.html";
        return `${path}/${filename}`;
    }

    constructor(effect) {
        this._effect = effect;
    }

    get effect() {
        return this._effect;
    }

    getEffectFlag(name) {
        return this.effect.getFlag("merp1e",this.constructor.adapterName+"."+name)
        // return this._effect.data.flags?.merp1e?.[this.constructor.adapterName]?.[name]
    }

    async setEffectFlag(name, value) {
        return await this.effect.setFlag("merp1e",this.constructor.adapterName+"."+name, value);
        // const newData = {};
        // newData[`merp1e.${this.constructor.adapterName}.${name}`] = value;
        // this._effect.data.flags = mergeObject(this.data.flags, expandObject(newData));        
    }

    get parent() {
        return this.effect.parent;
    }

    static getData(sheetData) {
        return sheetData;
    }
}

