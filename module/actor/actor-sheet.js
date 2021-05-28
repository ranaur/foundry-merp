import { LanguageSheetHelper } from '../language-helper.js';

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
    data.rules.skill.sheetOrder = data.rules.skill.generateSheetOrder(); // XXX remove???

    data.avaliableRaces = this.getAvaliableRaces();
    data.avaliableProfessions = this.getAvaliableProfessions();
    this.fillAdolescenceSkillRanks(data); // XXX não funciona quando troca de raça
    return data;
  }

  fillAdolescenceSkillRanks(data) {
    if("race" in data.data) {
      // Fill adolescence skill ranks
      for(let [key, asr] of Object.entries(data.data.race.data.adolescenceSkillRanks)) {
        if(asr > 0 && data.data.skills[key].ranks < asr) {
          data.data.skills[key].ranks = asr
        }
      }
      // Fill adolescence languages
      for(let [key, language] of Object.entries(data.data.race.data.languages)) {
        // search if the character already has the language
        let found = -1;
        for(let [charKey, charLanguage] of Object.entries(data.data.languages)) {
           if(charLanguage.name == language.name) {
             found = charKey;
             break;
           }
        }
        if(found == -1) { // not found, add
          let maxIndex = parseInt(Object.keys(data.data.languages).reduce((res, idx) => { return res > idx ? res : idx; }, 0)) + 1;
          data.data.languages[maxIndex] = language;
        } else { // found, update
          if(data.data.languages[found].rank < language.rank) {
            data.data.languages[found].rank = language.rank;
          }
        }
      }
    }
  }

  getAvaliableProfessions() {
    /// XXX add folder of avaliable professions (config option)
    /// Add localization
    return game.items.filter(item => item.type == "profession").reduce((res, prof) => { res[prof._id] = prof.name; return res; }, {});
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

    html.find(".languages").on("click", ".language-control", LanguageSheetHelper.onClickLanguageControl.bind(this));
  }

  /** @override */
  async _onDropItemCreate(itemData) {
    if (itemData.type === "race") {
      new Dialog({
        title: game.i18n.localize("MERP1E.DeleteGroup"),
        content: `You cannot drag a race. Choose from the dropdown in the actor sheet!`,
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
      new Dialog({
        title: game.i18n.localize("MERP1E.DeleteGroup"),
        content: `You cannot drag a profession. Choose from the dropdown in the actor sheet!`,
        buttons: {
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize("OK"),
          }
        }
      }).render(true);
      return;
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
    let professionItem = game.data.items.filter(item => item._id == formData["data.professionId"]);
    if(professionItem.length == 1) {
      formData["data.profession"] = professionItem[0];
    }
    formData = LanguageSheetHelper.updateLanguages(formData, this);
    return this.object.update(formData);
  }
}

