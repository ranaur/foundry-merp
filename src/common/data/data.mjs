/**
 * The collection of data schema and document definitions for primary documents which are shared between the both the
 * client and the server.
 * @namespace data
 */

import {DocumentData} from "../abstract/module.mjs";
import * as fields from "./fields.mjs";
import {isBase64Image, isValidId, hasImageExtension, hasVideoExtension} from "./validators.mjs";
import * as CONST from "../constants.mjs";
import * as documents from "../documents.mjs";
import {deepClone, hsvToRgb, rgbToHex, mergeObject} from "../utils/helpers.mjs";

/**
 * An embedded data structure which tracks the duration of an ActiveEffect.
 * @extends DocumentData
 * @memberof data
 * @see ActiveEffectData
 *
 * @param {object} data                 Initial data used to construct the data object
 * @param {BaseActiveEffect} [document] The document to which this data object belongs
 *
 * @property {number} startTime         The world time when the active effect first started
 * @property {number} [seconds]         The maximum duration of the effect, in seconds
 * @property {string} [combat]          The _id of the CombatEncounter in which the effect first started
 * @property {number} [rounds]          The maximum duration of the effect, in combat rounds
 * @property {number} [turns]           The maximum duration of the effect, in combat turns
 * @property {number} [startRound]      The round of the CombatEncounter in which the effect first started
 * @property {number} [startTurn]       The turn of the CombatEncounter in which the effect first started
 */
class EffectDurationData extends DocumentData {
  static defineSchema() {
    return {
      startTime: fields.field(fields.NUMERIC_FIELD, {default: null}),
      seconds: fields.NONNEGATIVE_INTEGER_FIELD,
      combat: fields.STRING_FIELD,
      rounds: fields.NONNEGATIVE_INTEGER_FIELD,
      turns: fields.NONNEGATIVE_INTEGER_FIELD,
      startRound: fields.NONNEGATIVE_INTEGER_FIELD,
      startTurn: fields.NONNEGATIVE_INTEGER_FIELD
    }
  }
}

/**
 * An embedded data structure which defines the structure of a change applied by an ActiveEffect.
 * @extends DocumentData
 * @memberof data
 * @see ActiveEffectData
 *
 * @param {object} data                 Initial data used to construct the data object
 * @param {BaseActiveEffect} [document] The document to which this data object belongs
 *
 * @property {string} key         The attribute path in the Actor or Item data which the change modifies
 * @property {*) value            The value of the change effect
 * @property {number} mode        The modification mode with which the change is applied
 * @property {number} priority    The priority level with which this change is applied
 */
class EffectChangeData extends DocumentData {
  static defineSchema() {
    return {
      key: fields.BLANK_STRING,
      value: fields.BLANK_STRING,
      mode: {
        type: Number,
        required: true,
        default: CONST.ACTIVE_EFFECT_MODES.ADD,
        validate: m => Object.values(CONST.ACTIVE_EFFECT_MODES).includes(m),
        validationError: "Invalid mode specified for change in ActiveEffectData"
      },
      priority: fields.NUMERIC_FIELD
    }
  }
}

/**
 * The data schema for an ActiveEffect document.
 * @extends DocumentData
 * @memberof data
 * @see BaseActiveEffect
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseActiveEffect} [document]   The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
 * @property {string} label               A text label which describes the name of the ActiveEffect
 * @property {data.EffectChangeData[]} changes    The array of EffectChangeData objects which the ActiveEffect applies
 * @property {boolean} [disabled=false]   Is this ActiveEffect currently disabled?
 * @property {data.EffectDurationData} [duration]  An EffectDurationData object which describes the duration of the ActiveEffect
 * @property {string} [icon]              An icon image path used to depict the ActiveEffect
 * @property {string} [origin]            A UUID reference to the document from which this ActiveEffect originated
 * @property {string} [tint=null]         A color string which applies a tint to the ActiveEffect icon
 * @property {boolean} [transfer=false]   Does this ActiveEffect automatically transfer from an Item to an Actor?
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class ActiveEffectData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      changes: {
        type: [EffectChangeData],
        required: true,
        default: []
      },
      disabled: fields.BOOLEAN_FIELD,
      duration: {
        type: EffectDurationData,
        required: true,
        default: {}
      },
      icon: fields.IMAGE_FIELD,
      label: fields.BLANK_STRING,
      origin: fields.STRING_FIELD,
      tint: fields.COLOR_FIELD,
      transfer: fields.field(fields.BOOLEAN_FIELD, {default: true}),
      flags: fields.OBJECT_FIELD
    }
  }
}

/* ---------------------------------------- */

/**
 * The data schema for an Actor document.
 * @extends DocumentData
 * @memberof data
 * @see BaseActor
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseActor} [document]   The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this Actor document
 * @property {string} name                The name of this Actor
 * @property {string} type                An Actor subtype which configures the system data model applied
 * @property {string} [img]               An image file path which provides the artwork for this Actor
 * @property {object} [data]              The system data object which is defined by the system template.json model
 * @property {data.PrototypeTokenData} [token] Default Token settings which are used for Tokens created from this Actor
 * @property {Collection<BaseItem>} items A Collection of Item embedded Documents
 * @property {Collection<BaseActiveEffect>} effects A Collection of ActiveEffect embedded Documents
 * @property {string|null} folder         The _id of a Folder which contains this Actor
 * @property {number} [sort]              The numeric sort value which orders this Actor relative to its siblings
 * @property {object} [permission]        An object which configures user permissions to this Actor
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class ActorData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      name: fields.REQUIRED_STRING,
      type: {
        type: String,
        required: true,
        validate: t => documents.BaseActor.metadata.types.includes(t),
        validationError: "The provided Actor type must be in the array of types defined by the game system"
      },
      img: fields.field(fields.IMAGE_FIELD, {default: () => this.DEFAULT_ICON}),
      data: fields.field(fields.OBJECT_FIELD, {default: data => deepClone(game.system.model.Actor[data.type])}),
      token: {
        type: PrototypeTokenData,
        required: true,
        default: data => ({name: data.name, img: data.img})
      },
      items: fields.embeddedCollectionField(documents.BaseItem),
      effects: fields.embeddedCollectionField(documents.BaseActiveEffect),
      folder: fields.foreignDocumentField({type: documents.BaseFolder}),
      sort: fields.INTEGER_SORT_FIELD,
      permission: fields.DOCUMENT_PERMISSIONS,
      flags: fields.OBJECT_FIELD
    };
  }

  /* ---------------------------------------- */

  /**
   * The default icon used for newly created Macro documents
   * @type {string}
   */
  static DEFAULT_ICON = CONST.DEFAULT_TOKEN;

  /* ---------------------------------------- */

  /** @inheritdoc */
  _initializeSource(data) {
    const source = super._initializeSource(data);
    const model = deepClone(game.system.model.Actor[data.type]);
    source.data = mergeObject(model || {}, data.data || {});
    return source;
  }

  /* ---------------------------------------- */

  /** @inheritdoc */
  _initialize() {
    super._initialize();
    this.token.update({
      name: this.token.name ?? this.name,
      img: this.token.img ?? this.img
    });
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a AmbientLight embedded document.
 * @extends DocumentData
 * @memberof data
 * @see BaseAmbientLight
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseAmbientLight} [document]           The embedded document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this BaseAmbientLight embedded document
 * @property {string} [t=l]               The source type in CONST.SOURCE_TYPES which defines the behavior of this light
 * @property {number} [x=0]               The x-coordinate position of the origin of the light
 * @property {number} [y=0]               The y-coordinate position of the origin of the light
 * @property {number} [rotation=0]        The angle of rotation for the tile between 0 and 360
 * @property {number} [dim=0]             The radius of dim light emitted in distance units, negative values produce darkness
 * @property {number} [bright=0]          The radius of bright light emitted in distance units, negative values produce blackness
 * @property {number} [angle=360]         The angle of emission of the light source in degrees
 * @property {string} [tintColor]         An optional color string which applies coloration to the resulting light source
 * @property {number} [tintAlpha=0.5]     The intensity of coloration applied to this light source, a number between 0 and 1
 * @property {data.AnimationData} [lightAnimation] A data object which configures token light animation settings, if one is applied
 * @property {number} [darknessThreshold=0] A value of the Scene darkness level, above which this light source will be active
 * @property {boolean} [hidden=false]     Is the light source currently hidden?
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class AmbientLightData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      t: {
        type: String,
        required: true,
        default: "l",
        validate: t => Object.values(CONST.SOURCE_TYPES).includes(t),
        validationError: "Invalid {name} {field} which must be a value in CONST.SOURCE_TYPES"
      },
      x: fields.REQUIRED_NUMBER,
      y: fields.REQUIRED_NUMBER,
      rotation: fields.field(fields.ANGLE_FIELD, {default: 0}),
      dim: fields.REQUIRED_NUMBER,
      bright: fields.REQUIRED_NUMBER,
      angle: fields.ANGLE_FIELD,
      tintColor: fields.COLOR_FIELD,
      tintAlpha: fields.field(fields.ALPHA_FIELD, {default: 0.25}),
      lightAnimation: {
        type: AnimationData,
        required: true,
        default: {}
      },
      darknessThreshold: fields.field(fields.ALPHA_FIELD, {default: 0}),
      darkness: {
        type: DarknessActivation,
        required: true,
        default: {}
      },
      hidden: fields.BOOLEAN_FIELD,
      flags: fields.OBJECT_FIELD
    }
  }

  /** @inheritdoc */
  _initialize() {
    super._initialize();
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.dim = this.dim.toNearest(0.01);
    this.bright = this.bright.toNearest(0.01);
    while ( this.angle <= 0 ) this.angle += 360;
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a AmbientSound embedded document.
 * @extends DocumentData
 * @memberof data
 * @see BaseAmbientSound
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseAmbientSound} [document]   The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this AmbientSound document
 * @property {string} name                The name of this sound track
 * @property {string} path                The audio file path that is played by this sound
 * @property {boolean} [playing=false]    Is this sound currently playing?
 * @property {boolean} [repeat=false]     Does this sound loop?
 * @property {number} [volume=0.5]        The audio volume of the sound, from 0 to 1
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class AmbientSoundData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      type: {
        type: String,
        required: true,
        default: documents.BaseAmbientSound.metadata.types[0],
        validate: t => documents.BaseAmbientSound.metadata.types.includes(t),
        validationError: "Invalid {name} {field} which must be a value in BaseAmbientSound.metadata.types"
      },
      x: fields.REQUIRED_NUMBER,
      y: fields.REQUIRED_NUMBER,
      radius: fields.REQUIRED_NUMBER,
      path: fields.AUDIO_FIELD,
      repeat: fields.BOOLEAN_FIELD,
      volume: fields.field(fields.ALPHA_FIELD, {default: 0.5}),
      easing: fields.field(fields.BOOLEAN_FIELD, {default: true}),
      hidden: fields.BOOLEAN_FIELD,
      darkness: {
        type: DarknessActivation,
        required: true,
        default: {}
      },
      flags: fields.OBJECT_FIELD,
    }
  }

  /** @inheritdoc */
  _initialize() {
    super._initialize();
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.radius = this.radius.toNearest(0.01);
    this.volume = this.volume.toNearest(0.01);
  }
}

