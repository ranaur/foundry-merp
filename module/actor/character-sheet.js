import { LanguageSheetHelper } from '../language-helper.js';
import { Merp1eBaseSheet } from './base-sheet.js';
import { Merp1eRollChooserApplication } from '../apps/roll-chooser.js';
import { Merp1eEffect } from '../active-effect.js';
import { getFuncName } from "../util.js";

class Merp1eActionTab {
  static getData(sheetData, sheet) {
    sheetData.knownSpellLists = sheet.actor.spellcasting.getKnownSpellLists();
    sheetData.actions = game.merp1e.Merp1eRules.actions;
    sheetData.data.data.action ??= {};
    sheetData.data.data.action.roundsSpellPrepared ??= 0;
    sheetData.getPrepareBonus = sheetData.rules.spell.getPrepareBonus(sheetData.data.data.action.roundsSpellPrepared);
    //sheetData.targets = game.user.targets;
    sheetData.combat = sheet.actor.getCombats()?.[0]; // XXX get currnet combat?
    sheetData.combatants = {};
    sheetData.combat.combatants.forEach((token) => {
      sheetData.combatants[token.id] = token.name;
    });
    return sheetData;
  }

  static updateObject(event, formData, sheet) {
    return formData;
  }

  static activateListeners(html, sheet) {
    html.find(".action").on("click", ".action-control", this.onClickActionControl.bind(sheet));
  }

