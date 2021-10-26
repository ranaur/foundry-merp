/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class Merp1eItem extends Item {
  static registeredTypes = [];

  // NOT USED
  // static get registeredClasses() { 
  //   return this.registeredAdapters.reduce((acc, cls) => { acc[cls.type] = cls; return acc; }, {})
  // }
  
  constructor(data, contextopt) {

    const itemClass = Merp1eItem.registeredTypes.find((cls) => cls.type == data.type);
    if ( itemClass && !contextopt?.isExtendedClass) {
      return new itemClass(data,{...{isExtendedClass: true}, ...contextopt});
    }
    super(data, contextopt);
  }

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();
  }

  async _preCreate(createData, options, user) {
    await super._preCreate(createData, options, user);

    // Default icon
    const path = "systems/merp1e/icons/item";
    const updateData = {};
    updateData['img'] = `${path}/${this.type}.svg`;;

    await this.data.update( updateData );
  }
}
