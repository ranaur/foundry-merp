export class LanguageSheetHelper {

  static activateListeners(html, actor) {
    html.find('.language-create').click(LanguageSheetHelper.languageCreate.bind(actor));
    html.find('.language-edit').click(LanguageSheetHelper.languageEdit.bind(actor));
    html.find('.language-delete').click(LanguageSheetHelper.languageDelete.bind(actor));
    html.find('.language-add-all').click(LanguageSheetHelper.languageAddAll.bind(actor));
  }

  static languageCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    
    // Get the type of item to create.
    const type = "language"; //header.dataset.type;
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    //delete itemData.data["type"];

    return this.createEmbeddedDocuments("Item", [itemData], {renderSheet: true, render: false});
  }
  static languageEdit(event) {
    const itemId = $(event.currentTarget).parents(".item").data("itemId");

    const item = this.getEmbeddedDocument("Item", itemId);

    item.sheet.render(true);
  }
  static languageDelete(event) {
    const li = $(event.currentTarget).parents(".item");
    const itemId = li.data("itemId");

    this.deleteEmbeddedDocuments("Item", [itemId]);

    li.slideUp(200, () => this.render(false));
  }

  static languageAddAll(event) {
    const raceLanguages = this.race.data.data.languages;
    
    let languagesToCreate = [];
    let languagesToUpdate = [];
    for(let language of Object.values(raceLanguages)) {
      const actorLanguage = this.getLanguageByName(language.name);
      if(actorLanguage.length != 0) {
        let newLanguageData = actorLanguage[0].data.data;
        if(newLanguageData.ranks > language.ranks) {
          languagesToUpdate.push({ _id: actorLanguage[0].id, type: "language", name: language.name, data: newLanguageData });
        }
      } else { // actor has no language with same name yet, lookup global and create
        const gameLanguage = game.merp1e.Merp1eRules.getAvaliableLanguageByName(language.name);
        let newLanguageData = null;
        if(gameLanguage.length != 0) {
          newLanguageData = gameLanguage[0].data.data;
          newLanguageData.ranks = language.ranks;
        } else { // Not found, create new Language
          newLanguageData = {
              ranks: language.ranks
          }
        }
        languagesToCreate.push({ name: language.name, type: "language", data: newLanguageData });
      }
      
    }

    this.updateEmbeddedDocuments("Item", languagesToUpdate, {renderSheet: false, render: false});
    return this.createEmbeddedDocuments("Item", languagesToCreate, {renderSheet: false, render: false});
  }

  static updateLanguages(formData, sheet) {
    const formItems = expandObject(formData).languages || {};
    const updatetedItems = [];
    for ( let [itemId, item] of Object.entries(formItems || {}) ) {
        updatetedItems.push({_id: itemId, data: item, name: item.name});
    }

    sheet.actor.updateEmbeddedDocuments("Item", updatetedItems);
    
    // remove formData.languages
    formData = Object.entries(formData).filter(e => !e[0].startsWith("languages")).reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, {});
    
    return formData;
  }
}