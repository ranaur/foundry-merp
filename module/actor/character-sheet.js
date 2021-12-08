import { LanguageSheetHelper } from '../language-helper.js';
import { Merp1eBaseSheet } from './base-sheet.js';
import { Merp1eRollChooserApplication } from '../apps/roll-chooser.js';
import { Merp1eItemEffect } from '../effect/item-effects.js';
import { Merp1eActiveEffectHelper } from '../effect/effect-helper.js';

class Merp1eActionsTab {
  static getData(sheetData, sheet) {
    sheetData.knownSpellLists = sheet.actor.spellcasting.getKnownSpellLists();
    sheetData.actions = game.merp1e.Merp1eRules.actions;
    sheetData.data.data.action ??= {};
    sheetData.data.data.action.roundsSpellPrepared ??= 0;
    sheetData.getPrepareBonus = sheetData.rules.spell.getPrepareBonus(sheetData.data.data.action.roundsSpellPrepared);
    //sheetData.targets = game.user.targets;
/*
    sheetData.combat = sheet.actor.getCombats()?.[0]; // XXX get currnet combat?
    sheetData.combatants = {};
    sheetData.combat.combatants.forEach((token) => {
      sheetData.combatants[token.id] = token.name;
    });
*/
    sheetData.attacks = sheet.actor.attacks;
    return sheetData;
  }

  static updateObject(event, formData, sheet) {
    return formData;
  }

  static activateListeners(html, sheet) {
    html.find(".actions").on("click", ".action-control", this.onClickControl.bind(sheet));
  }

  static async onClickControl(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const action = target.dataset.action;
    const li = target.closest("li");
    //const item = li.dataset.itemId ? this.actor.items.get(li.dataset.itemId) : null;
    //const effect = li.dataset.effectId ? item.effects.get(li.dataset.itemId) : null;
    const attack = this.actor.attacks.find((at) => at.item.id == li.dataset.itemId && at.effect.id == li.dataset.effectId);
    
    switch ( action ) {
      case "prepare-to-cast":
        const tab = target.closest(".tab");
        const chooser = tab.getElementsByClassName("action-chooser");
        chooser[0].value = "castSpell";
        this.submit();
        break;
      case "unsheathe":
          const place = target.dataset.place;
          return await attack.unsheathe(place == "dominant hand");
      case "sheathe":
          return await attack.sheathe();
      case "drop":
        throw "XXX";
        break;
      case "missile-attack":
        return await attack.rollMissile();
      case "melee-attack":
        return await attack.rollMelee();
      case "throw-attack":
        return await attack.rollThrow();
    }
  }
}

class Merp1eInjuriesTab {
  static activateListeners(html, sheet) {
    Merp1eActiveEffectHelper.activateListeners(html, sheet.actor);
  }
  static getData(sheetData, sheet) {
    sheetData.statuses = game.merp1e.Merp1eRules.injury.statuses;
    sheetData.bodyGroups = game.merp1e.Merp1eRules.injury.bodyGroups;
    sheetData.bodyGroupsBilateral = game.merp1e.Merp1eRules.injury.bodyGroupsBilateral;
    return sheetData;
  }
}

class Merp1eEffectsTab {
  static getData(sheetData, sheet) {
    sheetData.effectNamesLabels = Object.values(Merp1eItemEffect.registeredAdapterClasses).reduce((acc, cls) => { acc[cls.effectName] = cls.label; return acc; }, {});
    sheetData.effectList = sheet.object.effects.reduce((acc, effect) => {
      let origin = effect.data.origin.split(".");
      //let actorID = origin[1];
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
      return acc
    }, []);

    return sheetData;
  }

  static updateObject(event, formData, sheet) {
    return formData;
  }

  static activateListeners(html, sheet) {
  }

  static async onClickControl(event) {
  }

}


