function propertyToMethod(property, prefix) {
  var f = property.charAt(0).toUpperCase();
  return prefix + f + property.substr(1, property.length-1);
}

function defineModel(cls, schema) {
  if (!schema) {
    throw new Error('Schema is not defined');
  }
  var properties = Object.keys(schema);

  properties.forEach(function(property) {
    var setter = schema[property].setter;

    if (!setter) {
      setter = function(value) {
        return this._set(property, value);
      };
    }
    cls.prototype[propertyToMethod(property, 'set')] = setter;

    var getter = schema[property].getter;
    if (!getter) {
      getter = function() {
        return this._get(property);
      };
    }
    cls.prototype[propertyToMethod(property, 'get')] = getter;
  });

  cls.prototype._get = function(key) {
    return this[key];
  };

  cls.prototype._set = function(key, val) {
    this[key] = val;
    return this;
  };

  cls.prototype.schema = schema;

  cls.prototype.hasProp = function(property) {
    return schema.hasOwnProperty(property);
  };

  cls.prototype.set = function(key, value) {
    if (this.hasProp(key)) {
      return this[propertyToMethod(key, 'set')](value);
    }
    return false;
  };

  cls.prototype.get = function(property) {
    if (this.hasProp(property)) {
      return this[propertyToMethod(property, 'get')]();
    }
    return false;
  };

  cls.prototype.getPropNames = function() {
    return Object.keys(schema);
  };

  cls.prototype.toJSON = function() {
    return this.toObject();
  };

  cls.prototype.toObject = function() {
    var result = {};
    properties.forEach(function(key) {
      var val = this.get(key);
      if (val && typeof val === 'object') {
        if (typeof val.toObject === 'function') {
          val = val.toObject();
        }
      }
      result[key] = val;
    }, this);
    return result;
  };

  cls.prototype.fromObject = function(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.set(key, obj[key]);
      }
    }
  };

  cls.prototype.reset = function() {
    properties.forEach(function(prop) {
      this[prop] = schema[prop].default;
    }, this);
  };

  cls.prototype.init = function(obj) {
    this.reset();

    if (obj && typeof obj === 'object') {
      this.fromObject(obj);
    }
  };

  return cls;
}

exports.build = defineModel;