export class ArraySheetHelper {

    /**
     * Constructor
     * @param {string} type           The identifier for the list in the HTML and in the data. The array will be in data.${type}
     * @param {Object} sheet          The form application object.
     * @param {Object} defalutItem    The default values.
     */
     constructor(type, sheet, defaultItem) {
      this.type = type;
      this.sheet = sheet;
      this.defaultItem = defaultItem;
    }
  
    /**
     * Activate standard listeners
     */
     activateListeners(html) {
      html.find(`.${this.type}-create`).click(this.listCreateItem.bind(this));
      html.find(`.${this.type}-delete`).click(this.listDeleteItem.bind(this));
    }
  
    /**
     * Create new list item.
     * @param {MouseEvent} event    The originating left click event
     * @param {Object} app          The form application object.
     * @private
     */
    async listCreateItem(event, sheet) {
      const a = event.currentTarget;
      let listRoot = a.closest(`.${this.type}`);
      let listData = listRoot.getElementsByClassName(`${this.type}-list`)[0];
      let numberElements = listData.children.length;
      let newIndex = numberElements + 1;
      
      let newKey = document.createElement("li");
      let innerHTML = "";
      let i = 1;
      for(let [fieldName, fieldDefault] of Object.entries(this.defaultItem) ) {
        innerHTML = innerHTML + `<input type="hidden" name="data.${this.type}.${newIndex}.${fieldName}" value="${fieldDefault}"/>`;
        i++;
      }
  
      newKey.innerHTML = innerHTML;
  
      // Append the form element and submit the form.
      //newKey = newKey.children[0];
      listData.appendChild(newKey);
      await this.sheet._onSubmit(event);
    }
    
    /**
     * Delete a list item.
     * @param {MouseEvent} event    The originating left click event
     * @param {Object} app          The form application object.
     * @private
     */
    async listDeleteItem(event, app) {
      const a = event.currentTarget;
      let listItem = a.closest(`.${this.type}-list-item`);
  
      listItem.parentElement.removeChild(listItem);
      await this.sheet._onSubmit(event);
    }
      
    /**
     * @param {Object} formData Form data object to modify keys and values for.
     * @returns {Object} updated formData object.
     */
    updateObject(formData) {
      const expandedForm = expandObject(formData)?.data?.[this.type] || {};
  
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
      
      let newData = {}; 
      newData["data." + this.type] = newForm;
      formData = Object.entries(formData).filter(e => !e[0].startsWith("data." + this.type)).reduce((obj, e) => {
        obj[e[0]] = e[1];
        return obj;
      }, newData);
  
      return formData;
    }
  }
  
  