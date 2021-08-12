/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class Feature extends Merp1eItem {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // Default icon
    super.prepareData();
  }
  async _preCreate(createData, options, user) {
    await super._preCreate(createData, options, user);

    const path = "systems/merp1e/icons/item";
    this.data.img = `${path}/${this.type}.svg`;
  }

}
