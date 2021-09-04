export function copyClassFunctions(obj, className) {
  let properties = Object.getOwnPropertyDescriptors(className.prototype);

  for (var [name, property] of Object.entries(properties)) {
    if (!(name in obj)) {
      if("value" in property) obj[name] = property.value;
      if("set" in property || "get" in property) {
        Object.defineProperty(obj, name, {
          get: property.get,
          set: property.set
        });
      }
    }
  }
}

export function formatBonus(value) {
  let bonus = parseInt(value || 0);
  if(bonus >= 0) return "+" + String(bonus);
  else return String(bonus);
}

export function findByID(array, id, def) {
  return array.filter((a) => a.id == id)[0] || array.filter((a) => a.id == def)[0] || def;
}

export function max(a, b) {
  return a > b ? a : b;
}

