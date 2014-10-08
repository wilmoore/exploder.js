!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.exploder=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var dot = require('dottie');
var set = require('getobject').set;
var get = require('getobject').get;

module.exports = exploder;

function exploder(keypaths) {
  keypaths = vargs(arguments);

  return function transform(object) {
    var ref = dot.transform(object);
    var end = keypaths.length;
    var idx = -1;

    while (++idx < end) {
      set(ref, keypaths[idx], dot.transform(get(ref, keypaths[idx])));
    }

    return ref;
  };
}

function vargs(arraylike) {
  if ('[object Array]' === ({}).toString.call(arraylike[0])) {
    return arraylike[0];
  }

  return [].slice.call(arraylike);
}

},{"dottie":2,"getobject":3}],2:[function(require,module,exports){
(function(undefined) {
	var root = this;

	// Weird IE shit, objects do not have hasOwn, but the prototype does...
	var hasOwnProp = Object.prototype.hasOwnProperty;

	// Object cloning function, uses jQuery/Underscore/Object.create depending on what's available

	var clone = function (object) {
		if (typeof Object.hasOwnProperty !== 'undefined') {
			var target = {};
			for (var i in object) {
				if (hasOwnProp.call(object, i)) {
					target[i] = object[i];
				}
			}
			return target;
		}
		if (typeof jQuery !== 'undefined') {
			return jQuery.extend({}, object);
		}
		if (typeof _ !== 'undefined') {
			return _.extend({}, object);
		}
	};

	var Dottie = function() {
		var args = Array.prototype.slice.call(arguments);

		if (args.length == 2) {
			return Dottie.find.apply(this, args);
		}
		return Dottie.transform.apply(this, args);
	};

	// Legacy syntax, changed syntax to have get/set be similar in arg order
	Dottie.find = function(path, object) {
		return Dottie.get(object, path);
	};

	// Traverse object according to path, return value if found - Return undefined if destination is unreachable
	Dottie.get = function(object, path) {
		var pieces = path.split('.'), current = object, piece;

		if (current) {
			for (var index = 0, length = pieces.length; index < length; index++) {
				piece = pieces[index];
				if (!hasOwnProp.call(current, piece)) {
					return undefined;
				}
				current = current[piece];

				if (current === undefined) {
					return undefined;
				}
			}
			return current;
		}
		return undefined;
	};

	// Set nested value
	Dottie.set = function(object, path, value) {
		var pieces = path.split('.'), current = object, piece, length = pieces.length;

		for (var index = 0; index < length; index++) {
			piece = pieces[index];
			if (!hasOwnProp.call(current, piece) || current[piece] === undefined) {
				current[piece] = {};
			}

			if (typeof current !== 'object') throw new Error('Target key is not suitable for a nested value (it is either not undefined or not an object)');

			if (index == (length - 1)) {
				current[piece] = value;
			} else {
				current = current[piece];
			}
		}

		current[piece] = value;
	};

	// Set default nested value
	Dottie['default'] = function(object, path, value) {
		if (Dottie.get(object, path) === undefined) {
			Dottie.set(object, path, value);
		}
	};

	// Transform unnested object with .-seperated keys into a nested object.
	Dottie.transform = function Dottie$transformfunction(object, options) {
		if (Array.isArray(object)) {
			return object.map(function(o) {
				return Dottie.transform(o, options);
			});
		}

		options = options || {};
		options.delimiter = options.delimiter || '.';

		var pieces,
			piecesLength,
			piece,
			current,
			transformed = {},
			key,
			keys = Object.keys(object),
			length = keys.length,
			i;

		for (i = 0; i < length; i++) {
			key = keys[i];

			if (key.indexOf(options.delimiter) !== -1) {
				pieces = key.split(options.delimiter);
				piecesLength = pieces.length;
				current = transformed;

				for (var index = 0; index < piecesLength; index++) {
					piece = pieces[index];
					if (index != (piecesLength - 1) && !current.hasOwnProperty(piece)) {
						current[piece] = {};
					}

					if (index == (piecesLength - 1)) {
						current[piece] = object[key];
					}

					current = current[piece];
					if (current === null) {
						break;
					}
				}
			} else {
				transformed[key] = object[key];
			}
		}

		return transformed;
	};

	Dottie.flatten = function(object, seperator) {
		if (typeof seperator === "undefined") seperator = '.';
		var flattened = {},
			current,
			nested;

		for (var key in object) {
			if (hasOwnProp.call(object, key)) {
				current = object[key];
				if (current === Object(current)) {
					nested = Dottie.flatten(current, seperator);

					for (var _key in nested) {
						flattened[key+seperator+_key] = nested[_key];
					}
				} else {
					flattened[key] = current;
				}
			}
		}

		return flattened;
	}

	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = Dottie;
	} else {
		root['Dottie'] = Dottie;
		root['Dot'] = Dottie; //BC

		if (typeof define === "function") {
			define([], function () { return Dottie; });
		}
	}
})();

},{}],3:[function(require,module,exports){
/*
 * getobject
 * https://github.com/cowboy/node-getobject
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 */

'use strict';

var getobject = module.exports = {};

// Split strings on dot, but only if dot isn't preceded by a backslash. Since
// JavaScript doesn't support lookbehinds, use a placeholder for "\.", split
// on dot, then replace the placeholder character with a dot.
function getParts(str) {
  return str.replace(/\\\./g, '\uffff').split('.').map(function(s) {
    return s.replace(/\uffff/g, '.');
  });
}

// Get the value of a deeply-nested property exist in an object.
getobject.get = function(obj, parts, create) {
  if (typeof parts === 'string') {
    parts = getParts(parts);
  }

  var part;
  while (typeof obj === 'object' && obj && parts.length) {
    part = parts.shift();
    if (!(part in obj) && create) {
      obj[part] = {};
    }
    obj = obj[part];
  }

  return obj;
};

// Set a deeply-nested property in an object, creating intermediary objects
// as we go.
getobject.set = function(obj, parts, value) {
  parts = getParts(parts);

  var prop = parts.pop();
  obj = getobject.get(obj, parts, true);
  if (obj && typeof obj === 'object') {
    return (obj[prop] = value);
  }
};

// Does a deeply-nested property exist in an object?
getobject.exists = function(obj, parts) {
  parts = getParts(parts);

  var prop = parts.pop();
  obj = getobject.get(obj, parts);

  return typeof obj === 'object' && obj && prop in obj;
};

},{}]},{},[1])
(1)
});