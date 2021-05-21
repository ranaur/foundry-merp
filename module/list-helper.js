export class ListSheetHelper {
    /* -------------------------------------------- */
    /**
     * Listen for click events and modify attribute groups.
     * @param {MouseEvent} event    The originating left click event
     */
    static async onClickControl(event) {
        event.preventDefault();
        const a = event.currentTarget;
        const action = a.dataset.action;

        switch ( action ) {
        case "create":
          ListSheetHelper.createListItem(event, this);
          break;
        case "delete":
          ListSheetHelper.deleteListItem(event, this);
          break;
        }
    }
  
    /* ------------------------------------
    /**
     * Create new list item.
     * @param {MouseEvent} event    The originating left click event
     * @param {Object} app          The form application object.
     * @private
     */
    static async createListItem(event, app) {
    const a = event.currentTarget;
      let listRoot = a.closest('.list');
      let listData = listRoot.getElementsByClassName("list-data")[0];
      let dataArray = listRoot.getAttribute("data-array");
      let dataFields = listRoot.getAttribute("data-fields").split(",");
      let dataDTypes = listRoot.getAttribute("data-fields").split(",");

      // Calculate the new index
      let newIndex = 0;
      for (let item of listData.children) {
        if( item.getAttribute("data-index") > newIndex ) {
          newIndex = parseInt(item.getAttribute("data-index").toString());
        }
      }
      newIndex++;
      
      let newKey = document.createElement("li");
      let innerHTML = "";
      let i = 1;
      for(let item of dataFields ) {
        innerHTML = innerHTML + `<input type="hidden" name="data.${dataArray}.${newIndex}.${item}" value="" data-dtype="${dataDTypes[i]}"/>`;
        i++;
      }

      newKey.innerHTML = innerHTML;
  
      // Append the form element and submit the form.
      //newKey = newKey.children[0];
      listData.appendChild(newKey);
      await app._onSubmit(event);
    }
  
    /**
     * Delete a list item.
     * @param {MouseEvent} event    The originating left click event
     * @param {Object} app          The form application object.
     * @private
     */
    static async deleteListItem(event, app) {
      const a = event.currentTarget;
      let listItem = a.closest(".list-item");

      listItem.parentElement.removeChild(listItem);
      await app._onSubmit(event);
    }
    
    /* -------------------------------------------- */
  /* -------------------------------------------- */

  /**
   * Update languages when updating an actor object.
   *
   * @param {Object} formData Form data object to modify keys and values for.
   * @returns {Object} updated formData object.
   */
   static update(formData, entity, dataArray) {
    // Handle the free-form groups list
    const expandedForm = expandObject(formData).data[dataArray] || {};

    // Put everything in sequential order
    let newForm = {};
    let idx = 0;
    for(let itemKey of Object.keys(expandedForm)) {
      newForm[`${idx}`] = expandedForm[itemKey];
      idx++;
    }

    let maxIndex = parseInt(Object.keys(expandedForm).reduce((res, idx) => { return res > idx ? res : idx; }, 0)) + 1;

    // Remove groups which are no longer used
    for(let idx = Object.keys(newForm).length; idx < maxIndex; idx++) {
      newForm[`-=${idx}`] = null;
    }

    // Re-combine formData
    let newData = {_id: entity.object._id }; 
    newData["data." + dataArray] = newForm;
    formData = Object.entries(formData).filter(e => !e[0].startsWith("data." + dataArray)).reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, newData);

    return formData;
  }
}