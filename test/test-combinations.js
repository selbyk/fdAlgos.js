"use strict";
var _ = require('lodash');
var chai = require('chai').use(require('chai-things'));
var assert = chai.assert;
var expects = chai.expect;
var combinationsFunction = require('../lib/combinations');

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