  static async onClickActionControl(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const action = target.dataset.action;
    const tab = target.closest(".tab");

    switch ( action ) {
    case "prepare-to-cast":
      const chooser = tab.getElementsByClassName("action-chooser");
      chooser[0].value = "castSpell";
      this.submit();
      break;
    }
  }
}

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
      throw "Character sheet is trying to edit something htat is not a character";
      return sheetData;
    }

    sheetData.avaliableRaces = sheetData.rules.getAvaliableRaces();
    sheetData.actorRaceId = sheetData.rules.getItemByTypeIdName("race", this.actor.race.data?.originalId, this.actor.race.name)?.id;
    
    sheetData.avaliableProfessions = sheetData.rules.getAvaliableProfessions();
    sheetData.actorProfessionId = sheetData.rules.getItemByTypeIdName("profession", this.actor.profession.data?.originalId, this.actor.profession.name)?.id;

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

  getEquipmentsInLocation(location) {
    let res = [];
    Object.values(this.actor.equipments).forEach((itm) => {
      if(itm.data.data.location == location) {
        res.push(itm);
        if(itm.data.data.isContainer) {
          let subItems = this.getEquipmentsInLocation(itm.id);
          subItems.forEach((sbi) => res.push(sbi));
        }
      }
    });
    return res;
  }

  getEquipmentsByLocation() {
    let res = [];
    this.getEquipmentsInLocation("wearing").forEach((itm) => res.push(itm));
    this.getEquipmentsInLocation("carrying").forEach((itm) => res.push(itm));
    this.getEquipmentsInLocation("stored").forEach((itm) => res.push(itm));
    let ids = res.reduce((acc, itm) => { acc.push(itm.id); return acc;}, []);
    const orphans = Object.values(this.actor.equipments).filter((itm) => {
      return !ids.includes(itm.id);
    }).forEach((itm) => res.push(itm));;
    return res;
  }
    /** @override */
  getData() {
    let sheetData = super.getData();

    sheetData.settings = game.merp1e.Merp1eRules.settings;
    sheetData.rules = game.merp1e.Merp1eRules;
    sheetData.specialTypesIcons = game.merp1e.Merp1eRules.special.types.reduce((acc, spc) => { acc[spc.id] = spc.icon; return acc; }, {});
    sheetData.specialTypes = game.merp1e.Merp1eRules.special.types.reduce((acc, spc) => { acc[spc.id] = spc.label; return acc; }, {});
    sheetData.effectTypesLabels = Object.values(Merp1eEffect.registeredClasses).reduce((acc, cls) => { acc[cls.effectName] = cls.label; return acc; }, {});
    sheetData.weightType = {
      total: "MERP1E.Location.Total",
      wearing: "MERP1E.Location.Wearing"
    };

    sheetData.money = sheetData.rules.currencies.reduce((acc, cur) => {
      let items = Object.values(this.actor.equipments).filter((itm) => itm.data.data.unitaryValueCurrency == cur.id && itm.value > 0 );
      acc.push( {
        id: cur.id,
        name: cur.name,
        namePlural: cur.namePlural,
        abbr: cur.abbr,
        unitaryValue: cur.unitaryValue,
        items: items,
        get total() { return this.items.reduce((acc, itm) => acc + itm.data.data.unitaryValue * itm.data.data.quantity, 0)},
        get value() { return this.total * this.unitaryValue }
      });
      return acc;
    }, []);
    sheetData.moneyTotal = sheetData.money.reduce((acc, cur) => acc + cur.total * cur.unitaryValue, 0);
    sheetData.moneyTotalCurrency = sheetData.money.find((cur) => cur.unitaryValue == 1);
    sheetData.equipmentsByLocation = this.getEquipmentsByLocation();
    sheetData = this._prepareCharacter(sheetData);
    sheetData = Merp1eActionTab.getData(sheetData, this);
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

  /**
 * Handle editing an existing Owned Item for the Actor
 * @param {Event} event   The originating click event
 * @private
 */
  async _onItemWear(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li?.dataset?.itemId);
    const data = { location: "wearing", originalLocation: item.data.data.location };
    return await this.actor.updateEmbeddedDocuments("Item", [{ _id: li?.dataset?.itemId, data: data}]);
  }
  async _onItemUnwear(event) {
    event.preventDefault();
    const li = event.currentTarget.closest(".item");
    const item = this.actor.items.get(li?.dataset?.itemId);
    const originalLocation = item.data?.data?.originalLocation || "carrying";
    const data = { location: originalLocation };
    return await this.actor.updateEmbeddedDocuments("Item", [{ _id: li?.dataset?.itemId, data: data}]);
  }
  
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    LanguageSheetHelper.activateListeners(html, this.actor);

    html.find('.item-wear').click(this._onItemWear.bind(this));
    html.find('.item-unwear').click(this._onItemUnwear.bind(this));
    html.find(".skills").on("click", ".skill-control", this.onClickSkillControl.bind(this));
    html.find(".spells").on("click", ".spell-control", this.onClickSpellControl.bind(this));
    html.find(".health").on("click", ".health-control", this.onClickHealthControl.bind(this));
    html.find(".xp").on("click", ".xp-control", this.onClickXPControl.bind(this));
    Merp1eActionTab.activateListeners(html, this);
  }

  /** @override */
  async _onDropItemCreate(itemData) {
    if (itemData.type === "race") {
      if(!this.isDisabledByElement("originalRaceId")) {
        this.setValueToElement("originalRaceId", itemData._id);
        this.submit();
      } else {
        ui.notifications.error(game.i18n.localize("MERP1E.Error.CannotChangeRace"));
      }
      return;
    }

    if (itemData.type === "profession") {
      if(!this.isDisabledByElement("originalProfessionId")) {
        this.setValueToElement("originalProfessionId", itemData._id);
        this.submit();
      } else {
        ui.notifications.error(game.i18n.localize("MERP1E.Error.CannotChangeProfession"));
      }
      return;
    }

    if(itemData.type === "skill") {
      const existingSkill = this.actor.getSkillByReference(itemData.data.reference);
      if(existingSkill) { // update existing
        // XXX delete any pre-existing rank/bonus?
        itemData._id = existingSkill.id;
        return this.actor.updateEmbeddedDocuments("Item", [itemData]);
      } else { // create New
        return super._onDropItemCreate(itemData);
      }
    }

    // Ignore certain statuses on equipments XXX?
    if ( itemData.data ) { // XXX
      ["attunement", "equipped", "proficient", "prepared"].forEach(k => delete itemData.data[k]);
    }

    // Create the owned item as normal
    return super._onDropItemCreate(itemData);
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

  async _updateRace(formData) {
    const globalRaceId = formData["originalRaceId"] || null;
    const globalRaceItem = game.merp1e.Merp1eRules.getItem(globalRaceId);
    //formData["data.originalRaceName"] = globalRaceItem.name;

    if(globalRaceItem == undefined) { // race not choosen this time
      return formData;
    }

    if(this.actor.race.name == globalRaceItem.name) { // race is equal to the global item, does not neet do change. XXX
      return formData;
    }

    if(this.actor.race.id) { // there was a race, and it changed. Delete the old one
      await this.actor.deleteEmbeddedDocuments("Item", [this.actor.race.id]);
    }

    await this.actor.createEmbeddedDocuments('Item', [ mergeObject(globalRaceItem.toObject(), { data: { originalRaceId : globalRaceId, originalRaceName: globalRaceItem.name }}) ]);
    
    return formData;
  }

  async _updateProfession(formData) {
    const globalProfessionId = formData["originalProfessionId"] || null;
    const globalProfessionItem = game.merp1e.Merp1eRules.getItem(globalProfessionId);
    //formData["data.originalProfessionName"] = globalProfessionItem.name;

    if(globalProfessionItem == undefined) { // Profession not choosen this time
      return formData;
    }

    if(this.actor.profession.name == globalProfessionItem.name) { // Profession is equal to the global item, does not neet do change. XXX
      return formData;
    }

    if(this.actor.profession.id) { // there was a Profession, and it changed. Delete the old one
      await this.actor.deleteEmbeddedDocuments("Item", [this.actor.profession.id]);
    }

    await this.actor.createEmbeddedDocuments('Item', [ mergeObject(globalProfessionItem.toObject(), { data: { originalProfessionId : globalProfessionId, originalProfessionName: globalProfessionItem.name }}) ]);
    
    return formData;
  }

  /** @override */
  _onUpdateEmbeddedDocuments(embeddedName, documents, result, options, userId) {
    this.consolidateDamage();
    super._onUpdateEmbeddedDocuments(embeddedName, documents, result, options, userId);
  }

  /** @override */
  async _updateObject(event, formData) {
    formData = LanguageSheetHelper.updateLanguages(formData, this);
    formData = await this._updateRace(formData);
    formData = await this._updateProfession(formData);
    formData = await this._updateEmbeddedItems(formData);
    formData = await Merp1eActionTab.updateObject(event, formData, this)

    //this.actor.health.consolidateDamage();
    //this.updateHealth();

    return await this.object.update(formData);
  }

  async onClickSkillControl(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const action = target.dataset.action;
    const item = target.closest(".item");
    const skillID = item?.dataset?.itemId;
    const skill = this.actor.getEmbeddedDocument("Item", skillID);

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
      await this.actor.createEmbeddedDocuments("Item", [{ name: game.i18n.localize("MERP1E.Item.New") + " " + skill.name, type: skill.type, data: skill.data.data }], { renderSheet: true });
      break;
    case "roll-maneuver":
      if (event.ctrlKey) {
        Merp1eRollChooserApplication.create({actorID: skill.parent.id, skillID : skill.id});  
      } else {
        game.merp1e.Merp1eRules.rollManeuver(skill);
      }
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
  isDisabledByElement(name) {
    return document.getElementsByName(name)[0].disabled;
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
  static onKeyDown(event) {
    if (event.which == "17") {
      $(".skill-rolltype-choose").show();
      $(".skill-rolltype-automatic").hide();
    }
  }
  static onKeyUp(event) {
    if (event.which == "17") {
      $(".skill-rolltype-choose").hide();
      $(".skill-rolltype-automatic").show();
    }
  }
}