/* ---------------------------------------- */

/**
 * An embedded data object which defines the properties of a light source animation
 * @extends {DocumentData}
 * @memberof data
 *
 * @param {object} data             Initial data used to construct the data object
 * @param {Document} [document]     The document to which this data object belongs
 *
 * @property {string} type          The animation type which is applied
 * @property {number} speed         The speed of the animation, a number between 1 and 10
 * @property {number} intensity     The intensity of the animation, a number between 1 and 10
 */
class AnimationData extends DocumentData {
  static defineSchema() {
    return {
      type: fields.STRING_FIELD,
      speed: {
        type: Number,
        required: false,
        default: 5,
        validate: a => a.between(1, 10),
        validationError: "Light animation speed must be an integer between 1 and 10"
      },
      intensity: {
        type: Number,
        required: false,
        default: 5,
        validate: a => a.between(1, 10),
        validationError: "Light animation intensity must be an integer between 1 and 10"
      }
    }
  }
}

/* ---------------------------------------- */

/**
 * The data schema for an embedded Chat Speaker object.
 * @extends DocumentData
 * @memberof data
 * @see ChatMessageData
 *
 * @param {object} data                 Initial data used to construct the data object
 * @param {BaseChatMessage} [document]  The document to which this data object belongs
 *
 * @property {string} [scene]       The _id of the Scene where this message was created
 * @property {string} [actor]       The _id of the Actor who generated this message
 * @property {string} [token]       The _id of the Token who generated this message
 * @property {string} [alias]       An overridden alias name used instead of the Actor or Token name
 */
class ChatSpeakerData extends DocumentData {
  static defineSchema() {
    return {
      scene: fields.foreignDocumentField({
        type: documents.BaseScene,
        required: false
      }),
      actor: fields.foreignDocumentField({
        type: documents.BaseActor,
        required: false
      }),
      token: fields.field(fields.DOCUMENT_ID, {required: false}),
      alias: fields.STRING_FIELD
    }
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a ChatMessage document.
 * @extends DocumentData
 * @memberof data
 * @see BaseChatMessage
 *
 * @param {object} data                 Initial data used to construct the data object
 * @param {BaseChatMessage} [document]  The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this ChatMessage document
 * @property {number} [type=0]            The message type from CONST.CHAT_MESSAGE_TYPES
 * @property {string} user                The _id of the User document who generated this message
 * @property {number} timestamp           The timestamp at which point this message was generated
 * @property {string} [flavor]            An optional flavor text message which summarizes this message
 * @property {string} content             The HTML content of this chat message
 * @property {data.ChatSpeakerData} speaker A ChatSpeakerData object which describes the origin of the ChatMessage
 * @property {string[]} whisper           An array of User _id values to whom this message is privately whispered
 * @property {boolean} [blind=false]      Is this message sent blindly where the creating User cannot see it?
 * @property {string} [roll]              The serialized content of a Roll instance which belongs to the ChatMessage
 * @property {string} [sound]             The URL of an audio file which plays when this message is received
 * @property {boolean} [emote=false]      Is this message styled as an emote?
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class ChatMessageData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      type: {
        type: Number,
        required: true,
        default: CONST.CHAT_MESSAGE_TYPES.OTHER,
        validate: _validateChatMessageType,
        validationError: "The provided ChatMessage type must be in CONST.CHAT_MESSAGE_TYPES"
      },
      user: fields.foreignDocumentField({
        type: documents.BaseUser,
        default: () => game?.user?.id
      }),
      timestamp: fields.field(fields.TIMESTAMP_FIELD, {required: true}),
      flavor: fields.STRING_FIELD,
      content: fields.BLANK_STRING,
      speaker: {
        type: ChatSpeakerData,
        required: true,
        default: {}
      },
      whisper: {
        type: [String],
        clean: users => users.map(u => u?.id ?? u),
        required: true,
        default: []
      },
      blind: fields.BOOLEAN_FIELD,
      roll: fields.JSON_FIELD,
      sound: fields.AUDIO_FIELD,
      emote: fields.BOOLEAN_FIELD,
      flags: fields.OBJECT_FIELD
    };
  }
}

/**
 * Validate that a ChatMessage has a valid type
 * @param {number} type     The assigned message type
 * @returns {boolean}       Is it valid?
 * @private
 */
function _validateChatMessageType(type) {
  return Object.values(CONST.CHAT_MESSAGE_TYPES).includes(type);
}

/* ---------------------------------------- */


/**
 * An embedded data object which defines the darkness range during which some attribute is active
 * @extends {DocumentData}
 * @memberof data
 * @property {number} [min=0]       The minimum darkness level for which activation occurs
 * @property {number} [max=1]       The maximum darkness level for which activation occurs
 */
class DarknessActivation extends DocumentData {
  static defineSchema() {
    return {
      min: fields.field(fields.ALPHA_FIELD, {default: 0}),
      max: fields.ALPHA_FIELD
    }
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a Drawing embedded document.
 * @extends DocumentData
 * @memberof data
 * @see BaseDrawing
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseDrawing} [document]        The embedded document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this BaseDrawing embedded document
 * @property {string} t                   The value in CONST.DRAWING_TYPES which defines the geometry type of this drawing
 * @property {number} x                   The x-coordinate position of the top-left corner of the drawn shape
 * @property {number} y                   The y-coordinate position of the top-left corner of the drawn shape
 * @property {number} width               The pixel width of the drawing figure
 * @property {number} height              The pixel height of the drawing figure
 * @property {number} [rotation=0]        The angle of rotation for the drawing figure
 * @property {number} [z=0]               The z-index of this drawing relative to other siblings
 * @property {Array<number[]>} [points]   An array of points [x,y] which define polygon vertices
 * @property {number} [bezierFactor=0]    An amount of bezier smoothing applied, between 0 and 1
 * @property {number} [fillType=0]        The fill type of the drawing shape, a value from CONST.DRAWING_FILL_TYPES
 * @property {string} [fillColor]         An optional color string with which to fill the drawing geometry
 * @property {number} [fillAlpha=0.5]     The opacity of the fill applied to the drawing geometry
 * @property {number} [strokeWidth=8]     The width in pixels of the boundary lines of the drawing geometry
 * @property {number} [strokeColor]       The color of the boundary lines of the drawing geometry
 * @property {number} [strokeAlpha=1]     The opacity of the boundary lines of the drawing geometry
 * @property {string} [texture]           The path to a tiling image texture used to fill the drawing geometry
 * @property {string} [text]              Optional text which is displayed overtop of the drawing
 * @property {string} [fontFamily=Signika] The font family used to display text within this drawing
 * @property {number} [fontSize=48]       The font size used to display text within this drawing
 * @property {string} [textColor=#FFFFFF] The color of text displayed within this drawing
 * @property {number} [textAlpha=1]       The opacity of text displayed within this drawing
 * @property {boolean} [hidden=false]     Is the drawing currently hidden?
 * @property {boolean} [locked=false]     Is the drawing currently locked?
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class DrawingData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      author: fields.foreignDocumentField({type: documents.BaseUser, required: true}),
      type: {
        type: String,
        required: true,
        default: CONST.DRAWING_TYPES.POLYGON,
        validate: t => Object.values(CONST.DRAWING_TYPES).includes(t),
        validationError: "Invalid {name} {field} which must be a value in CONST.DRAWING_TYPES"
      },
      x: fields.REQUIRED_NUMBER,
      y: fields.REQUIRED_NUMBER,
      width: fields.REQUIRED_NUMBER,
      height: fields.REQUIRED_NUMBER,
      rotation: fields.field(fields.ANGLE_FIELD, {default: 0}),
      z: fields.REQUIRED_NUMBER,
      points: {
        type: [Array],
        required: true,
        default: [],
        validate: _validateDrawingPoints,
        validationError: "Invalid {name} {field} which must be an array of points [x,y]"
      },
      bezierFactor: fields.field(fields.ALPHA_FIELD, {default: 0}),
      fillType: fields.field(fields.REQUIRED_NUMBER, {
        default: CONST.DRAWING_FILL_TYPES.NONE,
        validate: v => Object.values(CONST.DRAWING_FILL_TYPES).includes(v),
        validationError: "Invalid {name} {field} which must be a value in CONST.DRAWING_FILL_TYPES"
      }),
      fillColor: fields.COLOR_FIELD,
      fillAlpha: fields.field(fields.ALPHA_FIELD, {default: 0.5}),
      strokeWidth: fields.field(fields.NONNEGATIVE_INTEGER_FIELD, {default: 8}),
      strokeColor: fields.COLOR_FIELD,
      strokeAlpha: fields.ALPHA_FIELD,
      texture: fields.IMAGE_FIELD,
      text: fields.STRING_FIELD,
      fontFamily: fields.field(fields.REQUIRED_STRING, {default: "Signika"}),
      fontSize: fields.field(fields.POSITIVE_INTEGER_FIELD, {
        default: 48,
        validate: n => Number.isInteger(n) && n.between(8, 256),
        validationError: "Invalid {name} {field} which must be an integer between 8 and 256"
      }),
      textColor: fields.field(fields.COLOR_FIELD, {default: "#FFFFFF"}),
      textAlpha: fields.ALPHA_FIELD,
      hidden: fields.BOOLEAN_FIELD,
      locked: fields.BOOLEAN_FIELD,
      flags: fields.OBJECT_FIELD
    }
  }

  /** @inheritdoc */
  _initialize() {
    super._initialize();
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }

  /** @inheritdoc */
  _validateDocument() {
    const hasLine = (this.strokeWidth > 0) && (this.strokeAlpha > 0);
    const hasFill = this.fillType !== CONST.DRAWING_FILL_TYPES.NONE;
    const hasText = this.text !== "";
    if ( !(hasLine || hasFill || hasText) ) {
      throw new Error("A Drawing must have either visible lines, visible fill, or visible text");
    }
  }
}

