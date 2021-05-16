/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class Merp1eItemSheet extends ItemSheet {

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
    return `${path}/item-sheet.html`;
    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

    //return `${path}/${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.rules = game.merp1e.Merp1eRules;
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
  }

  /** @override */
  _updateObject(event, formData) {
    switch(this.object.data.type) {
      case "spelllist":
        formData = MerpSpellListItemSheetHelper.updateSpells(formData, this);
        break;
    }
    return this.object.update(formData);
  }
}

class MerpSpellListItemSheetHelper {
  static updateSpells(formData, entity) {
    // Handle the free-form groups list
    const formSpells = expandObject(formData).data.spells || {};

    // Remove groups which are no longer used
    for ( let k of Object.keys(entity.object.data.data.spells) ) {
      if ( !formSpells.hasOwnProperty(k) ) formSpells[`-=${k}`] = null;
    }

    // Re-combine formData
    formData = Object.entries(formData).filter(e => !e[0].startsWith("data.spells")).reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, {_id: entity.object._id, "data.spells": formSpells});

    return formData;
  }
  static async onClickSpellControl(event) {
    event.preventDefault();
    switch ( event.currentTarget.dataset.action ) {
      case "delete":
        MerpSpellListItemSheetHelper.deleteSpell(event, this);
        break;
      }
  }

  static async deleteSpell(event, app) {
    let lineElement = event.currentTarget.parentElement.parentElement;
    lineElement.parentElement.removeChild(lineElement);
    await app._onSubmit(event);
  }

  static async onDropSpellControl(event) {
    event.preventDefault();

    var obj = JSON.parse(event.originalEvent.dataTransfer.getData("text/plain"));

    if(obj.type == "Item") {
      const target = event.currentTarget;
      //const form = app.form;

        let item = game.items.get(obj.id);
        if(item.data.type == "spell") {
          let spell = item.data.data;
          let spelllistSpellsLine = target.getElementsByClassName(`spelllist-spell-level-${spell.level}`);
        
          if(spelllistSpellsLine.length == 0) { // insert new spell
            let newElement = document.createElement("tr");
            newElement.setAttribute("class", `spelllist-spells-line spelllist-spell-level-${spell.level} flexrow`);
            let instantaneous = spell.instantaneous ? "*" : "-";
            newElement.innerHTML = `
              <input name="data.spells.${spell.level}.level" type="hidden" value="${spell.level}"/>
              <td class="spelllist-spell-level">${spell.level}</td>
              <input name="data.spells.${spell.level}.name" type="hidden" value="${item.data.name}"/>
              <td class="spelllist-spell-name flex4">${item.data.name}</td>
              <input name="data.spells.${spell.level}.class" type="hidden" value="${spell.class}"/>
              <td class="spelllist-spell-class">${spell.class}</td>
              <input name="data.spells.${spell.level}.areaofeffect" type="hidden" value="${spell.areaofeffect}"/>
              <td class="spelllist-spell-areaofeffect">${spell.areaofeffect}</td>
              <input name="data.spells.${spell.level}.duration" type="hidden" value="${spell.duration}"/>
              <td class="spelllist-spell-duration">${spell.duration}</td>
              <input name="data.spells.${spell.level}.range" type="hidden" value="${spell.range}"/>
              <td class="spelllist-spell-range">${spell.range}</td>
              <input name="data.spells.${spell.level}.instantaneous" type="hidden" value="${spell.instantaneous}"/>
              <td class="spelllist-spell-instantaneous">${instantaneous}</td>
              <a class="spelllist-spell-control" data-action="delete"><i class="fas fa-trash"></i></a>`;
            // Append the form element and submit the form.
            //newKey = newKey.children[0];
            target.appendChild(newElement);
          } else { // update spell
            document.getElementsByName(`data.spells.${spell.level}.level`)[0].setAttribute("value", spell.level);
            document.getElementsByName(`data.spells.${spell.level}.name`)[0].setAttribute("value", item.data.name);
            document.getElementsByName(`data.spells.${spell.level}.class`)[0].setAttribute("value", spell.class);
            document.getElementsByName(`data.spells.${spell.level}.areaofeffect`)[0].setAttribute("value", spell.areaofeffect);
            document.getElementsByName(`data.spells.${spell.level}.duration`)[0].setAttribute("value", spell.duration);
            document.getElementsByName(`data.spells.${spell.level}.range`)[0].setAttribute("value", spell.range);
            document.getElementsByName(`data.spells.${spell.level}.instantaneous`)[0].setAttribute("value", spell.instantaneous);
          }
          let form = target.parentElement.parentElement;
          let app = this;
          await app._onSubmit(event);
        }
      }
    }
}