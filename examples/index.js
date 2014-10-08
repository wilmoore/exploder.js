'use strict';

exports.flattened = {
  "first": "John",
  "last": "Example",

  "address.street": '1000 Extor Street',
  "address.city": 'Peterol',
  "address.state": 'TX',
  "address.zip": '55555',
  "address.website": 'http://example.com',

  "contacts": [{
    "id": 1,
    "location.street": '1001 Extor Street',
    "location.city": 'Peterol',
    "location.state": 'TX',
    "location.zip": '55555',
    "location.website": 'http://example1.com',
  }, {
    "id": 2,
    "location.street": '1002 Extor Street',
    "location.city": 'Peterol',
    "location.state": 'TX',
    "location.zip": '55555',
    "location.website": 'http://example2.com',
  }],

  "favorites": [{
    "contact.website": 'http://example1.com',
  }, {
    "contact.website": 'http://example2.com',
  }]
};

