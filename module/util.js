export function copyClassFunctions(obj, className) {
    for (var prop of Object.getOwnPropertyNames( className.prototype )) {
      if (!(prop in obj)) {
        obj[prop] = className.prototype[prop];
      }
    }
}

export function formatBonus(value) {
  let bonus = parseInt(value || 0);
  if(bonus >= 0) return "+" + String(bonus);
  else return String(bonus);
}
