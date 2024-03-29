/**
 * The collection of data schema and document definitions for primary documents which are shared between the both the
 * client and the server.
 * @namespace documents
 */

import {Document} from "./abstract/module.mjs";
import * as data from "./data/data.mjs";
import {mergeObject, setProperty} from "./utils/helpers.mjs";
import * as CONST from "./constants.mjs";

/**
 * The base ActiveEffect model definition which defines common behavior of an ActiveEffect document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.ActiveEffectData} data     The constructed data object for the document.
 */
class BaseActiveEffect extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.ActiveEffectData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "ActiveEffect",
      collection: "effects",
      label: "DOCUMENT.ActiveEffect",
      isEmbedded: true
    });
  };

  /* ---------------------------------------- */

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    if ( this.parent instanceof BaseActor ) {
      this.data.update({transfer: false});
    }
  }

  /* ---------------------------------------- */

  /** @inheritdoc */
  testUserPermission(user, permission, {exact=false}={}) {
    if ( this.isEmbedded ) return this.parent.testUserPermission(user, permission, {exact});
    return super.testUserPermission(user, permission, {exact});
  }
}

/* ---------------------------------------- */

/**
 * The base Actor model definition which defines common behavior of an Actor document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.ActorData} data    The constructed data object for the document.
 */
class BaseActor extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.ActorData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Actor",
      collection: "actors",
      label: "DOCUMENT.Actor",
      embedded: {
        ActiveEffect: BaseActiveEffect,
        Item: BaseItem
      },
      isPrimary: true,
      hasSystemData: true,
      permissions: {
        create: "ACTOR_CREATE"
      },
      types: game?.system?.entityTypes?.Actor ?? [],
    });
  };

  /**
   * A reference to the Collection of embedded ActiveEffect instances in the Actor document, indexed by _id.
   * @returns {Collection<BaseActiveEffect>}
   */
  get effects() {
    return this.data.effects;
  }

  /**
   * A reference to the Collection of embedded Item instances in the Actor document, indexed by _id.
   * @returns {Collection<BaseItem>}
   */
  get items() {
    return this.data.items;
  }

  /* ---------------------------------------- */

  /**
   * Migrate the system data object to conform to data model defined by the current system version.
   * @see mergeObject
   * @param {object} options            Options which customize how the system data is migrated.
   * @param {boolean} options.insertKeys    Retain keys which exist in the current data, but not the model
   * @param {boolean} options.insertValues  Retain inner-object values which exist in the current data, but not the model
   * @param {boolean} options.enforceTypes  Require that data types match the model exactly to be retained
   * @return {object}                  The migrated system data object, not yet saved to the database
   */
  migrateSystemData({insertKeys=false, insertValues=true, enforceTypes=false}={}) {
    const model = game.system.model.Actor[this.data.type];
    if ( !model ) return;
    return mergeObject(model, this.data.data, {
      insertKeys,
      insertValues,
      enforceTypes,
      overwrite: true,
      inplace: false
    });
  }

  /* ---------------------------------------- */

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    if ( !this.data.token.name ) this.data.token.update({name: this.name});
    if ( this.data.img && (!this.data.token.img || (this.data.token.img === CONST.DEFAULT_TOKEN))) {
      this.data.token.update({img: this.data.img});
    }
  }

  /* ---------------------------------------- */

  /** @inheritdoc */
  async _preUpdate(changed, options, user) {
    if ( changed.img && !changed.token?.img ) {
      if ( !this.data.token.img || (this.data.token.img === CONST.DEFAULT_TOKEN) ) {
      setProperty(changed, "token.img", changed.img);
      }
    }
  }
}

/* ---------------------------------------- */

/**
 * The base AmbientLight model definition which defines common behavior of an AmbientLight document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.AmbientLightData} data   The constructed data object for the embedded document.
 */
class BaseAmbientLight extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.AmbientLightData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "AmbientLight",
      collection: "lights",
      label: "DOCUMENT.AmbientLight",
      isEmbedded: true,
    });
  };

  /** @inheritdoc */
  _initialize() {
    if ( this.data.darknessThreshold ) {
      this.data.update({"darkness.min": this.data.darknessThreshold, darknessThreshold: 0});
    }
  }
}

