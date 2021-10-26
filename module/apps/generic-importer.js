export class GenericImporter extends FormApplication {
  LINE_SEPARATOR = "\n";
  FIELD_SEPARATOR = "\t";

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "generic-importer",
      classes: ["generic-importer"],
      title: "Generic Importer",
      template: "systems/merp1e/templates/apps/generic-importer.html"
    });
  }

  /** @override */
  async getData(options) {
    const sheetData = {
      cssClass : "generic-importer-window",
      itemTypes: Item.metadata.types,
      actorTypes: Actor.metadata.types,
      data: {},
      file: []
    };
    return sheetData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find(".dialog-button").on("click",this._dialogButton.bind(this));
  }

  /*get form() {
    return $("form.generic-importer-window")[0];
  }*/

  get importType() {
    return this.form.elements["import-type"].value;
  }

  get files() {
    return this.form.data.files;
  }

  async getFileLines() {
    let file;
    if (this.files.length) {
      file = await GenericImporterHelper.readBlobFromFile(this.files[0]);
      file = file.replace(/(\r)/gm, ""); // remove CRLF
    }
    return file.split(this.LINE_SEPARATOR);
  }

  async _dialogButton(event) {
    event.preventDefault();
    event.stopPropagation();
    const a = event.currentTarget;
    const action = a.dataset.button;
    
    return await this[action]?.(event);
  }

  buildActiveEffect(aeLine) {
    const aeFields = aeLine.split(EFFECT_FIELD_SEPARATOR);

    const aeType = aeFields?.[0];
    switch(aeType) {

    }
  }
  async import() {
    const lines = await this.getFileLines();

    let headerLine = [];
    for(let idx = 0; idx < lines.length; idx++) {
      let line = lines[idx];
      let row = line.split(this.FIELD_SEPARATOR);
      if(idx == 0) {
        headerLine = row;
      } else {
        if(row.length != headerLine.length) continue;
        let config = {
          type: this.importType,
          folder: null
        };
        for(let colIdx = 0; colIdx < headerLine.length; colIdx++) {
          let key = headerLine[colIdx];
          let value = row[colIdx];

          // if field is folder, search for a folder with the name and return the id
          if(key == "folder") {
            let folder = await this.getFolder(value);
            value = folder?.data._id;
          }
          if(key == "activeEffects") {
            value = value.split(this.EFFECT_SEPARATOR);
          }
          if(key[0] == "@") { // make a lookup on item
            key = key.substring(1); // strip '@'
            let entity = game.items.getName(value);
            if(entity) {
              value = entity.id;
            } else {
              value = null;
            }
            
          }

          if(value != null && value != "") config[key] = value;
          if(value == "true") config[key] = true;
          if(value == "false") config[key] = false;
        }

        config = await expandObject(config);
            
        const activeEffectsJSON = config.activeEffects;
        delete config.activeEffect;
        let documents;
        let item = game.items.find((item) => { return item.data.name == config.name && item.data.folder == config.folder});
        if(item) {
          console.log(`Updating ${config.name}`)
          const updateData = { data: config, _id: item.id };
          documents = await Item.updateDocuments([updateData]);
          if(activeEffectsJSON) {
            // delete Active effects to override
            const actveEffects = item.getEmbeddedCollection("ActiveEffects");
            const activeEffectsIDs = actveEffects?.reduce((acc, ae) => {acc.push[ae.id]; return acc; }, []);
            
            Item.deleteEmbeddedDocuments("ActiveEffects", activeEffectsIDs);
          }
        } else {
          console.log(`Creating ${config.name}`)
          documents = await Item.createDocuments([config]);
        }
        if(activeEffectsJSON) {
          activeEffects = JSON.parse(activeEffectsJSON);
          if(!Array.isArray(activeEffects)) activeEffects = [activeEffects];
          documents[0].createEmbeddedDocuments("ActiveEffect", aeData);
        }
      }
    }
    ui.notifications.info(`End of import`);
  }

  async getFolder(path) {
    if(!path) return null;
    let folders = path.split("\\");
    let lastFolder = null;
    for(let folder of folders) {
      if(lastFolder == null) { // first folder of path
        let search = game.folders.getName(folder);
        if(search) {
          lastFolder = search;
        } else { 
          lastFolder = await Folder.create({
            color: "",
            name: folder,
            parent: null,
            sorting: "a",
            type: "Item"
          });
        }
      } else { // rest of folders
        let search = await lastFolder.children.filter((item) => { return item.name == folder; });
        if(search.length == 0) {
          lastFolder = await Folder.create({
            color: "",
            name: folder,
            parent: lastFolder.data._id,
            sorting: "a",
            type: "Item"
          });
        } else {
          lastFolder = search[0];
        }
      }
    }
    return lastFolder;
  }
};

class GenericImporterHelper {
  static async readBlobFromFile(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = ev => {
        resolve(reader.result);
      };
      reader.onerror = ev => {
        reader.abort();
        reject();
      };
      reader.readAsBinaryString(file);
    });
  }
}