class Merp1eEquipmentsTab {
  static getData(sheetData, sheet) {
    sheetData.weightType = {
      total: "MERP1E.Location.Total",
      wearing: "MERP1E.Location.Wearing"
    };

    sheetData.equipmentsByLocation = Merp1eEquipmentsTab.getEquipmentsByLocation(sheet.actor);
    return sheetData;
  }

  static updateObject(event, formData, sheet) {
    return formData;
  }

  static activateListeners(html, sheet) {
  }

  static async onClickControl(event) {
  }

  static getEquipmentsInLocation(actor, location) {
    let res = [];
    Object.values(actor.equipments).forEach((itm) => {
      if(itm.data.data.location == location) {
        res.push(itm);
        if(itm.data.data.isContainer) {
          let subItems = Merp1eEquipmentsTab.getEquipmentsInLocation(actor, itm.id);
          subItems.forEach((sbi) => res.push(sbi));
        }
      }
    });
    return res;
  }

  static getEquipmentsByLocation(actor) {
    let res = [];
    Merp1eEquipmentsTab.getEquipmentsInLocation(actor, "wearing").forEach((itm) => res.push(itm));
    Merp1eEquipmentsTab.getEquipmentsInLocation(actor, "carrying").forEach((itm) => res.push(itm));
    Merp1eEquipmentsTab.getEquipmentsInLocation(actor, "stored").forEach((itm) => res.push(itm));
    let ids = res.reduce((acc, itm) => { acc.push(itm.id); return acc;}, []);
    Object.values(actor.equipments).filter((itm) => {
      return !ids.includes(itm.id);
    }).forEach((itm) => res.push(itm));;
    return res;
  }
}


class Merp1eHealthTab {
  static getData(sheetData, sheet) {
    return sheetData;
  }

  static updateObject(event, formData, sheet) {
    return formData;
  }

  static activateListeners(html, sheet) {
    html.find(".health").on("click", ".health-control", this.onClickControl.bind(sheet));
  }

  static async onClickControl(event) {
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
      await Merp1eHealthTab.updateHealth(this);
      break;
    case "next-round":
      this.actor.health.nextRound();
      await Merp1eHealthTab.updateHealth(this);
      break;
    case "heal":
      // XXX
      break;
    }
  }

  static async updateHealth(sheet) {
    sheet.setValueToElement("data.healthStatus.hitsTaken", sheet.actor.health.hitsTaken);
    sheet.setValueToId("hitsLeft", sheet.actor.health.hitsLeft);
    sheet.setValueToId("maximumHPDie", sheet.actor.health.maximumHPDie);
    sheet.setValueToId("maximumHPOut", sheet.actor.health.maximumHPOut);
    sheet.setValueToElement("data.healthStatus.hitsPerRound", sheet.actor.health.status.hitsPerRound);
    sheet.setValueToElement("data.healthStatus.activityPenalty", sheet.actor.health.status.activityPenalty);
    sheet.setValueToElement("data.healthStatus.roundsStunned", sheet.actor.health.status.roundsStunned);
    sheet.setValueToElement("data.healthStatus.roundsDown", sheet.actor.health.status.roundsDown);
    sheet.setValueToElement("data.healthStatus.roundsOut", sheet.actor.health.status.roundsOut);
    sheet.setValueToElement("data.healthStatus.roundsUntilDeath", sheet.actor.health.status.roundsUntilDeath);
    sheet.setValueToElement("data.healthStatus.roundsBlinded", sheet.actor.health.status.roundsBlinded);
    sheet.setValueToElement("data.healthStatus.roundsWeaponStuck", sheet.actor.health.status.roundsWeaponStuck);
    sheet.setValueToElement("data.healthStatus.unconsciousComa", sheet.actor.health.status.unconsciousComa);
    sheet.setValueToElement("data.healthStatus.paralyzed", sheet.actor.health.status.paralyzed);
    sheet.setValueToElement("data.healthStatus.hearingLoss", sheet.actor.health.status.hearingLoss);
    sheet.setValueToElement("data.healthStatus.eyeLoss", sheet.actor.health.status.eyeLoss);
    sheet.setValueToElement("data.healthStatus.leftArm", sheet.actor.health.status.leftArm);
    sheet.setValueToElement("data.healthStatus.rightArm", sheet.actor.health.status.rightArm);
    sheet.setValueToElement("data.healthStatus.leftLeg", sheet.actor.health.status.leftLeg);
    sheet.setValueToElement("data.healthStatus.rightLeg", sheet.actor.health.status.rightLeg);
    
    sheet.submit();
  }
}