/**
 * Validate the array of points which comprises a polygon drawing
 * @param {Array<number[]>} points    The candidate points
 * @returns {boolean}                 Is the array valid?
 * @private
 */
function _validateDrawingPoints(points) {
  return points.every(p => {
    return (p instanceof Array) && (p.length === 2) && p.every(x => Number.isFinite(x));
  })
}

/* ---------------------------------------- */

/**
 * The data schema for a Combatant embedded document within a CombatEncounter document.
 * @extends DocumentData
 * @memberof data
 * @see BaseCombatant
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseCombatant} [document]      The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this Combatant embedded document
 * @property {string} [tokenId]           The _id of a Token associated with this Combatant
 * @property {string} [name]              A customized name which replaces the name of the Token in the tracker
 * @property {string} [img]               A customized image which replaces the Token image in the tracker
 * @property {number} [initiative]        The initiative score for the Combatant which determines its turn order
 * @property {boolean} [hidden=false]     Is this Combatant currently hidden?
 * @property {boolean} [defeated=false]   Has this Combatant been defeated?
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class CombatantData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      actorId: fields.foreignDocumentField({type: documents.BaseActor}),
      tokenId: fields.foreignDocumentField({type: documents.BaseToken}),
      name: fields.STRING_FIELD,
      img: fields.IMAGE_FIELD,
      initiative: fields.NUMERIC_FIELD,
      hidden: fields.BOOLEAN_FIELD,
      defeated: fields.BOOLEAN_FIELD,
      flags: fields.OBJECT_FIELD
    }
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a Combat document.
 * @extends DocumentData
 * @memberof data
 * @see BaseCombat
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseCombat} [document]         The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this Combat document
 * @property {string} scene               The _id of a Scene within which this Combat occurs
 * @property {Collection<BaseCombatant>} combatants A Collection of Combatant embedded Documents
 * @property {boolean} [active=false]     Is the Combat encounter currently active?
 * @property {number} [round=0]           The current round of the Combat encounter
 * @property {number} [turn=0]            The current turn in the Combat round
 * @property {number] [sort=0]            The current sort order of this Combat relative to others in the same Scene
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class CombatData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      scene: fields.foreignDocumentField({type: documents.BaseScene}),
      combatants: fields.embeddedCollectionField(documents.BaseCombatant),
      active: fields.BOOLEAN_FIELD,
      round: fields.field(fields.NONNEGATIVE_INTEGER_FIELD, {default: 0, required: true}),
      turn: fields.field(fields.NONNEGATIVE_INTEGER_FIELD, {default: 0, required: true}),
      sort: fields.INTEGER_SORT_FIELD,
      flags: fields.OBJECT_FIELD
    }
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a FogExploration document.
 * @extends DocumentData
 * @memberof data
 * @see BaseFogExploration
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseFogExploration} [document] The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this FogExploration document
 * @property {string} scene               The _id of the Scene document to which this fog applies
 * @property {string} user                The _id of the User document to which this fog applies
 * @property {string} explored            The base64 png image of the explored fog polygon
 * @property {object} positions           The object of scene positions which have been explored at a certain vision radius
 * @property {number} timestamp           The timestamp at which this fog exploration was last updated
 */
class FogExplorationData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      scene: fields.foreignDocumentField({type: documents.BaseScene}),
      user: fields.foreignDocumentField({type: documents.BaseUser}),
      explored: {
        type: String,
        required: true,
        nullable: true,
        default: null,
        validate: isBase64Image,
        validationError: "The provided FogExploration explored image is not a valid base64 image string"
      },
      positions: fields.OBJECT_FIELD,
      timestamp: fields.field(fields.TIMESTAMP_FIELD, {required: true})
    }
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a Folder document.
 * @extends DocumentData
 * @memberof data
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseFolder} [document]         The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this Folder document
 * @property {string} name                The name of this Folder
 * @property {string} type                The document type which this Folder contains, from CONST.FOLDER_ENTITY_TYPES
 * @property {string} [description]       An HTML description of the contents of this folder
 * @property {string|null} [parent]       The _id of a parent Folder which contains this Folder
 * @property {string} [sorting=a]         The sorting mode used to organize documents within this Folder, in ["a", "m"]
 * @property {number} [sort]              The numeric sort value which orders this Folder relative to its siblings
 * @property {string|null} [color]        A color string used for the background color of this Folder
 * @property {object} [flags={}]          An object of optional key/value flags
 *
 */
class FolderData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      name: fields.REQUIRED_STRING,
      type: {
        type: String,
        required: true,
        validate: t => CONST.FOLDER_ENTITY_TYPES.includes(t),
        validationError: "Invalid Folder type provided"
      },
      description: fields.STRING_FIELD,
      parent: fields.foreignDocumentField({type: documents.BaseFolder}),
      sorting: {
        type: String,
        required: true,
        default: "a",
        validate: mode => this.SORTING_MODES.includes(mode),
        validationError: "Invalid Folder sorting mode"
      },
      sort: fields.INTEGER_SORT_FIELD,
      color: fields.COLOR_FIELD,
      flags: fields.OBJECT_FIELD
    }
  }
  static SORTING_MODES = ["a", "m"];
}

/* ---------------------------------------- */