/* ---------------------------------------- */

/**
 * The base AmbientSound model definition which defines common behavior of an AmbientSound document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.AmbientSoundData} data   The constructed data object for the document.
 */
class BaseAmbientSound extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.AmbientSoundData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "AmbientSound",
      collection: "sounds",
      label: "DOCUMENT.AmbientSound",
      isEmbedded: true,
      types: ["l", "g"]
    });
  };
}

/* ---------------------------------------- */

/**
 * The base ChatMessage model definition which defines common behavior of an ChatMessage document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.ChatMessageData} data    The constructed data object for the document.
 */
class BaseChatMessage extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.ChatMessageData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "ChatMessage",
      collection: "messages",
      label: "DOCUMENT.ChatMessage",
      isPrimary: true,
      permissions: {
        create: this._canCreate,
        update: this._canUpdate,
        delete: this._canDelete
      }
    });
  };

  /**
   * Is a user able to create a new chat message?
   * @protected
   */
  static _canCreate(user, doc) {
    if ( user.isGM ) return true;
    if ( user.id !== doc.data.user ) return false;    // You cannot impersonate a different user
    return user.hasRole("PLAYER");                    // Any player can create messages
  }

  /**
   * Is a user able to update an existing chat message?
   * @protected
   */
  static _canUpdate(user, doc, data) {
    if ( user.isGM ) return true;                     // GM users can do anything
    const immutable = ["user", "roll"];               // You cannot change the user or roll
    if ( immutable.some(k => data.hasOwnProperty(k)) ) return false;
    return user.id === doc.data.user;                 // Otherwise message authors
  }

  /**
   * Is a user able to delete an existing chat message?
   * @protected
   */
  static _canDelete(user, doc) {
    if ( user.isGM ) return true;                     // GM users can do anything
    return user.id === doc.data.user;                 // Otherwise message authors
  }
}

/* ---------------------------------------- */

/**
 * The base Combatant model definition which defines common behavior of an Combatant document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.CombatantData} data    The constructed data object for the document.
 */
class BaseCombatant extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.CombatantData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Combatant",
      collection: "combatants",
      label: "DOCUMENT.Combatant",
      isEmbedded: true,
      permissions: {
        create: "PLAYER",
        update: this._canUpdate
      }
    });
  };

  /**
   * Is a user able to update an existing Combatant?
   * @protected
   */
  static _canUpdate(user, doc, data) {
    if ( user.isGM ) return true;                     // GM users can do anything
    const updateKeys = new Set(Object.keys(data));
    const allowedKeys = new Set(["_id", "initiative", "flags"]);
    return updateKeys.isSubset(allowedKeys)           // Players may only update initiative scores and flags
  }
}

/* ---------------------------------------- */

/**
 * The base Combat model definition which defines common behavior of an Combat document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.CombatData} data     The constructed data object for the document.
 */
class BaseCombat extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.CombatData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Combat",
      collection: "combats",
      label: "DOCUMENT.Combat",
      embedded: {
        Combatant: BaseCombatant
      },
      isPrimary: true,
      permissions: {
        update: this._canUpdate
      }
    });
  };

  /**
   * A reference to the Collection of Combatant instances in the Combat document, indexed by id.
   * @returns {Collection<BaseCombatant>}
   */
  get combatants() {
    return this.data.combatants;
  }

  /**
   * Is a user able to update an existing Combat?
   * @protected
   */
  static _canUpdate(user, doc, data) {
    if ( user.isGM ) return true;                     // GM users can do anything
    const turnOnly = ["_id", "round", "turn"];        // Players can only update the round or turn
    return Object.keys(data).every(k => turnOnly.includes(k));
  }
}

/* ---------------------------------------- */

/**
 * The base Drawing model definition which defines common behavior of an Drawing document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.DrawingData} data    The constructed data object for the embedded document.
 */
