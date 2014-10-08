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
  if (Object.prototype.toString.call(arraylike[0]) === '[object Array]') {
    return arraylike[0];
  }

  return [].slice.call(arraylike);
}
