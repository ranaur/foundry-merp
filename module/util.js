export function copyClassFunctions(className) {
    for (var prop of Object.getOwnPropertyNames( className.prototype )) {
      if (!(prop in this)) {
          this[prop] = className.prototype[prop];
      }
    }
}

