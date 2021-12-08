export class Merp1eInjuryHelper {
    static async onManageActiveEffect(event, owner) {
        event.preventDefault();
        const a = event.currentTarget;
        const effectAdapter = owner.object.effectAdapter;
        switch ( a.dataset.action ) {
            case "heal":
                const toHeal = document.getElementsByName("flags.merp1e.HitsPerRound.toHeal")[0].value;
                return await effectAdapter.heal(toHeal);
            case "treat":
                return await effectAdapter.applyTreatment();
            case "undotreat":
                return await effectAdapter.undoTreatment();
            case "loosentourniquet":
                return await effectAdapter.loosenTourniquet();
            case "doDay":
                return await effectAdapter.applyDay();
            case "doHour":
                return await effectAdapter.applyHour();
            case "doRound":
                return await effectAdapter.applyRound();
            case "delete":
                if(effectAdapter.constructor.adapterName == "HitsPerRound") {
                    // Create the hits effect representing all the bleeding
                    const hitsValue = effectAdapter.hitsValue;
                    if(hitsValue > 0) {
                        await owner.object.parent.createEmbeddedDocuments("ActiveEffect", [{
                            origin: owner.object.parent.uuid, // actor
                            disabled: false,
                            transfer: false,
                            flags: { 
                                merp1e: { 
                                    effectType: "InjuryEffect",
                                    adapterName: "Hits",
                                    Hits: {
                                        formula: hitsValue.toString(),
                                        description: game.i18n.localize("MERP1E.Injury.Bleeding"),
                                    }
                                }
                            },
                            canChangeAdapter: false
                        }], { render: false, renderSheet: true });
                    }
                } 
                
                return await owner.object.delete();
        }
    }

    static activateListeners(html, document) {
        html.find(".injury-control").click(ev => {
            Merp1eInjuryHelper.onManageActiveEffect(ev, document)
        });
    }   
}
