export class Merp1eActiveEffect extends ActiveEffect {
    isSuppressed = false;

    static onManageActiveEffect(event, owner) {
        event.preventDefault();
        const a = event.currentTarget;
        const li = a.closest("li");
        const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
        switch ( a.dataset.action ) {
            case "create":
            return owner.createEmbeddedDocuments("ActiveEffect", [{
                label: game.i18n.localize("Merp1e.ActiveEffect.New"),
                icon: "icons/svg/aura.svg",
                origin: owner.uuid,
                "duration.rounds": li.dataset.effectType === "temporary" ? 1 : undefined,
                disabled: li.dataset.effectType === "inactive"
            }]);
            case "edit":
                return effect.sheet.render(true);
            case "delete":
                return effect.delete();
            case "toggle":
                return effect.update({disabled: !effect.data.disabled});
        }
    }

    static activateListeners(html, document) {
        if ( document.isEditable ) {
            html.find(".effect-control").click(ev => {
                ActiveEffect5e.onManageActiveEffect(ev, document)
            });
        }
    }
    
}
