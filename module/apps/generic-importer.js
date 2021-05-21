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
      cssClass : "aie-importer-window"
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
      const form = $("form.aie-importer-window")[0];
      const type = form.elements["import-type"].value;

      let file;
      if (form.data.files.length) {
        importFilename = form.data.files[0].name;
        file = await GenericImporterHelper.readBlobFromFile(form.data.files[0]);
        file = file.replace(/(\r)/gm, "");
      }
      const lines = file.split("\n");
      let headerLine = [];
      lines.forEach(async (line, idx) => {
        let row = line.split(";");
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
                let search = game.folders.getName(value); //game.folders.entries.filter((item) => { return item.data.name == value } );
                if(search) {
                  value = search.data._id;
                } else { 
                  
                  let folder = await Folder.create({
                    color: "",
                    name: value,
                    parent: null,
                    sorting: "a",
                    type: "Item"
                  });  // XXX create folder that doesn't exist?
                  value = folder.data._id;
                }
              }
              config[key] = value;
            }
            //this._create(data);
            config = expandObject(config);
            
            let item = game.items.getName(config.name);
            if(item) {
              Item.update(mergeObject(item.data, config));
            } else {
              Item.create(config);
            }
          }
        }
      });
    }
  }
//  _create(event) {
//    let item = await Item.create(data);
//  }
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
