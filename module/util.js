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

export function removePrefix(str, prefix) {
  const hasPrefix = str.indexOf(prefix) === 0;
  return hasPrefix ? str.substr(prefix.length) : str.toString();
}

export function removeSuffix(str, suffix) {
  const hasSuffix = str.substr(-suffix.length) == suffix;
  return hasSuffix ? str.substr(0,str.length - suffix.length) : str.toString();
}

export function stripClassName(obj, prefix = null, suffix = null) {
  let className = obj.constructor.name;
  if(prefix === null) prefix = "Merp1e";
  className = removePrefix(className, prefix);
  if(suffix !== null) className = removeSuffix(className, suffix);
  return className;
}

export function getAllSubclasses(baseClass) {
  var globalObject = Function('return this')(); 
  var allVars = Object.keys(globalObject);
  var classes = allVars.filter(function (key) {
  try {
    var obj = globalObject[key];
        return obj.prototype instanceof baseClass;
    } catch (e) {
        return false;
    }
  });
  return classes;
}

