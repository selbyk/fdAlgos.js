"use strict";
var _ = require('lodash');
var chai = require('chai').use(require('chai-things'));
var assert = chai.assert;
var expects = chai.expect;

var bernsteinFunction = require('../lib/bernstein');

describe('bernstein', function() {
  it('should return [] when given []');
  it('should return correct array of candidate keys', function(done) {
    // Set of attributes
    var X = ['A', 'B', 'C', 'D', 'E'];

    // Set of functional dependencies
    var F = [
      [
        ['A'],
        ['B']
      ],
      [
        ['A'],
        ['C']
      ],
      [
        ['C'],
        ['A']
      ],
      [
        ['B', 'D'],
        ['E']
      ]
    ];

    var expected = [
      ['A', 'B', 'C'],
      ['B', 'D', 'E'],
      ['A', 'D']
    ];

    var result = bernsteinFunction(X, F);

    //console.log(result);

    //console.log(expected);
    //console.log(result.length, expected.length);
    expects(result).to.be.an('array');
    assert.equal(result.length, expected.length);
    _.forEach(result, function(a, i) {
      assert(_.isEqual(a, expected[i]), 'arrays must be equal');
      assert(_.isEqual(a, expected[i]), 'arrays must be equal');
    });

    done();
  });
  it('should throw error on incorrect input params', function(done) {
    var set = 'loljk';
    expects(bernsteinFunction.bind(set)).to.throw(TypeError);
    done();
  });
});
