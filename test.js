var test = require('tape');
var util = require('util');
var exploder = require('./');
var flattened = require('./examples').flattened;

test('expands root level', function (t) {
  var nested = exploder()(flattened);

  t.assert('address' in nested, '`address` not found in object `nested`.');
  t.assert(util.isObject(nested.address), '`nested.address` is not an object.');

  t.end();
});

test('expands via keypath', function (t) {
  var contact = exploder('contacts')(flattened).contacts[0];

  t.assert('location' in contact, '`location` not found in object `contact`.');
  t.assert(util.isObject(contact.location), '`contact.location` is not an object.');

  t.end();
});

test('expands via keypath list', function (t) {
  var nested = exploder('contacts', 'favorites')(flattened);

  var contact = nested.contacts[0];
  t.assert('location' in contact, '`location` not found in object `contact`.');
  t.assert(util.isObject(contact.location), '`contact.location` is not an object.');

  var favorite = nested.favorites[0];
  t.assert('contact' in favorite, '`contact` not found in object `favorite`.');
  t.assert(util.isObject(favorite.contact), '`favorite.contact` is not an object.');

  t.end();
});

test('expands via keypath array', function (t) {
  var nested = exploder(['contacts', 'favorites'])(flattened);

  var contact = nested.contacts[0];
  t.assert('location' in contact, '`location` not found in object `contact`.');
  t.assert(util.isObject(contact.location), '`contact.location` is not an object.');

  var favorite = nested.favorites[0];
  t.assert('contact' in favorite, '`contact` not found in object `favorite`.');
  t.assert(util.isObject(favorite.contact), '`favorite.contact` is not an object.');

  t.end();
});
