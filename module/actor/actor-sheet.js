/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class Merp1eActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["merp1e", "sheet", "actor"],
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */
  /** @override */
  get template() {
    const path = "systems/merp1e/templates/actor";
    // Return a single sheet for all item types.
    //return `${path}/item-sheet.html`;
    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

    return `${path}/${this.actor.data.type}-sheet.html`;
  }

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    //for (let attr of Object.values(data.data.attributes)) {
    //  attr.isCheckbox = attr.dtype === "Boolean";
    //}
    data.rules = game.merp1e.Merp1eRules;
    data.avaliableRaces = this.getAvaliableRaces();
    return data;
  }

  getAvaliableRaces() {
    /// XXX add folder of avaliable races (config option)
    return game.items.filter(item => item.type == "race").reduce((res, race) => { res[race._id] = race.name; return res; }, {});
  }
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Add attribute groups.
    html.find(".languages").on("click", ".language-control", this.onClickLanguageControl.bind(this));
  }

  /* -------------------------------------------- */
  /**
   * Listen for click events and modify attribute groups.
   * @param {MouseEvent} event    The originating left click event
   */
  onClickLanguageControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;

    switch ( action ) {
      case "create-language":
        CharacterActorSheetHelper.createLanguage(event, this);
        break;
      case "delete-language":
        CharacterActorSheetHelper.deleteLanguage(event, this);
        break;
    }
  }


  /** @override */
  async _onDropItemCreate(itemData) {
    if (itemData.type === "race") {
      new Dialog({
        title: game.i18n.localize("MERP1E.DeleteGroup"),
        content: `You cannot a race. Choose from the dropdown in the actor sheet!`,
        buttons: {
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize("OK"),
          }
        }
      }).render(true);
      return;
    }

    if (itemData.type === "profession") {
      if(this.object.data.data.profession != null) {
        new Dialog({
          title: game.i18n.localize("MERP1E.DeleteGroup"),
          content: `You cannot drag a second profession. Exclude the current profession!`,
          buttons: {
            cancel: {
              icon: '<i class="fas fa-times"></i>',
              label: game.i18n.localize("Cancel"),
            }
          }
        }).render(true);
        return;
      }
    }

    // Ignore certain statuses
    if ( itemData.data ) {
      ["attunement", "equipped", "proficient", "prepared"].forEach(k => delete itemData.data[k]);
    }

    // Create the owned item as normal
    return super._onDropItemCreate(itemData);
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.data.data);
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }

  /** @override */
  _updateObject(event, formData) {
    let raceItem = game.data.items.filter(item => item._id == formData["data.raceId"]);
    if(raceItem.length == 1) {
      formData["data.race"] = raceItem[0];
    }
    return this.object.update(formData);
  }
}

class CharacterActorSheetHelper {
  /* ------------------------------------

  /**
   * Create new language.
   * @param {MouseEvent} event    The originating left click event
   * @param {Object} app          The form application object.
   * @private
   */
  static async createLanguage(event, app) {
  const a = event.currentTarget;
    const form = app.form;
    let languageHeader = $(a).closest('.language-header');
    let languageList = languageHeader.siblings(".language-list");
    
    let newValue = 0;
    for (let item of languageList.children()) {
      if( item.getAttribute("data-language") > newValue ) {
        newValue = parseInt(item.getAttribute("data-language").toString());
      }
    }
    newValue++;
    
    let newKey = document.createElement("li");
    newKey.setAttribute("class", "language flexrow");
    newKey.setAttribute("data-language", `${newValue}`);
    let localizedLanguage = game.i18n.localize("MERP.CharacterSheet.Language");
    let localizedRank = game.i18n.localize("MERP.CharacterSheet.Rank");
    newKey.innerHTML = `
      <input class="language-name flex4" name="data.languages.${newValue}.name" type="text" value="" placeholder="${localizedLanguage}" type="text" data-dtype="String"/></td>
      <input class="language-rank flex1" name="data.languages.${newValue}.rank" type="text" value="" placeholder="${localizedRank}" type="number" data-dtype="Number"/></td>
      <div class="language-controls flex1">
          <a class="language-control language-delete" data-action="delete-language" title="Delete Item"><i class="fas fa-trash"></i></a>
      </div>`;

      // Append the form element and submit the form.
      //newKey = newKey.children[0];
      form.getElementsByClassName('language-list')[0].appendChild(newKey);
      await app._onSubmit(event);
  }

  /**
   * Delete an attribute group.
   * @param {MouseEvent} event    The originating left click event
   * @param {Object} app          The form application object.
   * @private
   */
  static async deleteLanguage(event, app) {
    const a = event.currentTarget;
    let language = a.closest(".language");
    let languageName = $(language).find('.language-name');
    // Create a dialog to confirm group deletion.
    new Dialog({
      title: game.i18n.localize("MERP1E.DeleteGroup"),
      content: `${game.i18n.localize("MERP1E.DeleteGroupContent")} <strong>${languageName.val()}</strong>`,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-trash"></i>',
          label: game.i18n.localize("Yes"),
          callback: async () => {
            language.parentElement.removeChild(language);
            await app._onSubmit(event);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("No"),
        }
      }
    }).render(true);
  }
  
  /* -------------------------------------------- */
}