class BaseDrawing extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.DrawingData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Drawing",
      collection: "drawings",
      label: "DOCUMENT.Drawing",
      isEmbedded: true,
      permissions: {
        create: "DRAWING_CREATE",
        update: this._canModify,
        delete: this._canModify
      }
    });
  };

  /* ---------------------------------------- */

  /** @inheritdoc */
  testUserPermission(user, permission, {exact=false}={}) {
    if ( !exact && (user.id === this.data.author) ) return true; // The user who created the drawing
    return super.testUserPermission(user, permission, {exact});
  }

  /* ---------------------------------------- */

  /**
   * Is a user able to update or delete an existing Drawing document??
   * @protected
   */
  static _canModify(user, doc, data) {
    if ( user.isGM ) return true;                     // GM users can do anything
    return doc.data.author === user.id;               // Users may only update their own created drawings
  }
}

/* ---------------------------------------- */

/**
 * The base FogExploration model definition which defines common behavior of an FogExploration document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.FogExplorationData} data   The constructed data object for the document.
 */
class BaseFogExploration extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.FogExplorationData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "FogExploration",
      collection: "fog",
      label: "DOCUMENT.FogExploration",
      isPrimary: true,
      permissions: {
        create: "PLAYER",
        update: this._canUserModify,
        delete: this._canUserModify
      }
    });
  }

  /** @inheritdoc */
  async _preUpdate(changed, options, user) {
    changed.timestamp = Date.now();
  }

  /**
   * Test whether a User can modify a FogExploration document.
   * @protected
   */
  static _canUserModify(user, doc) {
    return (user.id === doc.data.user) || user.hasRole("ASSISTANT");
  }
}

/* ---------------------------------------- */

/**
 * The base Folder model definition which defines common behavior of an Folder document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.FolderData} data   The constructed data object for the document.
 */
class BaseFolder extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.FolderData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Folder",
      collection: "folders",
      label: "DOCUMENT.Folder",
      isPrimary: true,
      types: CONST.FOLDER_ENTITY_TYPES
    });
  }
}

/* ---------------------------------------- */

/**
 * The base Item model definition which defines common behavior of an Item document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.ItemData} data       The constructed data object for the document.
 */
class BaseItem extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.ItemData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Item",
      collection: "items",
      label: "DOCUMENT.Item",
      embedded: {
        ActiveEffect: BaseActiveEffect
      },
      isPrimary: true,
      hasSystemData: true,
      types: game?.system?.entityTypes?.Item ?? [],
      permissions: {
        create: "ITEM_CREATE"
      }
    });
  };

  /**
   * A reference to the Collection of ActiveEffect instances in the Item document, indexed by _id.
   * @returns {Collection<BaseActiveEffect>}
   */
  get effects() {
    return this.data.effects;
  }


  /* ---------------------------------------- */

  /** @inheritdoc */
  canUserModify(user, action, data={}) {
    if ( this.isEmbedded ) return this.parent.canUserModify(user, "update");
    return super.canUserModify(user, action, data);
  }

  /* ---------------------------------------- */

  /** @inheritdoc */
  testUserPermission(user, permission, {exact=false}={}) {
    if ( this.isEmbedded ) return this.parent.testUserPermission(user, permission, {exact});
    return super.testUserPermission(user, permission, {exact});
  }

  /* ---------------------------------------- */

  /**
   * Migrate the system data object to conform to data model defined by the current system version.
   * @see mergeObject
   * @param {object} options            Options which customize how the system data is migrated.
   * @param {boolean} options.insertKeys    Retain keys which exist in the current data, but not the model
   * @param {boolean} options.insertValues  Retain inner-object values which exist in the current data, but not the model
   * @param {boolean} options.enforceTypes  Require that data types match the model exactly to be retained
   * @return {object}                  The migrated system data object, not yet saved to the database
   */
  migrateSystemData({insertKeys=false, insertValues=true, enforceTypes=false}={}) {
    const model = game.system.model.Item[this.data.type];
    if ( !model ) return;
    return mergeObject(model, this.data.data, {
      insertKeys,
      insertValues,
      enforceTypes,
      overwrite: true,
      inplace: false
    });
  }
}

/* ---------------------------------------- */