class Merp1eMoneyTab {
  static getData(sheetData, sheet) {
    sheetData.money = sheetData.rules.currencies.reduce((acc, cur) => {
      let items = Object.values(sheet.actor.equipments).filter((itm) => itm.data.data.unitaryValueCurrency == cur.id && itm.value > 0 );
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
    return sheetData;
  }

  static activateListeners(html, sheet) {
  }

  static updateObject(event, formData, sheet) {
    return formData;
  }

  static async onClickControl(event) {
  }

}

class Merp1eSkillsTab {
  static getData(sheetData, sheet) {
    if(sheet.actor.data.skills = null) {
      sheetData.sheetOrder ={}
    } else {
      sheetData.sheetOrder = game.merp1e.Merp1eRules.skill.generateSheetOrder(sheet.actor.skills);
    }

    return sheetData;
  }

  static updateObject(event, formData, sheet) {
    return formData;
  }

  static activateListeners(html, sheet) {
    html.find(".skills").on("click", ".skill-control", this.onClickControl.bind(sheet));
  }

  static async onClickControl(event) {
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
      case "add-adolescence":
        Merp1eSkillsTab.fillAdolescenceSkillRanks(this);
        break;
    }
  }

  static fillAdolescenceSkillRanks(sheet) {
    const actor = sheet.actor;
    const race = sheet.actor.race;
    if(race.id) {
      const adolescenceSkillRanks = race.data.data.adolescenceSkillRanks;
      
      Object.values(actor.skills).forEach((sk) => {
        const element = document.getElementsByName(`Item.${sk.id}.ranks`)?.[0];
        
        if(element) element.value = adolescenceSkillRanks?.[sk.reference] || 0;
      });

      sheet.submit();
    }
  }
}

class Merp1eSpecialsTab {
  static getData(sheetData, sheet) {
    sheetData.specialTypesIcons = game.merp1e.Merp1eRules.special.types.reduce((acc, spc) => { acc[spc.id] = spc.icon; return acc; }, {});
    sheetData.specialTypes = game.merp1e.Merp1eRules.special.types.reduce((acc, spc) => { acc[spc.id] = spc.label; return acc; }, {});
    return sheetData;
  }

  static updateObject(event, formData, sheet) {
    return formData;
  }

  static activateListeners(html, sheet) {
  }

  static async onClickControl(event) {
  }

}

class Merp1eSpellsTab {
  static getData(sheetData, sheet) {
    return sheetData;
  }

  static updateObject(event, formData, sheet) {
    return formData;
  }

  static activateListeners(html, sheet) {
    html.find(".spells").on("click", ".spell-control", this.onClickControl.bind(sheet));
  }

  static async onClickControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;

    switch ( action ) {
      case "reset":
        //let inputElement = event.currentTarget.parentNode.getElementsByTagName("input")[0];
        //inputElement.value = this.object.powerPointsMaximum;
        document.getElementsByName("data.spellcasting.powerPointsCurrent")[0].value = this.actor.spellcasting.powerPointsMaximum;
        this.submit();
        break;
    }
  }
}

class Merp1eXPTab {
  static getData(sheetData, sheet) {
    return sheetData;
  }

  static updateObject(event, formData, sheet) {
    return formData;
  }

  static activateListeners(html, sheet) {
    html.find(".xp").on("click", ".xp-control", this.onClickControl.bind(sheet));
  }