/**
 * The data schema for a Item document.
 * @extends DocumentData
 * @memberof data
 * @see BaseItem
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseItem} [document]           The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this Item document
 * @property {string} name                The name of this Item
 * @property {string} type                An Item subtype which configures the system data model applied
 * @property {string} [img]               An image file path which provides the artwork for this Item
 * @property {object} [data]              The system data object which is defined by the system template.json model
 * @property {Collection<BaseActiveEffect>} effects A collection of ActiveEffect embedded Documents
 * @property {string|null} folder         The _id of a Folder which contains this Item
 * @property {number} [sort]              The numeric sort value which orders this Item relative to its siblings
 * @property {object} [permission]        An object which configures user permissions to this Item
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class ItemData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      name: fields.REQUIRED_STRING,
      type: {
        type: String,
        required: true,
        validate: t => documents.BaseItem.metadata.types.includes(t),
        validationError: "The provided Item type must be in the array of types defined by the game system"
      },
      img: fields.field(fields.IMAGE_FIELD, {default: () => this.DEFAULT_ICON}),
      data: fields.field(fields.OBJECT_FIELD, {default: data => deepClone(game.system.model.Item[data.type])}),
      effects: fields.embeddedCollectionField(documents.BaseActiveEffect),
      folder: fields.foreignDocumentField({type: documents.BaseFolder}),
      sort: fields.INTEGER_SORT_FIELD,
      permission: fields.DOCUMENT_PERMISSIONS,
      flags: fields.OBJECT_FIELD
    }
  }

  /* ---------------------------------------- */

  /**
   * The default icon used for newly created Item documents
   * @type {string}
   */
  static DEFAULT_ICON = "icons/svg/item-bag.svg";

  /* ---------------------------------------- */

  /** @inheritdoc */
  _initializeSource(data) {
    const source = super._initializeSource(data);
    const model = deepClone(game.system.model.Item[data.type]);
    source.data = mergeObject(model || {}, data.data || {});
    return source;
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a JournalEntry document.
 * @extends DocumentData
 * @memberof data
 * @see BaseJournalEntry
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseJournalEntry} [document]   The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this JournalEntry document
 * @property {string} name                The name of this JournalEntry
 * @property {string} content             The HTML content of the JournalEntry
 * @property {string|null} [img]          An image file path which provides the artwork for this JournalEntry
 * @property {string|null} folder         The _id of a Folder which contains this JournalEntry
 * @property {number} [sort]              The numeric sort value which orders this JournalEntry relative to its siblings
 * @property {object} [permission]        An object which configures user permissions to this JournalEntry
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class JournalEntryData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      name: fields.REQUIRED_STRING,
      content: fields.BLANK_STRING,
      img: fields.IMAGE_FIELD,
      folder: fields.foreignDocumentField({type: documents.BaseFolder}),
      sort: fields.INTEGER_SORT_FIELD,
      permission: fields.DOCUMENT_PERMISSIONS,
      flags: fields.OBJECT_FIELD
    }
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a Macro document.
 * @extends DocumentData
 * @memberof data
 * @see BaseMacro
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseMacro} [document]          The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this Macro document
 * @property {string} name                The name of this Macro
 * @property {string} type                A Macro subtype from CONST.MACRO_TYPES
 * @property {string} author              The _id of a User document which created this Macro *
 * @property {string} [img]               An image file path which provides the thumbnail artwork for this Macro
 * @property {string} [scope=global]      The scope of this Macro application from CONST.MACRO_SCOPES
 * @property {string} command             The string content of the macro command
 * @property {string|null} folder         The _id of a Folder which contains this Macro
 * @property {number} [sort]              The numeric sort value which orders this Macro relative to its siblings
 * @property {object} [permission]        An object which configures user permissions to this Macro
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class MacroData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      name: fields.REQUIRED_STRING,
      type: {
        type: String,
        required: true,
        default: CONST.MACRO_TYPES.CHAT,
        validate: t => Object.values(CONST.MACRO_TYPES).includes(t),
        validationError: "The provided Macro type must be in CONST.MACRO_TYPES"
      },
      author: fields.foreignDocumentField({
        type: documents.BaseUser,
        default: () => game?.user
      }),
      img: fields.field(fields.IMAGE_FIELD, {required: true, default: CONST.DEFAULT_MACRO_ICON}),
      scope: {
        type: String,
        required: true,
        default: CONST.MACRO_SCOPES[0], // global
        validate: t => CONST.MACRO_SCOPES.includes(t),
        validationError: "The provided Macro scope must be in CONST.MACRO_SCOPES"
      },
      command: fields.BLANK_STRING,
      folder: fields.foreignDocumentField({type: documents.BaseFolder}),
      sort: fields.INTEGER_SORT_FIELD,
      permission: fields.DOCUMENT_PERMISSIONS,
      flags: fields.OBJECT_FIELD
    }
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a MeasuredTemplate embedded document.
 * @extends DocumentData
 * @memberof data
 * @see BaseMeasuredTemplate
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseMeasuredTemplate} [document] The embedded document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this BaseMeasuredTemplate embedded document
 * @property {string} [t=circle]          The value in CONST.MEASURED_TEMPLATE_TYPES which defines the geometry type of this template
 * @property {number} [x=0]               The x-coordinate position of the origin of the template effect
 * @property {number} [y=0]               The y-coordinate position of the origin of the template effect
 * @property {number} [distance]          The distance of the template effect
 * @property {number} [direction=0]       The angle of rotation for the measured template
 * @property {number} [angle=360]         The angle of effect of the measured template, applies to cone types
 * @property {number} [width]             The width of the measured template, applies to ray types
 * @property {string} [borderColor=#000000] A color string used to tint the border of the template shape
 * @property {string} [fillColor=#FF0000] A color string used to tint the fill of the template shape
 * @property {string} [texture]           A repeatable tiling texture used to add a texture fill to the template shape
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class MeasuredTemplateData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      user: fields.foreignDocumentField({type: documents.BaseUser, required: true}),
      t: {
        type: String,
        required: true,
        default: CONST.MEASURED_TEMPLATE_TYPES.CIRCLE,
        validate: t => Object.values(CONST.MEASURED_TEMPLATE_TYPES).includes(t),
        validationError: "Invalid {name} {field} which must be a value in CONST.MEASURED_TEMPLATE_TYPES"
      },
      x: fields.REQUIRED_NUMBER,
      y: fields.REQUIRED_NUMBER,
      distance: fields.field(fields.REQUIRED_POSITIVE_NUMBER, {default: 1}),
      direction: fields.field(fields.ANGLE_FIELD, {required: true, default: 0}),
      angle: fields.ANGLE_FIELD,
      width: fields.field(fields.REQUIRED_POSITIVE_NUMBER, {default: 1}),
      borderColor: fields.field(fields.COLOR_FIELD, {required: true, default: "#000000"}),
      fillColor: fields.field(fields.COLOR_FIELD, {required: true, default: "#FF0000"}),
      texture: fields.VIDEO_FIELD,
      flags: fields.OBJECT_FIELD
    }
  }

  /** @inheritdoc */
  _initialize() {
    super._initialize();
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }

  /** @inheritdoc */
  _validateDocument() {
    const scene = this.document.parent;
    if ( !scene?.data ) return;
    const max = Math.hypot(scene.data.width, scene.data.height);
    for ( let f of ["distance", "width"] ) {
      const px = this[f] * (scene.data.grid / scene.data.gridDistance);
      if ( px > max ) throw new Error(`Invalid MeasuredTemplate ${f} which exceeds maximum dimensions for the Scene`);
    }
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a Note embedded document.
 * @extends DocumentData
 * @memberof data
 * @see BaseNote
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseNote} [document]           The embedded document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this BaseNote embedded document
 * @property {string|null} [entryId=null] The _id of a JournalEntry document which this Note represents
 * @property {number} [x=0]               The x-coordinate position of the center of the note icon
 * @property {number} [y=0]               The y-coordinate position of the center of the note icon
 * @property {string} [icon]              An image icon path used to represent this note
 * @property {number} [iconSize=40]       The pixel size of the map note icon
 * @property {string} [iconTint]          An optional color string used to tint the map note icon
 * @property {string} [text]              Optional text which overrides the title of the linked Journal Entry
 * @property {string} [fontFamily=Signika] The font family used to display the text label on this note
 * @property {number} [fontSize=36]       The font size used to display the text label on this note
 * @property {number} [textAnchor=1]      A value in CONST.TEXT_ANCHOR_POINTS which defines where the text label anchors
 *                                        to the note icon.
 * @property {string} [textColor=#FFFFFF] The string that defines the color with which the note text is rendered
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class NoteData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      entryId: fields.foreignDocumentField({type: documents.BaseJournalEntry, required: false}),
      x: fields.REQUIRED_NUMBER,
      y: fields.REQUIRED_NUMBER,
      icon: fields.field(fields.IMAGE_FIELD, {required: true, default: CONST.DEFAULT_NOTE_ICON}),
      iconSize: fields.field(fields.REQUIRED_NUMBER, {
        default: 40,
        validate: n => Number.isInteger(n) && n >= 32,
        validationError: "Invalid {name} {field} which must be an integer greater than 32"
      }),
      iconTint: fields.COLOR_FIELD,
      text: fields.STRING_FIELD,
      fontFamily: fields.field(fields.REQUIRED_STRING, {
        default: () => globalThis.CONFIG?.defaultFontFamily || "Signika"
      }),
      fontSize: fields.field(fields.REQUIRED_NUMBER, {
        default: 48,
        validate: n => Number.isInteger(n) && n.between(8, 128),
        validationError: "Invalid {name} {field} which must be an integer between 8 and 128"
      }),
      textAnchor: {
        type: Number,
        required: true,
        default: CONST.TEXT_ANCHOR_POINTS.BOTTOM,
        validate: p => Object.values(CONST.TEXT_ANCHOR_POINTS).includes(p),
        validationError: "Invalid {name} {field} which must be a value in CONST.TEXT_ANCHOR_POINTS"
      },
      textColor: fields.field(fields.COLOR_FIELD, {default: "#FFFFFF"}),
      flags: fields.OBJECT_FIELD
    }
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a Playlist document.
 * @extends DocumentData
 * @memberof data
 * @see BasePlaylist
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BasePlaylist} [document]       The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this Playlist document
 * @property {string} name                The name of this playlist
 * @property {Collection<BasePlaylistSound>} sounds A Collection of PlaylistSounds embedded documents which belong to this playlist
 * @property {number} [mode=0]            The playback mode for sounds in this playlist
 * @property {boolean} [playing=false]    Is this playlist currently playing?
 * @property {string|null} folder         The _id of a Folder which contains this playlist
 * @property {number} [sort]              The numeric sort value which orders this playlist relative to its siblings
 * @property {object} [permission]        An object which configures user permissions to this playlist
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class PlaylistData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      name: fields.REQUIRED_STRING,
      description: fields.BLANK_STRING,
      sounds: fields.embeddedCollectionField(documents.BasePlaylistSound),
      mode: {
        type: Number,
        required: true,
        default: CONST.PLAYLIST_MODES.SEQUENTIAL,
        validate: m => Object.values(CONST.PLAYLIST_MODES).includes(m),
        validationError: "Invalid {name} {field} provided which must be a value from CONST.PLAYLIST_MODES"
      },
      playing: fields.BOOLEAN_FIELD,
      fade: fields.INTEGER_FIELD,
      folder: fields.foreignDocumentField({type: documents.BaseFolder}),
      sort: fields.INTEGER_SORT_FIELD,
      seed: fields.NONNEGATIVE_INTEGER_FIELD,
      permission: fields.DOCUMENT_PERMISSIONS,
      flags: fields.OBJECT_FIELD
    }
  }
}

