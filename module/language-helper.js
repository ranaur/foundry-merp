export class LanguageSheetHelper {
    /* -------------------------------------------- */
    /**
     * Listen for click events and modify attribute groups.
     * @param {MouseEvent} event    The originating left click event
     */
    static async onClickLanguageControl(event) {
        event.preventDefault();
        const a = event.currentTarget;
        const action = a.dataset.action;

        switch ( action ) {
        case "create-language":
            LanguageSheetHelper.createLanguage(event, this);
            break;
        case "delete-language":
            LanguageSheetHelper.deleteLanguage(event, this);
            break;
        }
    }
  
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
  /* -------------------------------------------- */

  /**
   * Update languages when updating an actor object.
   *
   * @param {Object} formData Form data object to modify keys and values for.
   * @returns {Object} updated formData object.
   */
   static updateLanguages(formData, entity) {
    // Handle the free-form groups list
    const formLanguages = expandObject(formData).data.languages || {};

    // XXX Reduce errors

    // Remove groups which are no longer used
    for ( let k of Object.keys(entity.object.data.data.languages) ) {
      if ( !formLanguages.hasOwnProperty(k) ) formLanguages[`-=${k}`] = null;
    }

    // Re-combine formData
    formData = Object.entries(formData).filter(e => !e[0].startsWith("data.languages")).reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, {_id: entity.object._id, "data.languages": formLanguages});

    return formData;
  }
}