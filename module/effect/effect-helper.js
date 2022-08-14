export class Merp1eActiveEffectHelper extends ActiveEffect {
    isSuppressed = false;

    static async onManageActiveEffect(event, owner) {
        event.preventDefault();
        const a = event.currentTarget;
        //const effectElement = a.closest("li") && a.closest("span");
        const effectElement = a.closest("[data-effect-id]");
        const effect = effectElement?.dataset?.effectId ? owner.effects.get(effectElement.dataset.effectId) : null;
        switch ( a.dataset.action ) {
            case "create":
                return await owner.createEmbeddedDocuments("ActiveEffect", [{
                    label: game.i18n.localize("Merp1e.ActiveEffect.New"),
                    origin: owner.uuid,
                    disabled: false,
                    transfer: false,
                    flags: { 
                        merp1e: { 
                            effectType: a.dataset.effectType,
                            adapterName: a.dataset.adapterName,
                        }
                    },
                    canChangeAdapter: a.dataset.adapterName ? true: false
                }], { render: true, renderSheet: true });
            case "edit":
                let shouldEdit = !owner.isOwned;
                return await effect.sheet.render(true, {editable: shouldEdit});
            case "delete":
                return await effect.delete();
            case "toggle":
                return await effect.update({disabled: !effect.data.disabled});
            
        }
    }

    static activateListeners(html, document) {
        html.find(".effect-control").click(ev => {
            Merp1eActiveEffectHelper.onManageActiveEffect(ev, document)
        });
    }   

    static getDataHelper(item, sheetData) {
        sheetData.itemEffects = item.effects.reduce((acc, effect) => { acc.push({
            id: effect.id,
            data: {
              icon: effect.data.icon,
              disabled: effect.data.disabled
            },
            name: effect.name
          }); return acc;}, []);
    }
}