/**
 * The base JournalEntry model definition which defines common behavior of an JournalEntry document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.JournalEntryData} data   The constructed data object for the document.
 */
class BaseJournalEntry extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.JournalEntryData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "JournalEntry",
      collection: "journal",
      label: "DOCUMENT.JournalEntry",
      isPrimary: true,
      permissions: {
        create: "JOURNAL_CREATE"
      }
    });
  }
}

/* ---------------------------------------- */

/**
 * The base Macro model definition which defines common behavior of an Macro document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.MacroData} data    The constructed data object for the document.
 */
class BaseMacro extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.MacroData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Macro",
      collection: "macros",
      label: "DOCUMENT.Macro",
      isPrimary: true,
      types: Array.from(Object.values(CONST.MACRO_TYPES)),
      permissions: {
        create: "PLAYER",
        update: this._canUpdate,
        delete: this._canDelete
      }
    });
  };

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    this.data.update({author: user.id});
  }

  /**
   * Is a user able to update an existing Macro document?
   * @protected
   */
  static _canUpdate(user, doc, data) {
    if ( user.isGM ) return true;                     // GM users can do anything
    return user.id === doc.data.author;               // Otherwise Macro authors
  }

  /**
   * Is a user able to delete an existing Macro document?
   * @protected
   */
  static _canDelete(user, doc) {
    if ( user.isGM ) return true;                     // GM users can do anything
    return user.id === doc.data.author;               // Otherwise Macro authors
  }
}

/* ---------------------------------------- */

/**
 * The base MeasuredTemplate model definition which defines common behavior of an MeasuredTemplate document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.MeasuredTemplateData} data   The constructed data object for the embedded document.
 */
class BaseMeasuredTemplate extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.MeasuredTemplateData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "MeasuredTemplate",
      collection: "templates",
      label: "DOCUMENT.MeasuredTemplate",
      isEmbedded: true,
      permissions: {
        create: "TEMPLATE_CREATE",
        update: this._canModify,
        delete: this._canModify
      }
    });
  };

  /* ---------------------------------------- */

  /** @inheritdoc */
  testUserPermission(user, permission, {exact=false}={}) {
    if ( !exact && (user.id === this.data.user) ) return true; // The user who created the template
    return super.testUserPermission(user, permission, {exact});
  }

  /* ---------------------------------------- */

  /**
   * Is a user able to modify an existing MeasuredTemplate?
   * @protected
   */
  static _canModify(user, doc, data) {
    if ( user.isGM ) return true;                     // GM users can do anything
    return doc.data.user === user.id;                 // Users may only update their own created templates
  }
}
/* ---------------------------------------- */

/**
 * The base Note model definition which defines common behavior of an Note document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.NoteData} data       The constructed data object for the embedded document.
 * @property {BaseJournalEntry} entry   The associated JournalEntry which is referenced by this Note
 */
class BaseNote extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.NoteData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Note",
      collection: "notes",
      label: "DOCUMENT.Note",
      isEmbedded: true,
      permissions: {
        create: "NOTE_CREATE"
      }
    });
  };

  /** @inheritdoc */
  testUserPermission(user, permission, {exact=false}={}) {
    if ( user.isGM ) return true;                   // Game-masters always have control
    if ( !this.data.entryId ) return true;          // Players can create un-linked notes
    if ( !this.entry ) return false;                // Otherwise permission comes through the JournalEntry
    return this.entry.testUserPermission(user, permission, exact);
  }
}

/* ---------------------------------------- */

/**
 * The base Playlist model definition which defines common behavior of an Playlist document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.PlaylistData} data     The constructed data object for the document.
 */
class BasePlaylist extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.PlaylistData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Playlist",
      collection: "playlists",
      label: "DOCUMENT.Playlist",
      embedded: {
        PlaylistSound: BasePlaylistSound
      },
      isPrimary: true
    });
  };

  /**
   * A reference to the Collection of ActiveEffect instances in the Actor document, indexed by _id.
   * @returns {Collection<BasePlaylistSound>}
   */
  get sounds() {
    return this.data.sounds;
  }
}