/* ---------------------------------------- */

/**
 * Extend the base TokenData to define a PrototypeToken which exists within a parent Actor.
 * @extends {DocumentData}
 * @see ActorData
 * @memberof data
 *
 * @property {string} _id                 The Token _id which uniquely identifies it within its parent Scene
 * @property {string} name                The name used to describe the Token
 * @property {number} [displayName=0]     The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
 * @property {string|null} actorId        The _id of an Actor document which this Token represents
 * @property {boolean} [actorLink=false]  Does this Token uniquely represent a singular Actor, or is it one of many?
 * @property {string} img                 A file path to an image or video file used to depict the Token
 * @property {boolean} [randomImg=false]  Uses a random "wildcard" image path which is resolved with a Token is created
 * @property {string} [tint=null]         An optional color tint applied to the Token image
 * @property {number} [width=1]           The width of the Token in grid units
 * @property {number} [height=1]          The height of the Token in grid units
 * @property {number} [scale=1]           A scale factor applied to the Token image, between 0.25 and 3
 * @property {boolean} [mirrorX=false]    Flip the Token image horizontally?
 * @property {boolean} [mirrorY=false]    Flip the Token image vertically?
 * @property {boolean} [lockRotation=false]  Prevent the Token image from visually rotating?
 * @property {number} [rotation=0]        The rotation of the Token in degrees, from 0 to 360. A value of 0 represents a southward-facing Token.
 * @property {boolean} [vision]           Is this Token a source of vision?
 * @property {number} [dimSight=0]        How far in distance units the Token can naturally see as if in dim light
 * @property {number} [brightSight=0]     How far in distance units the Token can naturally see as if in bright light
 * @property {number} [sightAngle=360]    The angle at which this Token is able to see, if it has vision
 * @property {number} [dimLight=0]        How far in distance units this Token emits dim light
 * @property {number} [brightLight=0]     How far in distance units this Token emits bright light
 * @property {number} [lightAngle=360]    The angle at which this Token is able to emit light
 * @property {data.AnimationData} [lightAnimation] A data object which configures token light animation settings
 * @property {number} [disposition=-1]    A displayed Token disposition from CONST.TOKEN_DISPOSITIONS
 * @property {number} [displayBars=0]     The display mode of Token resource bars, from CONST.TOKEN_DISPLAY_MODES
 * @property {TokenBarData} [bar1]        The configuration of the Token's primary resource bar
 * @property {TokenBarData} [bar2]        The configuration of the Token's secondary resource bar
 */
class PrototypeTokenData extends DocumentData {
  static defineSchema() {
    const tokenSchema = TokenData.defineSchema();
    const schema = {};
    const excluded = ["_id", "actorId", "actorData", "img", "x", "y", "elevation", "effects", "overlayEffect", "hidden"];
    for ( let k of Object.keys(tokenSchema) ) {
      if ( excluded.includes(k) ) continue;
      schema[k] = tokenSchema[k];
    }
    schema["randomImg"] = fields.BOOLEAN_FIELD;
    schema["img"] = fields.field(fields.VIDEO_FIELD, {
      default: CONST.DEFAULT_TOKEN,
      validate: src => hasImageExtension(src) || hasVideoExtension(src) || /\*/.test(src)
    });
    return schema;
  }

  /** @inheritdoc */
  _initialize() {
    super._initialize();
    TokenData.prototype._initialize.call(this);
  }

  /** @inheritdoc */
  toObject(source=true) {
    const data = super.toObject(source);
    data["actorId"] = this.document.id;
    return data;
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a PlaylistSound embedded document.
 * @extends DocumentData
 * @memberof data
 * @see BasePlaylistSound
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BasePlaylistSound} [document]   The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this PlaylistSound document
 * @property {string} name                The name of this sound track
 * @property {string} path                The audio file path that is played by this sound
 * @property {boolean} [playing=false]    Is this sound currently playing?
 * @property {boolean} [repeat=false]     Does this sound loop?
 * @property {number} [volume=0.5]        The audio volume of the sound, from 0 to 1
 * @property {boolean} [streaming=false]  Does this audio file use the "large file streaming" mode?
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class PlaylistSoundData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      name: fields.REQUIRED_STRING,
      description: fields.BLANK_STRING,
      path: fields.AUDIO_FIELD,
      playing: fields.BOOLEAN_FIELD,
      pausedTime: fields.field(fields.NUMERIC_FIELD, {default: null}),
      repeat: fields.BOOLEAN_FIELD,
      volume: fields.field(fields.ALPHA_FIELD, {default: 0.5}),
      fade: fields.INTEGER_FIELD,
      flags: fields.OBJECT_FIELD,
    }
  }

  /** @inheritdoc */
  _initialize() {
    super._initialize();
    this.volume = this.volume.toNearest(0.01);
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a RollTable document.
 * @extends DocumentData
 * @memberof data
 * @see BaseRollTable
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseRollTable} [document]      The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this RollTable document
 * @property {string} name                The name of this RollTable
 * @property {string} [img]               An image file path which provides the thumbnail artwork for this RollTable
 * @property {string} [description]       The HTML text description for this RollTable document
 * @property {Collection<BaseTableResult>} [results=[]] A Collection of TableResult embedded documents which belong to this RollTable
 * @property {string} formula             The Roll formula which determines the results chosen from the table
 * @property {boolean} [replacement=true] Are results from this table drawn with replacement?
 * @property {boolean} [displayRoll=true] Is the Roll result used to draw from this RollTable displayed in chat?
 * @property {string|null} folder         The _id of a Folder which contains this RollTable
 * @property {number} [sort]              The numeric sort value which orders this RollTable relative to its siblings
 * @property {object} [permission]        An object which configures user permissions to this RollTable
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class RollTableData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      name: fields.REQUIRED_STRING,
      img: fields.field(fields.IMAGE_FIELD, {required: true, default: () => this.DEFAULT_ICON}),
      description: fields.STRING_FIELD,
      results: fields.embeddedCollectionField(documents.BaseTableResult),
      formula: fields.STRING_FIELD,
      replacement: fields.field(fields.BOOLEAN_FIELD, {default: true}),
      displayRoll: fields.field(fields.BOOLEAN_FIELD, {default: true}),
      folder: fields.foreignDocumentField({type: documents.BaseFolder}),
      sort: fields.INTEGER_SORT_FIELD,
      permission: fields.DOCUMENT_PERMISSIONS,
      flags: fields.OBJECT_FIELD
    }
  }

  /**
   * The default icon used for newly created Macro documents
   * @type {string}
   */
  static DEFAULT_ICON = "icons/svg/d20-grey.svg";
}

/* ---------------------------------------- */

