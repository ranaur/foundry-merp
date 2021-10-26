/**
 * A simple Semaphore implementation which provides a limited queue for ensuring proper concurrency.
 * @param {number} [max=1]    The maximum number of tasks which are allowed concurrently.
 *
 * @example
 * // Some async function that takes time to execute
 * function fn(x) {
 *   return new Promise(resolve => {
 *     setTimeout(() => {
 *       console.log(x);
 *       resolve(x);
 *     }, 1000));
 *   }
 * };
 *
 * // Create a Semaphore and add many concurrent tasks
 * const semaphore = new Semaphore(1);
 * for ( let i of Array.fromRange(100) ) {
 *   semaphore.add(fn, i);
 * }
 */
class Semaphore {
  constructor(max=1) {

    /**
     * The maximum number of tasks which can be simultaneously attempted.
     * @type {number}
     */
    this.max = max;

    /**
     * A queue of pending function signatures
     * @type {Array<Array<Function|*>>}
     * @private
     */
    this._queue = [];

    /**
     * The number of tasks which are currently underway
     * @type {number}
     * @private
     */
    this._active = 0;
  }

  /**
   * The number of pending tasks remaining in the queue
   * @type {number}
   */
  get remaining() {
    return this._queue.length;
  }

  /**
   * The number of actively executing tasks
   * @type {number}
   */
  get active() {
    return this._active;
  }

  /**
   * Add a new tasks to the managed queue
   * @param {Function} fn     A callable function
   * @param {...*} [args]     Function arguments
   */
  add(fn, ...args) {
    const signature = [fn].concat(...args);
    this._queue.push(signature);
    this._try();
  }

  /**
   * Abandon any tasks which have not yet concluded
   */
  clear() {
    this._queue = [];
  }

  /**
   * Attempt to perform a task from the queue.
   * If all workers are busy, do nothing.
   * If successful, try again.
   * @return {boolean}        Was a function called?
   * @private
   */
  async _try() {
    if ( (this.active === this.max) || !this.remaining ) return false;
    const next = this._queue.shift();
    if ( !next ) return false;
    this._active += 1;
    try {
      const fn = next.shift();
      await fn(...next);
    } finally {
      this._active -= 1;
      this._try();
    }
    return true;
  }
}
export default Semaphore;