/* ---------------------------------------- */

/**
 * The PlaylistSound model definition which defines common behaviour of a PlaylistSound document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.PlaylistSoundData} data    The constructed data object for the document.
 */
class BasePlaylistSound extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.PlaylistSoundData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "PlaylistSound",
      collection: "sounds",
      label: "DOCUMENT.PlaylistSound",
      isEmbedded: true
    });
  };

  /* ---------------------------------------- */

  /** @inheritdoc */
  testUserPermission(user, permission, {exact=false}={}) {
    if ( this.isEmbedded ) return this.parent.testUserPermission(user, permission, {exact});
    return super.testUserPermission(user, permission, {exact});
  }
}

/* ---------------------------------------- */

/**
 * The base RollTable model definition which defines common behavior of an RollTable document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.RollTableData} data    The constructed data object for the document.
 */
class BaseRollTable extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.RollTableData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "RollTable",
      collection: "tables",
      label: "DOCUMENT.RollTable",
      embedded: {
        TableResult: BaseTableResult
      },
      isPrimary: true
    });
  };

  /**
   * A reference to the Collection of TableResult instances in this document, indexed by _id.
   * @returns {Collection<BaseTableResult>}
   */
  get results() {
    return this.data.results;
  }
}

/* ---------------------------------------- */

/**
 * The base Scene model definition which defines common behavior of an Scene document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.SceneData} data      The constructed data object for the document.
 */
class BaseScene extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.SceneData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Scene",
      collection: "scenes",
      label: "DOCUMENT.Scene",
      isPrimary: true,
      embedded: {
        AmbientLight: BaseAmbientLight,
        AmbientSound: BaseAmbientSound,
        Drawing: BaseDrawing,
        MeasuredTemplate: BaseMeasuredTemplate,
        Note: BaseNote,
        Tile: BaseTile,
        Token: BaseToken,
        Wall: BaseWall
      }
    });
  };

  /**
   * A reference to the Collection of Drawing instances in the Scene document, indexed by _id.
   * @returns {Collection<BaseDrawing>}
   */
  get drawings() {
    return this.data.drawings;
  }

  /**
   * A reference to the Collection of AmbientLight instances in the Scene document, indexed by _id.
   * @returns {Collection<BaseAmbientLight>}
   */
  get lights() {
    return this.data.lights;
  }

  /**
   * A reference to the Collection of Note instances in the Scene document, indexed by _id.
   * @returns {Collection<BaseNote>}
   */
  get notes() {
    return this.data.notes;
  }

  /**
   * A reference to the Collection of AmbientSound instances in the Scene document, indexed by _id.
   * @returns {Collection<BaseAmbientSound>}
   */
  get sounds() {
    return this.data.sounds;
  }

  /**
   * A reference to the Collection of MeasuredTemplate instances in the Scene document, indexed by _id.
   * @returns {Collection<BaseMeasuredTemplate>}
   */
  get templates() {
    return this.data.templates;
  }

  /**
   * A reference to the Collection of Token instances in the Scene document, indexed by _id.
   * @returns {Collection<BaseToken>}
   */
  get tokens() {
    return this.data.tokens;
  }

  /**
   * A reference to the Collection of Tile instances in the Scene document, indexed by _id.
   * @returns {Collection<BaseTile>}
   */
  get tiles() {
    return this.data.tiles;
  }

  /**
   * A reference to the Collection of Wall instances in the Scene document, indexed by _id.
   * @returns {Collection<BaseWall>}
   */
  get walls() {
    return this.data.walls;
  }

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Get the Canvas dimensions which would be used to display this Scene.
   * Apply padding to enlarge the playable space and round to the nearest 2x grid size to ensure symmetry.
   * @returns {object}    An object describing the configured dimensions
   */
  static getDimensions({width, height, size, gridDistance, padding, shiftX, shiftY}={}) {
    width = width || (size * 30);
    height = height || (size * 20);

    // Define native dimensions
    const d = {
      sceneWidth: width,
      sceneHeight: height,
      size: parseInt(size),
      distance: Number(gridDistance),
      shiftX: parseInt(shiftX),
      shiftY: parseInt(shiftY),
      ratio: width / height
    };

    // Define padding and final dimensions
    d.paddingX = (padding * width).toNearest(size, "ceil");
    d.width = d.sceneWidth + (2 * d.paddingX);
    d.paddingY = (padding * height).toNearest(size, "ceil");
    d.height = d.sceneHeight + (2 * d.paddingY);
    return d;
  }
}

