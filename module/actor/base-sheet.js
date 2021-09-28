export class Merp1eBaseSheet extends ActorSheet {

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
   _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;
    const options = {
        renderSheet: header.getAttribute("option-renderSheet") == "true" || false
    }
    const itemData = {
      name: game.i18n.format("MERP1E.Item.NewItem", {type: game.i18n.localize(`MERP1E.ItemType.${type.capitalize()}`)}),
      type: type,
      data: foundry.utils.deepClone(header.dataset)
    };
    delete itemData.data["type"];
    return this.actor.createEmbeddedDocuments("Item", [itemData], options);
  }

  /* -------------------------------------------- */

  /**
   * Handle editing an existing Owned Item for the Actor
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemEdit(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li?.dataset?.itemId);
    return item?.sheet?.render?.(true);
  }

  /* -------------------------------------------- */

  /**
   * Handle deleting an existing Owned Item for the Actor
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemDelete(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    if ( item ) return item.delete();
  }

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);
    html.find('.item-edit').click(this._onItemEdit.bind(this));
    html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.item-delete').click(this._onItemDelete.bind(this));
  }
}
