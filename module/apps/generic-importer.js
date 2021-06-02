export class GenericImporter extends FormApplication {
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
    let data;
    let files = [];

    return {
      data,
      files,
      cssClass : "generic-importer-window"
    };
  
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find(".dialog-button").on("click",this._dialogButton.bind(this));
  }

  async _dialogButton(event) {
    event.preventDefault();
    event.stopPropagation();
    const a = event.currentTarget;
    const action = a.dataset.button;
    
    if(action === "import") {
      let importFilename;
      const form = $("form.generic-importer-window")[0];
      const type = form.elements["import-type"].value;

      let file;
      if (form.data.files.length) {
        importFilename = form.data.files[0].name;
        file = await GenericImporterHelper.readBlobFromFile(form.data.files[0]);
        file = file.replace(/(\r)/gm, "");
      }
      const lines = file.split("\n");
      let headerLine = [];
      for(let idx = 0; idx < lines.length; idx++) {
        let line = lines[idx];
        let row = line.split("\t");
        if(idx == 0) {
          headerLine = row;
        } else {
          if(row.length == headerLine.length) { 

            let config = {
              type: type,
              folder: null
            };
            for(let colIdx = 0; colIdx < headerLine.length; colIdx++) {
              let key = headerLine[colIdx];
              let value = row[colIdx];
              // if field is folder, search for a folder with the name and return the id
              if(key == "folder") {
/*                let search = game.folders.getName(value); //game.folders.entries.filter((item) => { return item.data.name == value } );
                if(search) {
                  value = search.data._id;
                } else { 
                  
                  let folder = await Folder.create({
                    color: "",
                    name: value,
                    parent: null,
                    sorting: "a",
                    type: "Item"
                  });
                  value = folder.data._id;
                */
                let folder = await this.getFolder(value);
                value = folder.data._id;
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
            }
            //this._create(data);
            config = await expandObject(config);
            
            //let item = game.items.getName(config.name);
            let item = game.items.filter((item) => { return item.data.name == config.name && item.data.folder == config.folder});
            if(item.length > 0) {
              console.log(`Updating ${config.name}`)
              Item.update(mergeObject(item[0].data, config));
            } else {
              console.log(`Creating ${config.name}`)
              Item.create(config);
            }
          }
        }
      }
      console.log(`End import`);
    }
  }
  async getFolder(path) {
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