/* ---------------------------------------- */

/**
 * The base Setting model definition which defines common behavior of an Setting document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.SettingData} data   The constructed data object for the document.
 */
class BaseSetting extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.SettingData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Setting",
      collection: "settings",
      label: "DOCUMENT.Setting",
      isPrimary: true,
      permissions: {
        create: "SETTINGS_MODIFY",
        update: "SETTINGS_MODIFY",
        delete: "SETTINGS_MODIFY"
      }
    });
  }

  /**
   * A convenience reference to the key which identifies this game setting.
   * @type {string}
   */
  get key() {
    return this.data.key;
  }

  /**
   * The parsed value of the saved setting
   * @type {any}
   */
  get value() {
    return JSON.parse(this.data.value);
  }
}

/* ---------------------------------------- */

/**
 * The base TableResult model definition which defines common behavior of an TableResult document between both client and server.
 * @extends {Document}
 * @memberof documents
 * @property {data.TableResultData} data     The constructed data object for the document.
 */
class BaseTableResult extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.TableResultData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "TableResult",
      collection: "results",
      label: "DOCUMENT.TableResult",
      types: CONST.TABLE_RESULT_TYPES,
      permissions: {
        update: this._canUpdate
      }
    });
  };

  /**
   * Is a user able to update an existing TableResult?
   * @protected
   */
  static _canUpdate(user, doc, data) {
    if ( user.isGM ) return true;                     // GM users can do anything
    const wasDrawn = ["drawn", "_id"];                // Users can update the drawn status of a result
    if ( Object.keys(data).equals(wasDrawn) ) return true;
    return doc.parent.can(user, "update", data);      // Otherwise go by parent document permission
  }

  /* ---------------------------------------- */

  /** @inheritdoc */
  testUserPermission(user, permission, {exact=false}={}) {
    if ( this.isEmbedded ) return this.parent.testUserPermission(user, permission, {exact});
    return super.testUserPermission(user, permission, {exact});
  }
}

/* ---------------------------------------- */

/**
 * The base Tile model definition which defines common behavior of an Tile document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.TileData} data            The constructed data object for the embedded document.
 */
class BaseTile extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.TileData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Tile",
      collection: "tiles",
      label: "DOCUMENT.Tile",
      isEmbedded: true,
    });
  };
}

/* ---------------------------------------- */

/**
 * The base Token model definition which defines common behavior of an Token document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.TokenData} data           The constructed data object for the document.
 */
class BaseToken extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.TokenData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Token",
      collection: "tokens",
      label: "DOCUMENT.Token",
      isEmbedded: true,
      permissions: {
        create: "TOKEN_CREATE",
        update: this._canUpdate
      }
    });
  };

  /**
   * A convenience reference to the name which should be displayed for the Token
   * @type {string}
   */
  get name() {
    return this.data.name || this.actor?.name || "Unknown";
  }

  /**
   * Is a user able to update an existing Token?
   * @protected
   */
  static _canUpdate(user, doc, data) {
    if ( user.isGM ) return true;                     // GM users can do anything
    if ( doc.actor ) {                                // You can update Tokens for Actors you control
      return doc.actor.can(user, "update")
    }
    return !!doc.data.actorId;                        // It would be good to harden this in the future
  }
}

/* ---------------------------------------- */

/**
 * The base User model definition which defines common behavior of an User document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.UserData} data       The constructed data object for the document.
 */
class BaseUser extends Document {
  constructor(...args) {
    super(...args);

    /**
     * Define an immutable property for the User's role
     * @type {number}
     */
    Object.defineProperty(this, "role", {value: this.data.role, writable: false});
  }

