/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class Merp1eProfessionSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["merp1e", "sheet", "item"],
      width: 520,
      height: 640,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/merp1e/templates/item";
    // Return a single sheet for all item types.
    //return `${path}/item-sheet.html`;
    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

    return `${path}/${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.rules = game.merp1e.Merp1eRules;
    data.sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder();
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
    
    html.find(".skill-group-value").on("click", this.onInputSkillGroup.bind(this));
  }

  /** @override */
  _updateObject(event, formData) {
    for(let field of Object.keys(formData)) {
      if(formData[field] == null) {
        delete formData[field];
      }
      if(field.startsWith("data.professionSkillBonuses.") && formData[field] == 0) {
        delete formData[field];
      }
    }

    // Handle the free-form groups list
    const formProfessionSkillBonuses = expandObject(formData).data.professionSkillBonuses || {};

    // Remove groups which are no longer used
    for ( let k of Object.keys(this.object.data.data.professionSkillBonuses) ) {
      if ( !formProfessionSkillBonuses.hasOwnProperty(k) ) formProfessionSkillBonuses[`-=${k}`] = null;
    }
  
    // Re-combine formData
    formData = Object.entries(formData).filter(e => !e[0].startsWith("data.professionSkillBonuses")).reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, {"data.professionSkillBonuses": formProfessionSkillBonuses});
  
    return this.object.update(formData);
  }

  onInputSkillGroup(event) {
    const target = event.target;
    const group = target.getAttribute("group");
    const value = target.getInnerHTML()
    let groupElement = target.closest(".skill-group");
    for(let e of groupElement.getElementsByTagName("input")) {
       e.setAttribute("value", value); 
    }
    if ( this.options.submitOnChange ) {
      return this._onSubmit(event);
    }
  }
}

