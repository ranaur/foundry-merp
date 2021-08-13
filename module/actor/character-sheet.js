import { LanguageSheetHelper } from '../language-helper.js';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class Merp1eCharacterSheet extends ActorSheet {

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

/*
  generateSheetOrder() {
    let skillByGroups = {};

    // initialize skill groups with all skill groups in rules
    for(let [name, group] of Object.entries(game.merp1e.Merp1eRules.skill.groups)) {
      skillByGroups[name] = {
        name: name,
        order: group.order,
        skills: []
      }
    }

    // fill skill groups with skills
    for(let skill of Object.values(this.actor.data.skills)) {
      let groupName = skill.group;
      // skillByGroups[groupName] = skillByGroups[groupName] || { name: groupName, order: 99, skills = [] } // add any missing group (shoudn't happen)
      skillByGroups[groupName].skills.push(skill);
    }

    // reorder skills inside the groups and generate sheetOrder array
    let sheetOrder = Object.values(skillByGroups).reduce( (acc, group) => {
      group.skills.sort(function(first, second) {
        return first.order - second.order;
      });
      acc.push(group);
      return acc;
    }, []);
    // reorder groups in sheetOrder 
    sheetOrder.sort(function(first, second) {
      return first.order - second.order;
    });

    return sheetOrder;
  }
*/

  _prepareCharacter(sheetData) {
    if (this.actor.data.type != 'character') {
      return sheetData
    }

    sheetData.avaliableRaces = sheetData.rules.getAvaliableRaces();
    sheetData.avaliableProfessions = sheetData.rules.getAvaliableProfessions();
    if(this.actor.data.skills = null) {
      sheetData.sheetOrder ={}
    } else {
      sheetData.sheetOrder = game.merp1e.Merp1eRules.generateSheetOrder(this.actor.skills)
    }
    this.fillAdolescenceSkillRanks(sheetData); // XXX não funciona quando troca de raça
    return sheetData;
  }

    /** @override */
  getData() {
    let data = super.getData();

    data.rules = game.merp1e.Merp1eRules;

    // Prepare items.
    if (this.actor.data.type == 'character') {
      data = this._prepareCharacter(data);
    }

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

    LanguageSheetHelper.activateListeners(html, this.actor);

    html.find(".skills").on("click", ".skill-control", this.onClickSkillControl.bind(this));
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
    if ( itemData.data ) { // XXX
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

  _updateEmbeddedItems(formData) {
    // Handle the free-form groups list
    const formItems = expandObject(formData).Item || {};
    const updatetedItems = [];
    for ( let [itemId, item] of Object.entries(formItems || {}) ) {
        if(itemId in this.actor.skills) updatetedItems.push({_id: itemId, data: item});
    }
    this.actor.updateEmbeddedDocuments("Item", updatetedItems);
    
    // remove Items
    formData = Object.entries(formData).filter(e => !e[0].startsWith("Item")).reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, {id: this.id});
    
    return formData;
  }

  _updateRace(formData) {
    const newRaceId = formData["data.originalRaceId"] || null;
    const raceItem = game.merp1e.Merp1eRules.getItem(newRaceId);

    if(raceItem != undefined) {
      const newItem = { 
        data: raceItem.data.data, 
        img: raceItem.img, 
        type: raceItem.type, 
        name: raceItem.name};
      const actorRace = this.actor.race;
      if(actorRace.name == null) { // has no race yet, so create it
        this.actor.createEmbeddedDocuments("Item", [newItem], {renderSheet: false})
      } else { // already has one Embedded Document for the race, update it
        if(this.actor.data.data.originalRaceId != newRaceId) {
          newItem._id = actorRace.id;
          this.actor.updateEmbeddedDocuments("Item", [newItem], {renderSheet: false})
        }
      }
    }
    
    return formData;
  }

  _updateProfession(formData) {
    const newProfessionId = formData["data.originalProfessionId"] || null;
    const professionItem = game.merp1e.Merp1eRules.getItem(newProfessionId);
    if(professionItem != undefined) {
      const newItem = { 
        data: professionItem.data.data,
        img: professionItem.img, 
        type: professionItem.type, 
        name: professionItem.name};
      const actorProfession = this.actor.profession;
      if(actorProfession.name == null) { // has no Profession yet, so create it
        this.actor.createEmbeddedDocuments("Item", [newItem], {renderSheet: false})
      } else { // already has one Embedded Document for the Profession, update it
        if(this.actor.data.data.originalProfessionId != newProfessionId) {
          newItem._id = actorProfession.id;
          this.actor.updateEmbeddedDocuments("Item", [newItem], {renderSheet: false})
        }
      }
    }
    return formData;
  }
  /** @override */
  _updateObject(event, formData) {
    /*
    let raceItem = game.data.items.filter(item => item.id == formData["data.raceId"]);
    if(raceItem.length == 1) {
      formData["data.race"] = raceItem[0];
    }
    let professionItem = game.data.items.filter(item => item.id == formData["data.professionId"]);
    if(professionItem.length == 1) {
      formData["data.profession"] = professionItem[0];
    }
    */
    formData = LanguageSheetHelper.updateLanguages(formData, this);
    formData = this._updateRace(formData);
    formData = this._updateProfession(formData);
    formData = this._updateEmbeddedItems(formData);

    return this.object.update(formData);
  }

  async onClickSkillControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;

    switch ( action ) {
    case "remove-all":
      // remove all skills with zero ranks
      let idsToRemove = this.actor.items.filter(item => item.type == "skill" && item.data.data.ranks == 0).reduce((acc, item) => { acc.push(item.id); return acc; }, []);
      await this.actor.deleteEmbeddedDocuments("Item", idsToRemove);
      break;
    case "add-all":
      await this.actor.createEmbeddedDocuments("Item", this.actor.getDefaultSkills());
      break;
    case "add-item":
      console.log("Not implemented");
      break;
    }
  }
}