  /** @inheritdoc */
  static get schema() {
    return data.UserData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "User",
      collection: "users",
      label: "DOCUMENT.User",
      isPrimary: true
    });
  }

  /* ---------------------------------------- */
  /*  Permissions                             */
  /* ---------------------------------------- */

  /**
   * Test whether the User has a GAMEMASTER or ASSISTANT role in this World?
   * @type {boolean}
   */
  get isGM() {
    return this.hasRole(CONST.USER_ROLES.ASSISTANT);
  }

  /* ---------------------------------------- */

  /**
   * Test whether the User is able to perform a certain permission action.
   * The provided permission string may pertain to an explicit permission setting or a named user role.
   * Alternatively, Gamemaster users are assumed to be allowed to take all actions.
   *
   * @param {string} action         The action to test
   * @return {boolean}              Does the user have the ability to perform this action?
   */
  can(action) {
    return this.isGM || this.hasPermission(action) || this.hasRole(action);
  }

  /* ---------------------------------------- */

  /** @inheritdoc */
  getUserLevel(user) {
    return user.id === this.id ? CONST.ENTITY_PERMISSIONS.OWNER : CONST.ENTITY_PERMISSIONS.NONE;
  }

  /* ---------------------------------------- */

  /**
   * Test whether the User has at least a specific permission
   * @param {string} permission    The permission name from USER_PERMISSIONS to test
   * @return {boolean}             Does the user have at least this permission
   */
  hasPermission(permission) {

    // CASE 1: The user has the permission set explicitly
    const explicit = this.data.permissions[permission];
    if (explicit !== undefined) return explicit;

    // CASE 2: Permission defined by the user's role
    const rolePerms = game.permissions[permission];
    return rolePerms ? rolePerms.includes(this.role) : false;
  }

  /* ----------------------------------------- */

  /**
   * Test whether the User has at least the permission level of a certain role
   * @param {string|number} role    The role name from USER_ROLES to test
   * @param {boolean} [exact]       Require the role match to be exact
   * @return {boolean}              Does the user have at this role level (or greater)?
   */
  hasRole(role, {exact = false} = {}) {
    const level = typeof role === "string" ? CONST.USER_ROLES[role] : role;
    if (level === undefined) return false;
    return exact ? this.role === level : this.role >= level;
  }
}

/* ---------------------------------------- */

/**
 * The base Wall model definition which defines common behavior of an Wall document between both client and server.
 * @extends Document
 * @memberof documents
 * @property {data.WallData} data       The constructed data object for the embedded document.
 */
class BaseWall extends Document {

  /** @inheritdoc */
  static get schema() {
    return data.WallData;
  }

  /** @inheritdoc */
  static get metadata() {
    return mergeObject(super.metadata, {
      name: "Wall",
      collection: "walls",
      label: "DOCUMENT.Wall",
      isEmbedded: true,
      permissions: {
        update: this._canUpdate
      }
    });
  };

  /**
   * Is a user able to update an existing Wall?
   * @protected
   */
  static _canUpdate(user, doc, data) {
    if ( user.isGM ) return true;                     // GM users can do anything
    const dsOnly = Object.keys(data).every(k => ["_id", "ds"].includes(k));
    if ( dsOnly && (doc.data.ds !== CONST.WALL_DOOR_STATES.LOCKED) && (data.ds !== CONST.WALL_DOOR_STATES.LOCKED) ) {
      return user.hasRole("PLAYER");                  // Players may open and close unlocked doors
    }
    return false;
  }
}

// Module Exports
export {
  BaseActiveEffect,
  BaseActor,
  BaseAmbientLight,
  BaseAmbientSound,
  BaseCombat,
  BaseCombatant,
  BaseChatMessage,
  BaseDrawing,
  BaseFogExploration,
  BaseFolder,
  BaseItem,
  BaseJournalEntry,
  BaseMacro,
  BaseMeasuredTemplate,
  BaseNote,
  BasePlaylist,
  BasePlaylistSound,
  BaseRollTable,
  BaseScene,
  BaseSetting,
  BaseTableResult,
  BaseTile,
  BaseToken,
  BaseUser,
  BaseWall
}
