/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class Merp1eItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    if (!this.data.img) {
      switch(this.type) {
        case "spelllist":
          this.data.img = "systems/merp1e/icons/spelllist.svg";
          break;
        case "spell":
          this.data.img = "systems/merp1e/icons/spell.svg";
          break;
        case "race":
          this.data.img = "systems/merp1e/icons/anatomy.svg";
          break;
        case "profession":
          this.data.img = "systems/merp1e/icons/hooded-figure.svg";
          break;
                      // XXX make other classes
      }
    }

    // Default icon
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;
  }
}