/**
 * The data schema for a Scene document.
 * @extends DocumentData
 * @memberof data
 * @see BaseScene
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseScene} [document]          The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this Scene document
 * @property {string} name                The name of this scene
 *
 * @property {boolean} [active=false]     Is this scene currently active? Only one scene may be active at a given time.
 * @property {boolean} [navigation=false] Is this scene displayed in the top navigation bar?
 * @property {number} [navOrder]          The integer sorting order of this Scene in the navigation bar relative to others
 * @property {string} [navName]           A string which overrides the canonical Scene name which is displayed in the navigation bar
 *
 * @property {string} [img]               An image or video file path which provides the background media for the scene
 * @property {string} [thumb]             A thumbnail image (base64) or file path which visually summarizes the scene
 * @property {number} [width=4000]        The width of the scene canvas, this should normally be the width of the background media
 * @property {number} [height=3000]       The height of the scene canvas, this should normally be the height of the background media
 * @property {number} [padding=0.25]      The proportion of canvas padding applied around the outside of the scene
 *                                        dimensions to provide additional buffer space
 * @property {{x: number, y: number, scale: number}|null} [initial=null] The initial view coordinates for the scene, or null
 * @property {string} [backgroundColor=#999999] The color of the canvas which is displayed behind the scene background
 *
 * @property {number} [gridType=1]        The type of grid used in this scene, a number from CONST.GRID_TYPES
 * @property {number} [grid=100]          The grid size which represents the width (or height) of a single grid space
 * @property {number} [shiftX=0]          A number of offset pixels that the background image is shifted horizontally relative to the grid
 * @property {number} [shiftY=0]          A number of offset pixels that the background image is shifted vertically relative to the grid
 * @property {string} [gridColor=#000000] A string representing the color used to render the grid lines
 * @property {number} [gridAlpha=0.2]     A number between 0 and 1 for the opacity of the grid lines
 * @property {number} [gridDistance]      The number of distance units which are represented by a single grid space.
 * @property {string} [gridUnits]         A label for the units of measure which are used for grid distance.
 *
 * @property {boolean} [tokenVision=true] Do Tokens require vision in order to see the Scene environment?
 * @property {boolean} [fogExploration=true] Should fog exploration progress be tracked for this Scene?
 * @property {number} [fogReset]          The timestamp at which fog of war was last reset for this Scene.
 * @property {boolean} [globalLight=false] Does this Scene benefit from global illumination which provides bright light everywhere?
 * @property {number} [darkness=0]        The ambient darkness level in this Scene, where 0 represents mid-day
 *                                        (maximum illumination) and 1 represents mid-night (maximum darkness)
 * @property {number} [globalLightThreshold] A darkness level between 0 and 1, beyond which point global illumination is
 *                                        temporarily disabled if globalLight is true.
 *
 * @property {Collection<BaseDrawing>} [drawings=[]]   A collection of embedded Drawing objects.
 * @property {Collection<BaseTile>} [tiles=[]]         A collection of embedded Tile objects.
 * @property {Collection<BaseToken>} [tokens=[]]       A collection of embedded Token objects.
 * @property {Collection<BaseAmbientLight>} [lights=[]] A collection of embedded AmbientLight objects.
 * @property {Collection<BaseNote>} [notes=[]]         A collection of embedded Note objects.
 * @property {Collection<BaseAmbientSound>} [sounds=[]] A collection of embedded AmbientSound objects.
 * @property {Collection<BaseMeasuredTemplate>} [templates=[]] A collection of embedded MeasuredTemplate objects.
 * @property {Collection<BaseWall>} [walls=[]]         A collection of embedded Wall objects
 *
 * @property {BasePlaylist} [playlist]    A linked Playlist document which should begin automatically playing when this
 *                                        Scene becomes active.
 * @property {JournalEntry} [journal]     A linked JournalEntry document which provides narrative details about this Scene.
 * @property {string} [weather]           A named weather effect which should be rendered in this Scene.

 * @property {string|null} folder         The _id of a Folder which contains this Actor
 * @property {number} [sort]              The numeric sort value which orders this Actor relative to its siblings
 * @property {object} [permission]        An object which configures user permissions to this Actor
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class SceneData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      name: fields.REQUIRED_STRING,

      // Navigation
      active: fields.BOOLEAN_FIELD,
      navigation: fields.field(fields.BOOLEAN_FIELD, {default: true}),
      navOrder: fields.INTEGER_SORT_FIELD,
      navName: fields.BLANK_STRING,

      // Canvas Dimensions
      img: fields.VIDEO_FIELD,
      foreground: fields.VIDEO_FIELD,
      thumb: fields.IMAGE_FIELD,
      width: fields.field(fields.POSITIVE_INTEGER_FIELD, {required: true, default: 4000}),
      height: fields.field(fields.POSITIVE_INTEGER_FIELD, {required: true, default: 3000}),
      padding: {
       type: Number,
       required: true,
       default: 0.25,
       validate: p => Number.isNumeric(p) && p.between(0, 0.5),
       validation: "Invalid {name} {field} which must be a number between 0 and 0.5"
      },
      initial: {
        type: Object,
        required: false,
        nullable: true,
        default: null,
        validate: _validateInitialViewPosition,
        validationError: "Invalid initial view position object provided for Scene"
      },
      backgroundColor: fields.field(fields.COLOR_FIELD, {required: true, default: "#999999"}),

      // Grid Configuration
      gridType: fields.field(fields.REQUIRED_NUMBER, {
        default: CONST.GRID_TYPES.SQUARE,
        validate: t => Object.values(CONST.GRID_TYPES).includes(t),
        validationError: "Invalid {name } {field} which must be a value in CONST.GRID_TYPES"
      }),
      grid: {
        type: Number,
        required: true,
        default: 100,
        validate: n => Number.isInteger(n) && n >= CONST.GRID_MIN_SIZE,
        validationError: `Invalid {name} {field} which must be an integer number of pixels, ${CONST.GRID_MIN_SIZE} or greater`
      },
      shiftX: fields.field(fields.INTEGER_FIELD, {required: true, default: 0}),
      shiftY: fields.field(fields.INTEGER_FIELD, {required: true, default: 0}),
      gridColor: fields.field(fields.COLOR_FIELD, {required: true, default: "#000000"}),
      gridAlpha: fields.field(fields.ALPHA_FIELD, {required: true, default: 0.2}),
      gridDistance: fields.field(fields.REQUIRED_POSITIVE_NUMBER, {default: () => game.system.data.gridDistance || 1}),
      gridUnits: fields.field(fields.BLANK_STRING, {default: () => game.system.data.gridUnits ?? ""}),

      // Vision and Lighting Configuration
      tokenVision: fields.field(fields.BOOLEAN_FIELD, {default: true}),
      fogExploration: fields.field(fields.BOOLEAN_FIELD, {default: true}),
      fogReset: fields.TIMESTAMP_FIELD,
      globalLight: fields.BOOLEAN_FIELD,
      globalLightThreshold: {
        type: Number,
        required: true,
        nullable: true,
        default: null,
        validate: n => Number.between(n, 0, 1),
        validationError: "Invalid {name} {field} which must be null, or a number between 0 and 1"
      },
      darkness: fields.field(fields.ALPHA_FIELD, {default: 0}),

      // Embedded Collections
      drawings: fields.embeddedCollectionField(documents.BaseDrawing),
      tokens: fields.embeddedCollectionField(documents.BaseToken),
      lights: fields.embeddedCollectionField(documents.BaseAmbientLight),
      notes: fields.embeddedCollectionField(documents.BaseNote),
      sounds: fields.embeddedCollectionField(documents.BaseAmbientSound),
      templates: fields.embeddedCollectionField(documents.BaseMeasuredTemplate),
      tiles: fields.embeddedCollectionField(documents.BaseTile),
      walls: fields.embeddedCollectionField(documents.BaseWall),

      // Linked Documents
      playlist: fields.foreignDocumentField({
        type: documents.BasePlaylist,
        required: false
      }),
      playlistSound: fields.foreignDocumentField({
        type: documents.BasePlaylistSound,
        required: false
      }),
      journal: fields.foreignDocumentField({
        type: documents.BaseJournalEntry,
        required: false
      }),
      weather: fields.BLANK_STRING,

      // Permissions
      folder: fields.foreignDocumentField({type: documents.BaseFolder}),
      sort: fields.INTEGER_SORT_FIELD,
      permission: fields.DOCUMENT_PERMISSIONS,
      flags: fields.OBJECT_FIELD
    }
  }

  /** @inheritdoc */
  _initialize() {
    super._initialize();
    this.shiftX = Math.round(this.shiftX);
    this.shiftY = Math.round(this.shiftY);
    this.size = Math.round(this.size);
  }
}

/**
 * Verify that the initial view position for a Scene is valid
 * @param {object|null} pos       The scene position object, or null
 * @returns {boolean}             Is the position valid?
 * @private
 */
function _validateInitialViewPosition(pos) {
  if ( pos === null ) return true;
  const validKeys = new Set(["x", "y", "scale"]);
  return (typeof pos === "object") &&
    Object.keys(pos).every(p => validKeys.has(p)) &&
    Object.values(pos).every(n => typeof n === "number");
}

/* ---------------------------------------- */

/**
 * The data schema for a Setting document.
 * @extends DocumentData
 * @memberof data
 * @see BaseSetting
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseSetting} [document]        The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this Setting document
 * @property {string} key                 The setting key, a composite of {scope}.{name}
 * @property {*} value                    The setting value, which may be any type of data
 */
class SettingData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      key: {
        type: String,
        required: true,
        validate: _validateKeyFormat,
        validationError: "Invalid setting key format which should be {scope}.{field}"
      },
      value: fields.field(fields.JSON_FIELD, {required: true})
    }
  }
}

/**
 * Validate that each setting key matches the expected format
 * @param {string} key      The key to test
 * @returns {boolean}       Is the key valid?
 * @private
 */
function _validateKeyFormat(key) {
  const parts = key.split(".");
  return parts.length >= 2;
}

/* ---------------------------------------- */

/**
 * The data schema for a TableResult embedded document within a Roll Table.
 * @extends DocumentData
 * @memberof data
 * @see BaseTableResult
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseTableResult} [document]    The document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this TableResult embedded document
 * @property {string} [type=p]            A result sub-type from CONST.TABLE_RESULT_TYPES
 * @property {string} [text]              The text which describes the table result
 * @property {string} [img]               An image file url that represents the table result
 * @property {string} [collection]        A named collection from which this result is drawn
 * @property {string} [resultId]          The _id of a Document within the collection this result references
 * @property {number} [weight=1]          The probabilistic weight of this result relative to other results
 * @property {number[]} [range]           A length 2 array of ascending integers which defines the range of dice roll
 *                                        totals which produce this drawn result
 * @property {boolean} [drawn=false]      Has this result already been drawn (without replacement)
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class TableResultData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      type: {
        type: Number,
        default: CONST.TABLE_RESULT_TYPES.TEXT,
        validate: t => Object.values(CONST.TABLE_RESULT_TYPES).includes(t),
        validationError: "Invalid TableResult type provided"
      },
      text: fields.BLANK_STRING,
      img: fields.IMAGE_FIELD,
      collection: fields.STRING_FIELD,
      resultId: fields.STRING_FIELD,
      weight: fields.POSITIVE_INTEGER_FIELD,
      range: {
        type: [Number],
        required: true,
        default: [],
        validate: _isValidResultRange,
        validationError: "Invalid TableResult range which must be a length-2 array of ascending integers"
      },
      drawn: fields.BOOLEAN_FIELD,
      flags: fields.OBJECT_FIELD
    }
  }
}

/**
 * Validate whether a table result has a valid result range.
 * @param {number[]} range    The proposed result range
 * @returns {boolean}         Is the range valid?
 * @private
 */