  static async onClickControl(event) {
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
      throw "Character sheet is trying to edit something that is not a character"; // XXX
      return sheetData;
    }

    sheetData.avaliableRaces = sheetData.rules.getAvaliableRaces();
    sheetData.actorRaceId = sheetData.rules.getItemByTypeIdName("race", this.actor.race.data?.originalId, this.actor.race.name)?.id;
    
    sheetData.avaliableProfessions = sheetData.rules.getAvaliableProfessions();
    sheetData.actorProfessionId = sheetData.rules.getItemByTypeIdName("profession", this.actor.profession.data?.originalId, this.actor.profession.name)?.id;

    sheetData = Merp1eActionsTab.getData(sheetData, this);
    sheetData = Merp1eEffectsTab.getData(sheetData, this);
    sheetData = Merp1eEquipmentsTab.getData(sheetData, this);
    sheetData = Merp1eHealthTab.getData(sheetData, this);
    sheetData = Merp1eInjuriesTab.getData(sheetData, this);
    sheetData = Merp1eMoneyTab.getData(sheetData, this);
    sheetData = Merp1eSkillsTab.getData(sheetData, this);
    sheetData = Merp1eSpecialsTab.getData(sheetData, this);
    sheetData = Merp1eSpellsTab.getData(sheetData, this);
    sheetData = Merp1eXPTab.getData(sheetData, this);

    return sheetData;
  }

    /** @override */
  getData() {
    let sheetData = super.getData();

    sheetData.settings = game.merp1e.Merp1eRules.settings;
    sheetData.rules = game.merp1e.Merp1eRules;

    sheetData = this._prepareCharacter(sheetData);

    return sheetData;
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
  
  async _onActorControl(event) {
    event.preventDefault();
    const element = event.currentTarget;
    switch(element?.dataset?.action) {
      case "advanceRound":
      case "advanceHour":
      case "advanceDay":
        return await this.actor[element?.dataset?.action]?.();
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html.find('.actor-control').click(this._onActorControl.bind(this));

    LanguageSheetHelper.activateListeners(html, this.actor);

    html.find('.item-wear').click(this._onItemWear.bind(this));
    html.find('.item-unwear').click(this._onItemUnwear.bind(this));
    
    Merp1eActionsTab.activateListeners(html, this);
    Merp1eEffectsTab.activateListeners(html, this);
    Merp1eEquipmentsTab.activateListeners(html, this);
    Merp1eHealthTab.activateListeners(html, this);
    Merp1eInjuriesTab.activateListeners(html, this);
    Merp1eMoneyTab.activateListeners(html, this);
    Merp1eSkillsTab.activateListeners(html, this);
    Merp1eSpecialsTab.activateListeners(html, this);
    Merp1eSpellsTab.activateListeners(html, this);
    Merp1eXPTab.activateListeners(html, this);
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
    formData = await Merp1eActionsTab.updateObject(event, formData, this);
    formData = await Merp1eActionsTab.updateObject(event, formData, this);
    formData = await Merp1eActionsTab.updateObject(event, formData, this);
    formData = await Merp1eEffectsTab.updateObject(event, formData, this);
    formData = await Merp1eEquipmentsTab.updateObject(event, formData, this);
    formData = await Merp1eHealthTab.updateObject(event, formData, this);
    formData = await Merp1eMoneyTab.updateObject(event, formData, this);
    formData = await Merp1eSkillsTab.updateObject(event, formData, this);
    formData = await Merp1eSkillsTab.updateObject(event, formData, this);
    formData = await Merp1eSpecialsTab.updateObject(event, formData, this);
    formData = await Merp1eSpellsTab.updateObject(event, formData, this);
    formData = await Merp1eXPTab.updateObject(event, formData, this);

    return await this.object.update(formData);
  }

  /**** HTML methods */
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

  /*** XXX ??? **** */
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

