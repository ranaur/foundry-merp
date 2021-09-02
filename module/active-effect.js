import "./util.js";

class Merp1eActiveEffectBase {
    applyEffect() {
        console.log("Must implement!");
    }
}

class Merp1eActiveEffectSkillBonus extends Merp1eActiveEffectBase {
    static label = "MERP1E.EffectType.SkillBonus";
    static effectName = "SkillBonus";

}


export class Merp1eActiveEffect extends ActiveEffect {

    /*
    data.effect.type = 

    */

    static effectTypes = [
        Merp1eActiveEffectSkillBonus
        //{ name: "", label: "MERP1E.EffectType.", class: null },
    ];
    
    
    constructor(data, context)
    {
        super(data, context);

        let type = data.data?.type || null;
        let effectClass = Merp1eActiveEffect.effectTypes.reduce( (acc, cls) => { return (cls.name == type) ? cls : acc }, null);
        if(effectClass) copyClassFunctions(new effectClass());
        else console.log(`Class ${type} not found!`);
    }

/*
    /** @override * /
    get sourceName()
    {
        let sourceName = super.sourceName
    }
    
    get show() {
        if (game.user.isGM)
        return true
        else 
        return false
    }
    
    get isDisabled() {
        return this.data.disabled
    }
*/    
}