function _isValidResultRange(range) {
  return (range instanceof Array) && (range.length === 2) && range.every(Number.isInteger) && (range[1] >= range[0]);
}

/* ---------------------------------------- */

/**
 * An inner-object which defines the schema for how Tile occlusion settings are defined
 * @extends DocumentData
 * @property {number} mode        The occlusion mode from CONST.TILE_OCCLUSION_MODES
 * @property {number} alpha       The occlusion alpha between 0 and 1
 * @property {number} [radius]    An optional radius of occlusion used for RADIAL mode
 */
class TileOcclusion extends DocumentData {
  static defineSchema() {
    return {
      mode: fields.field(fields.REQUIRED_NUMBER, {
        default: CONST.TILE_OCCLUSION_MODES.FADE,
        validate: m => Object.values(CONST.TILE_OCCLUSION_MODES).includes(m),
        validationError: "Invalid {name} {field} which must be a value in CONST.TILE_OCCLUSION_MODES"
      }),
      alpha: fields.field(fields.ALPHA_FIELD, {default: 0})
    }
  }
}


/* ---------------------------------------- */

/**
 * An inner-object which defines the schema for how Tile video backgrounds are managed
 * @extends DocumentData
 * @property {boolean} loop       Automatically loop the video?
 * @property {boolean} autoplay   Should the video play automatically?
 * @property {number} volume      The volume level of any audio that the video file contains
 */
class VideoData extends DocumentData {
  static defineSchema() {
    return {
      loop: fields.field(fields.BOOLEAN_FIELD, {default: true}),
      autoplay: fields.field(fields.BOOLEAN_FIELD, {default: true}),
      volume: fields.field(fields.ALPHA_FIELD, {default: 0})
    }
  }

  /** @inheritdoc */
  _initialize() {
    super._initialize();
    this.volume = this.volume.toNearest(0.01);
  }
}

/* ---------------------------------------- */

/**
 * The data schema for a Tile embedded document.
 * @extends DocumentData
 * @memberof data
 * @see BaseTile
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseTile} [document]           The embedded document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies this Tile embedded document
 * @property {string} img                 An image or video file path which this tile displays
 * @property {number} [width=100]         The pixel width of the tile
 * @property {number} [height=100]        The pixel height of the tile
 * @property {number} [scale=1]           The multiplicative scale factor for the tile
 * @property {number} [x=0]               The x-coordinate position of the top-left corner of the tile
 * @property {number} [y=0]               The y-coordinate position of the top-left corner of the tile
 * @property {number} [z=100]             The z-index ordering of this tile relative to its siblings
 * @property {number} [rotation=0]        The angle of rotation for the tile between 0 and 360
 * @property {boolean} [hidden=false]     Is the tile currently hidden?
 * @property {boolean} [locked=false]     Is the tile currently locked?
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class TileData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      img: fields.VIDEO_FIELD,
      width: fields.REQUIRED_NUMBER,
      height: fields.REQUIRED_NUMBER,
      x: fields.REQUIRED_NUMBER,
      y: fields.REQUIRED_NUMBER,
      z: fields.field(fields.INTEGER_FIELD, {required: true, default: 100}),
      rotation: fields.field(fields.ANGLE_FIELD, {default: 0}),
      alpha: fields.ALPHA_FIELD,
      tint: fields.COLOR_FIELD,
      hidden: fields.BOOLEAN_FIELD,
      locked: fields.BOOLEAN_FIELD,
      overhead: fields.field(fields.BOOLEAN_FIELD, {default: false}),
      occlusion: {
        type: TileOcclusion,
        required: false,
        default: {}
      },
      video: {
        type: VideoData,
        required: false,
        default: {}
      },
      flags: fields.OBJECT_FIELD
    }
  }

  /** @inheritdoc */
  _initializeSource(data) {
    data = super._initializeSource(data);
    data.width = data.width.toNearest(0.1);
    data.height = data.height.toNearest(0.1);
    return data;
  }
}

/* ---------------------------------------- */

/**
 * An embedded data structure for the contents of a Token attribute bar.
 * @extends DocumentData
 * @see TokenData
 * @memberof data
 *
 * @param {object} data                 Initial data used to construct the data object
 * @param {BaseToken} [document]        The document to which this data object belongs
 *
 * @property {string} [attribute]       The attribute path within the Token's Actor data which should be displayed
 */
class TokenBarData extends DocumentData {
  static defineSchema() {
    return {
      attribute: {
        type: String,
        default: null,
        nullable: true,
        required: true
      }
    }
  }
}

/**
 * The data schema for a Token document.
 * @extends DocumentData
 * @memberof data
 *
 * @param {object} data                 Initial data used to construct the data object
 * @param {BaseToken} [document]        The document to which this data object belongs
 *
 * @property {string} _id                 The Token _id which uniquely identifies it within its parent Scene
 * @property {string} name                The name used to describe the Token
 * @property {number} [displayName=0]     The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
 * @property {string|null} actorId        The _id of an Actor document which this Token represents
 * @property {boolean} [actorLink=false]  Does this Token uniquely represent a singular Actor, or is it one of many?
 * @property {object} [actorData]         Token-level data which overrides the base data of the associated Actor
 * @property {string} img                 A file path to an image or video file used to depict the Token
 * @property {string} [tint=null]         An optional color tint applied to the Token image
 * @property {number} [width=1]           The width of the Token in grid units
 * @property {number} [height=1]          The height of the Token in grid units
 * @property {number} [scale=1]           A scale factor applied to the Token image, between 0.25 and 3
 * @property {boolean} [mirrorX=false]    Flip the Token image horizontally?
 * @property {boolean} [mirrorY=false]    Flip the Token image vertically?
 * @property {number} [x=0]               The x-coordinate of the top-left corner of the Token
 * @property {number} [y=0]               The y-coordinate of the top-left corner of the Token
 * @property {number} [elevation=0]       The vertical elevation of the Token, in distance units
 * @property {boolean} [lockRotation=false]  Prevent the Token image from visually rotating?
 * @property {number} [rotation=0]        The rotation of the Token in degrees, from 0 to 360. A value of 0 represents a southward-facing Token.
 * @property {string[]} [effects]         An array of effect icon paths which are displayed on the Token
 * @property {string} [overlayEffect]     A single icon path which is displayed as an overlay on the Token
 * @property {number} [alpha=1]           The opacity of the token image
 * @property {boolean} [hidden=false]     Is the Token currently hidden from player view?
 * @property {boolean} [vision]           Is this Token a source of vision?
 * @property {number} [dimSight=0]        How far in distance units the Token can naturally see as if in dim light
 * @property {number} [brightSight=0]     How far in distance units the Token can naturally see as if in bright light
 * @property {number} [sightAngle=360]    The angle at which this Token is able to see, if it has vision
 * @property {number} [dimLight=0]        How far in distance units this Token emits dim light
 * @property {number} [brightLight=0]     How far in distance units this Token emits bright light
 * @property {number} [lightAngle=360]    The angle at which this Token is able to emit light
 * @property {string} [lightColor]        The color of the token's emitted light as an HTML hexadecimal color string
 * @property {number} [lightAlpha=0.25]   The intensity of any light emitted by the token
 * @property {AnimationData} [lightAnimation] A data object which configures token light animation settings
 * @property {number} [disposition=-1]    A displayed Token disposition from CONST.TOKEN_DISPOSITIONS
 * @property {number} [displayBars=0]     The display mode of Token resource bars, from CONST.TOKEN_DISPLAY_MODES
 * @property {data.TokenBarData} [bar1]   The configuration of the Token's primary resource bar
 * @property {data.TokenBarData} [bar2]   The configuration of the Token's secondary resource bar
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class TokenData extends DocumentData {
  static defineSchema() {
    const vError = "Invalid {name} {field} distance which must be a number with absolute value less than 1000";
    return {
      _id: fields.DOCUMENT_ID,
      name: fields.STRING_FIELD,
      displayName: {
        type: Number,
        required: true,
        default: CONST.TOKEN_DISPLAY_MODES.NONE,
        validate: m => Object.values(CONST.TOKEN_DISPLAY_MODES).includes(m),
        validationError: "Invalid {name} {field} which must be a value in CONST.TOKEN_DISPLAY_MODES"
      },
      actorId: fields.foreignDocumentField({
        type: documents.BaseActor,
        required: true
      }),
      actorLink: fields.BOOLEAN_FIELD,
      actorData: fields.OBJECT_FIELD,
      img: fields.field(fields.VIDEO_FIELD, {default: () => this.DEFAULT_ICON}),
      tint: fields.COLOR_FIELD,
      width: fields.field(fields.REQUIRED_POSITIVE_NUMBER, {default: 1}),
      height: fields.field(fields.REQUIRED_POSITIVE_NUMBER, {default: 1}),
      scale: {
        type: Number,
        required: true,
        default: 1,
        validate: s => s.between(0.25, 10, true),
        validationError: "Invalid {name} {field} which must be a number between 0.25 and 10"
      },
      mirrorX: fields.BOOLEAN_FIELD,
      mirrorY: fields.BOOLEAN_FIELD,
      x: fields.REQUIRED_NUMBER,
      y: fields.REQUIRED_NUMBER,
      elevation: fields.REQUIRED_NUMBER,
      lockRotation: fields.BOOLEAN_FIELD,
      rotation: fields.field(fields.ANGLE_FIELD, {default: 0}),
      effects: {
        type: [String],
        required: true,
        default: []
      },
      overlayEffect: fields.STRING_FIELD,
      alpha: fields.ALPHA_FIELD,
      hidden: fields.BOOLEAN_FIELD,
      vision: {
        type: Boolean,
        required: true,
        default: data => [data.dimSight, data.brightSight].some(s => Number.isFinite(s) && (s > 0))
      },
      dimSight: fields.field(fields.REQUIRED_NUMBER, {validate: _validateVisionDistance, validationError: vError}),
      brightSight: fields.field(fields.REQUIRED_NUMBER, {validate: _validateVisionDistance, validationError: vError}),
      dimLight: fields.field(fields.REQUIRED_NUMBER, {validate: _validateVisionDistance, validationError: vError}),
      brightLight: fields.field(fields.REQUIRED_NUMBER, {validate: _validateVisionDistance, validationError: vError}),
      sightAngle: fields.ANGLE_FIELD,
      lightAngle: fields.ANGLE_FIELD,
      lightColor: fields.COLOR_FIELD,
      lightAlpha: fields.field(fields.ALPHA_FIELD, {default: 0.25}),
      lightAnimation: {
        type: AnimationData,
        required: true,
        default: {}
      },
      disposition: {
        type: Number,
        required: true,
        default: CONST.TOKEN_DISPOSITIONS.HOSTILE,
        validate: n => Object.values(CONST.TOKEN_DISPOSITIONS).includes(n),
        validationError: "Invalid {name} {field} which must be a value in CONST.TOKEN_DISPOSITIONS"
      },
      displayBars: {
        type: Number,
        required: true,
        default: CONST.TOKEN_DISPLAY_MODES.NONE,
        validate: m => Object.values(CONST.TOKEN_DISPLAY_MODES).includes(m),
        validationError: "Invalid {name} {field} which must be a value in CONST.TOKEN_DISPLAY_MODES"
      },
      bar1: {
        type: TokenBarData,
        required: true,
        default: () => {
          return {attribute: game?.system.data.primaryTokenAttribute || null};
        }
      },
      bar2: {
        type: TokenBarData,
        required: true,
        default: () => {
          return {attribute: game?.system.data.secondaryTokenAttribute || null};
        }
      },
      flags: fields.OBJECT_FIELD
    }
  }

  /**
   * The default icon used for newly created Item documents
   * @type {string}
   */
  static DEFAULT_ICON = CONST.DEFAULT_TOKEN;

  /** @inheritdoc */
  _initialize() {
    super._initialize();
    for ( let k of ["dimSight", "brightSight", "dimLight", "brightLight"] ) {
      this[k] = this[k].toNearest(0.01);
    }
    while ( this.lightAngle <= 0 ) this.lightAngle += 360;
    while ( this.sightAngle <= 0 ) this.sightAngle += 360;
  }
}

