
/* ----------------------------------------- */
/*  Reusable Type Definitions                */
/* ----------------------------------------- */

/**
 * A single point, expressed as an object {x, y}
 * @typedef {PIXI.Point|{x: number, y: number}} Point
 */

/**
 * A single point, expressed as an array [x,y]
 * @typedef {number[]} PointArray
 */

/**
 * A Ray intersection point
 * @typedef {{x: number, y: number, t0: number, t1: number}|null} RayIntersection
 * @property [wall] Wall
 */

/**
 * A standard rectangle interface.
 * @typedef {PIXI.Rectangle|{x: number, y: number, width: number, height: number}} Rectangle
 */


/* ----------------------------------------- */
/*  Socket Requests and Responses            */
/* ----------------------------------------- */

/**
 * @typedef {object|object[]|string|string[]} RequestData
 */

/**
 * @typedef {Object} SocketRequest
 * @property {string} [action]        The server-side action being requested
 * @property {string} [type]          The type of object being modified
 * @property {RequestData} [data]     Data applied to the operation
 * @property {string} [pack]          A Compendium pack name
 * @property {string} [parentType]    The type of parent document
 * @property {string} [parentId]      The ID of a parent document
 * @property {object} [options]       Additional options applied to the request
 */

/**
 * @typedef {Object} SocketResponse
 * @property {SocketRequest} request  The initial request
 * @property {Error} [error]          An error, if one occurred
 * @property {string} [status]        The status of the request
 * @property {string} [userId]        The ID of the requesting User
 * @property {RequestData} [data]     Data returned as a result of the request
 */
