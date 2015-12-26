"use strict";
var _ = require('lodash');
var chai = require('chai').use(require('chai-things'));
var assert = chai.assert;
var expects = chai.expect;

var helpers = require('../lib/helpers');

var closureFunction = helpers.closure;
var combinationsFunction =  helpers.combinations;
var ckFunction =  helpers.computeCandidateKeys;

Math.factorial = function(n) {
  var i = n;
  while (--i) n *= i;
  return n;
};

Math.combinations = function(n, r, repeats) {
  if (n < r) return 0;
  if (n === r) return 1;
  if (repeats) {
    return Math.factorial(n + r - 1) / ((Math.factorial(r) * Math.factorial(n - 1)));
  }
  return Math.factorial(n) / ((Math.factorial(r) * Math.factorial(n - r)));
};


describe('combinations', function() {
  it('should return [] when given []', function(done) {
    var result = combinationsFunction([]);
    assert.typeOf(result, 'array');
    //assert.equal(result, []);
    assert.lengthOf(result, 0);
    done();
  });
  it('should return correct array of combinations when given array', function(done) {
    var set = ['a', 'b', 'c', 'd'];
    var result = combinationsFunction(set);
    expects(result).to.be.an('array');
    _.chain(result).groupBy(result, function(a) {
      return a.length;
    }).forEach({
      'a': 1,
      'b': 2
    }, function(a, i) {
      assert.equal(a.length, Math.combinations(set.length, i));
      assert.equal(_.difference(set, _.chain().difference(set, _.flatten(a))), 0);
    });
    done();
  });
  it('should throw error on incorrect input params', function(done) {
    var set = 'loljk';
    expects(combinationsFunction.bind(set)).to.throw(TypeError);
    done();
  });
});

describe('closure', function() {
  it('should return [] when given []', function(done) {
    var result = closureFunction([]);
    assert.typeOf(result, 'array');
    //assert.equal(result, []);
    assert.lengthOf(result, 0);
    done();
  });
  it('should return correct array of combinations when given array', function(done) {
    /*
      Functional Dependencies
      AB → C
      C → B
      C → A
    */
    // Set of attributes
    var X = ['A', 'B', 'C'];

    // Set of functional dependencies
    var F = [
      [
        ['A', 'B'],
        ['C']
      ],
      [
        ['C'],
        ['B']
      ],
      [
        ['C'],
        ['A']
      ]
    ];
    /*
      Closure should be:
      A → A
      B → B
      C → ABC
      AB → ABC
      AC → ABC
      BC → ABC
      ABC → ABC
    */
    var result = closureFunction(X, F);
    var expected = [
      [
        ['A'],
        ['A']
      ],
      [
        ['B'],
        ['B']
      ],
      [
        ['C'],
        ['A', 'B', 'C']
      ],
      [
        ['A', 'B'],
        ['A', 'B', 'C']
      ],
      [
        ['A', 'C'],
        ['A', 'B', 'C']
      ],
      [
        ['B', 'C'],
        ['A', 'B', 'C']
      ],
      [
        ['A', 'B', 'C'],
        ['A', 'B', 'C']
      ]
    ];

    expects(result).to.be.an('array');
    assert.equal(result.length, expected.length);
    _.forEach(result, function(a, i) {
      assert(_.isEqual(a[0], expected[i][0]), 'arrays must be equal');
      assert(_.isEqual(a[1], expected[i][1]), 'arrays must be equal');
    });
    done();
  });
  it('should throw error on incorrect input params', function(done) {
    var set = 'loljk';
    expects(closureFunction.bind(set)).to.throw(TypeError);
    done();
  });
});

describe('candidateKeys', function() {
  it('should return [] when given []');
  it('should return correct array of candidate keys', function(done) {
    // Set of attributes
    var X = ['A', 'B', 'C', 'D', 'E', 'G'];

    // Set of functional dependencies
    var F = [
      [
        ['A', 'B'],
        ['C', 'D']
      ],
      [
        ['A'],
        ['B']
      ],
      [
        ['B'],
        ['C']
      ],
      [
        ['C'],
        ['E']
      ],
      [
        ['B', 'D'],
        ['A']
      ]
    ];

    var expected = [
      ['A', 'G'],
      ['B', 'D', 'G']
    ];

    var result = ckFunction(X, F);
    expects(result).to.be.an('array');
    assert.equal(result.length, expected.length);
    _.forEach(result, function(a, i) {
      assert(_.isEqual(a, expected[i]), 'arrays must be equal');
    });
    //console.log(result);

    //console.log(expected);
    //console.log(result.length, expected.length);

    done();
  });
  it('should throw error on incorrect input params', function(done) {
    var set = 'loljk';
    expects(ckFunction.bind(set)).to.throw(TypeError);
    done();
  });
});