/**
 * Verify that distances used for vision configuration are upper-bounded by a reasonable maximum
 * @param {number} d      The candidate number
 * @returns {boolean}     Is it valid?
 * @private
 */
function _validateVisionDistance(d) {
  return Math.abs(d) <= 1000;
}

/* ---------------------------------------- */

/**
 * The data schema for a User document
 * @extends DocumentData
 * @memberof data
 * @see BaseUser
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseUser} [document]           The document to which this data object belongs
 */
class UserData extends DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      avatar: fields.IMAGE_FIELD,
      character: fields.foreignDocumentField({
        type: documents.BaseActor,
        required: false
      }),
      color: fields.field(fields.COLOR_FIELD, {
        default: () => "#" + rgbToHex(hsvToRgb(Math.random(), 0.8, 0.8)).toString(16),
        required: true
      }),
      hotbar: {
        type: Object,
        required: true,
        default: {},
        validate: _validateHotbar,
        validationError: "Invalid User hotbar data structure"
      },
      name: fields.REQUIRED_STRING,
      password: fields.BLANK_STRING,
      passwordSalt: fields.STRING_FIELD,
      permissions: fields.field(fields.DOCUMENT_PERMISSIONS, {
        default: {},
        validate: _validatePermissions
      }),
      role: {
        type: Number,
        required: true,
        nullable: false,
        default: CONST.USER_ROLES.PLAYER
      },
      flags: fields.OBJECT_FIELD
    }
  }
}

/**
 * Validate the structure of the User hotbar object
 * @param {object} bar      The attempted hotbar data
 * @return {boolean}
 * @private
 */
function _validateHotbar(bar) {
  if ( typeof bar !== "object" ) return false;
  for ( let [k, v] of Object.entries(bar) ) {
    let slot = parseInt(k);
    if ( !slot || slot < 1 || slot > 50 ) return false;
    if ( !isValidId(v) ) return false;
  }
  return true;
}

/**
 * Validate the structure of the User permissions object
 * @param {object} perms      The attempted permissions data
 * @return {boolean}
 * @private
 */
function _validatePermissions(perms) {
  for ( let [k, v] of Object.entries(perms) ) {
    if (( typeof k !== "string") || (typeof v !== "boolean") ) return false;
  }
  return true;
}

/* ----------------------------------------- */

/**
 * The data schema for a Wall document.
 * @extends DocumentData
 * @memberof data
 * @see BaseWall
 *
 * @param {object} data                   Initial data used to construct the data object
 * @param {BaseWall} [document]           The embedded document to which this data object belongs
 *
 * @property {string} _id                 The _id which uniquely identifies the embedded Wall document
 * @property {number[]} c                 The wall coordinates, a length-4 array of finite numbers [x0,y0,x1,y1]
 * @property {number} [move=0]            The movement restriction type of this wall
 * @property {number} [sense=0]           The sensory restriction type of this wall
 * @property {number} [dir=0]             The direction of effect imposed by this wall
 * @property {number} [door=0]            The type of door which this wall contains, if any
 * @property {number} [ds=0]              The state of the door this wall contains, if any
 * @property {object} [flags={}]          An object of optional key/value flags
 */
class WallData extends DocumentData {

  /**
   * The data schema for a WallData object
   * @returns {DocumentSchema}
   */
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      c: {
        type: [Number],
        required: true,
        validate: c => ((c instanceof Array) && (c.length === 4) && c.every(n => Number.isFinite(n))),
        validationError: "Invalid {name} coordinates provided which must be a length-4 array of finite numbers"
      },
      move: fields.field(fields.REQUIRED_NUMBER, {
        default: CONST.WALL_MOVEMENT_TYPES.NORMAL,
        validate: v => Object.values(CONST.WALL_MOVEMENT_TYPES).includes(v),
        validationError: "Invalid {name} {field} which must be a value in CONST.WALL_MOVEMENT_TYPES"
      }),
      sense: fields.field(fields.REQUIRED_NUMBER, {
        default: CONST.WALL_SENSE_TYPES.NORMAL,
        validate: v => Object.values(CONST.WALL_SENSE_TYPES).includes(v),
        validationError: "Invalid {name} {field} which must be a value in CONST.WALL_SENSE_TYPES"
      }),
      sound: fields.field(fields.REQUIRED_NUMBER, {
        default: CONST.WALL_SENSE_TYPES.NORMAL,
        validate: v => Object.values(CONST.WALL_SENSE_TYPES).includes(v),
        validationError: "Invalid {name} {field} which must be a value in CONST.WALL_SENSE_TYPES"
      }),
      dir: fields.field(fields.REQUIRED_NUMBER, {
        default: CONST.WALL_DIRECTIONS.BOTH,
        validate: v => Object.values(CONST.WALL_DIRECTIONS).includes(v),
        validationError: "Invalid {name} {field} which must be a value in CONST.WALL_DIRECTIONS"
      }),
      door: fields.field(fields.REQUIRED_NUMBER, {
        default: CONST.WALL_DOOR_TYPES.NONE,
        validate: v => Object.values(CONST.WALL_DOOR_TYPES).includes(v),
        validationError: "Invalid {name} {field} which must be a value in CONST.WALL_DOOR_TYPES"
      }),
      ds: fields.field(fields.REQUIRED_NUMBER, {
        default: CONST.WALL_DOOR_STATES.CLOSED,
        validate: v => Object.values(CONST.WALL_DOOR_STATES).includes(v),
        validationError: "Invalid {name} {field} which must be a value in CONST.WALL_DOOR_STATES"
      }),
      flags: fields.OBJECT_FIELD
    }
  }
}

// Module Exports
export {
  ActiveEffectData,
  ActorData,
  AmbientLightData,
  AmbientSoundData,
  CombatData,
  CombatantData,
  ChatMessageData,
  DrawingData,
  FogExplorationData,
  FolderData,
  ItemData,
  JournalEntryData,
  MacroData,
  MeasuredTemplateData,
  NoteData,
  PlaylistData,
  PlaylistSoundData,
  PrototypeTokenData,
  RollTableData,
  SceneData,
  SettingData,
  TableResultData,
  TileData,
  TokenData,
  UserData,
  WallData
}
