import { LanguageSheetHelper } from '../language-helper.js';
import { Merp1eBaseSheet } from './base-sheet.js';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class Merp1eCharacterSheet extends Merp1eBaseSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["merp1e", "sheet", "actor"],
      width: 700,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/merp1e/templates/actor";
    // Return a single sheet for all item types.
    //return `${path}/item-sheet.html`;
    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

    return `${path}/${this.actor.data.type}-sheet.html`;
  }

  _prepareCharacter(sheetData) {
    if (this.actor.data.type != 'character') {
      return sheetData
    }

    sheetData.avaliableRaces = sheetData.rules.getAvaliableRaces();
    sheetData.avaliableProfessions = sheetData.rules.getAvaliableProfessions();
    if(this.actor.data.skills = null) {
      sheetData.sheetOrder ={}
    } else {
      sheetData.sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder(this.actor.skills);
    }

    sheetData.effectList = this.object.effects.reduce((acc, effect) => {
      let origin = effect.data.origin.split(".");
      let actorID = origin[1];
      let itemID = origin[3] || null;
      let item = null;
      let itemName = "no item";
      if(itemID) {
        item = this.object.getEmbeddedDocument("Item", itemID);
        if(item != undefined)
          itemName = item.name;
        else {
          itemName = "Rougue item " + itemID;
        }
      }
      // acc.push({
      //   name: effect.name,
      //   condition: effect.condition.conditionName,
      //   isActive: effect.condition.isActive(effect, this.object),
      //   reason: effect.condition.reason(effect, this.object),
      //   item: itemName,
      // });
      return acc
    }, []);

    this.fillAdolescenceSkillRanks(sheetData); // XXX não funciona quando troca de raça

    return sheetData;
  }

    /** @override */
  getData() {
    let sheetData = super.getData();

    sheetData.rules = game.merp1e.Merp1eRules;
    
    // Prepare items.
    if (this.actor.data.type == 'character') {
      sheetData = this._prepareCharacter(sheetData);
    }

    return sheetData;
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

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    LanguageSheetHelper.activateListeners(html, this.actor);

    html.find(".skills").on("click", ".skill-control", this.onClickSkillControl.bind(this));
    html.find(".spells").on("click", ".spell-control", this.onClickSpellControl.bind(this));
    html.find(".health").on("click", ".health-control", this.onClickHealthControl.bind(this));
    html.find(".xp").on("click", ".xp-control", this.onClickXPControl.bind(this));
    html.on("click", ".button-control", this.onClickButtonControl.bind(this));
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
        if(itemId in this.actor.skills || itemId in this.actor.spelllists) updatetedItems.push({_id: itemId, data: item});
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
  _onUpdateEmbeddedDocuments(embeddedName, documents, result, options, userId) {
    this.consolidateDamage();
    super._onUpdateEmbeddedDocuments(embeddedName, documents, result, options, userId);
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

    //this.actor.health.consolidateDamage();
    //this.updateHealth();

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
    case "duplicate":
      let skillId = a.dataset.id;
      let skill = this.actor.getEmbeddedDocument("Item", skillId);
      
      await this.actor.createEmbeddedDocuments("Item", [{ name: game.i18n.localize("MERP1E.Item.New") + " " + skill.name, type: skill.type, data: skill.data.data }], { renderSheet: true });
      break;
    }
  }

  async onClickSpellControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;

    switch ( action ) {
    case "reset-pp":
      let inputElement = event.currentTarget.parentNode.getElementsByTagName("input")[0];
      inputElement.value = this.object.powerPointsMaximum;
      this.submit();
      break;
    }
  }

  addValueToElement(name, n) {
    let value = document.getElementsByName(name)[0].value;
    if(value == "" || value == "0") return;
    this.setValueToElement(name, parseInt(value) + n);
  }
  setValueToElement(name, n) {
    document.getElementsByName(name)[0].value = n;
  }
  getValueFromElement(name) {
    return document.getElementsByName(name)[0].value;
  }
  setCheckedToElement(name, n) {
    let element = document.getElementsByName(name)[0];
    
    if(n) {
      if(!element.hasAttribute("checked")) element.setAttribute("checked");
    } else {
      if(element.hasAttribute("checked")) element.removeAttribute("checked");
    }
  }
  setValueToId(id, n) {
    document.getElementById(id).value = n;
  }

  updateHealth() {
    this.setValueToElement("data.healthStatus.hitsTaken", this.actor.health.hitsTaken);
    this.setValueToId("hitsLeft", this.actor.health.hitsLeft);
    this.setValueToId("maximumHPDie", this.actor.health.maximumHPDie);
    this.setValueToId("maximumHPOut", this.actor.health.maximumHPOut);
    this.setValueToElement("data.healthStatus.hitsPerRound", this.actor.health.status.hitsPerRound);
    this.setValueToElement("data.healthStatus.activityPenalty", this.actor.health.status.activityPenalty);
    this.setValueToElement("data.healthStatus.roundsStunned", this.actor.health.status.roundsStunned);
    this.setValueToElement("data.healthStatus.roundsDown", this.actor.health.status.roundsDown);
    this.setValueToElement("data.healthStatus.roundsOut", this.actor.health.status.roundsOut);
    this.setValueToElement("data.healthStatus.roundsUntilDeath", this.actor.health.status.roundsUntilDeath);
    this.setValueToElement("data.healthStatus.roundsBlinded", this.actor.health.status.roundsBlinded);
    this.setValueToElement("data.healthStatus.roundsWeaponStuck", this.actor.health.status.roundsWeaponStuck);
    this.setValueToElement("data.healthStatus.unconsciousComa", this.actor.health.status.unconsciousComa);
    this.setValueToElement("data.healthStatus.paralyzed", this.actor.health.status.paralyzed);
    this.setValueToElement("data.healthStatus.hearingLoss", this.actor.health.status.hearingLoss);
    this.setValueToElement("data.healthStatus.eyeLoss", this.actor.health.status.eyeLoss);
    this.setValueToElement("data.healthStatus.leftArm", this.actor.health.status.leftArm);
    this.setValueToElement("data.healthStatus.rightArm", this.actor.health.status.rightArm);
    this.setValueToElement("data.healthStatus.leftLeg", this.actor.health.status.leftLeg);
    this.setValueToElement("data.healthStatus.rightLeg", this.actor.health.status.rightLeg);
    
    this.submit();
  }

  async onClickButtonControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;

    switch ( action ) {
    case "step":
      let step = parseInt(a.dataset.step || 0);
      let inputElement = event.currentTarget.parentNode.getElementsByTagName("input")[0];
      inputElement.value = parseInt(inputElement.value) + step;
      this.submit();
      break;
    }
  }

  async onClickHealthControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;

    switch ( action ) {
    case "damage-add":
      let step = parseInt(a.dataset.step || 1);
      let inputElement = event.currentTarget.parentNode.getElementsByTagName("input")[0];
      inputElement.value = parseInt(inputElement.value) + step;
      this.submit();
      break;
    case "consolidate-damage":
      this.actor.health.consolidateDamage();
      this.updateHealth();
      break;
    case "next-round":
      this.actor.health.nextRound();
      this.updateHealth();
      break;
    case "heal":
      // XXX
      break;
    }
  }
  async onClickXPControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;

    switch ( action ) {
    case "consolidate-xp":
      let newXP = parseInt(this.getValueFromElement("data.xp.effective")) + parseInt( this.getValueFromElement("data.xp.awarded"));
      this.setValueToElement("data.xp.effective", newXP);
      
      if(game.merp1e.Merp1eRules.settings.xpControlManual) {
        this.setValueToElement("data.xp.awarded", 0);
      } else { // this.rules.settings.xpControlAutomatic
        this.actor.deleteEmbeddedDocuments("Item", this.actor.xp.awardedList);
      }
      this.submit();
      break
    }
  }
}

