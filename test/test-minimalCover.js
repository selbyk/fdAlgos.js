"use strict";
var _ = require('lodash');
var chai = require('chai').use(require('chai-things'));
var assert = chai.assert;
var expects = chai.expect;
var minCoverFunction = require('../lib/minimalCover');

describe('minCovers', function() {
  it('should return [] when given []', function(done) {
    var result = minCoverFunction([], []);
    assert.typeOf(result, 'array');
    //assert.equal(result, []);
    assert.lengthOf(result, 0);
    done();
  });
  it('should return correct array of combinations when given array', function(done) {
    // Set of attributes
    var X = ['A', 'B', 'C', 'D', 'E', 'G', 'H'];

    // Set of functional dependencies
    var F = [
      [
        ['C', 'D'],
        ['A', 'B']
      ],
      [
        ['C'],
        ['D']
      ],
      [
        ['D'],
        ['E', 'H']
      ],
      [
        ['A', 'E'],
        ['C']
      ],
      [
        ['A'],
        ['C']
      ],
      [
        ['B'],
        ['D']
      ]
    ];


    var result = minCoverFunction(X, F);
    // F′now becomes {C→A, C→B, D→E, D→H, A→C, B→D}
    var expected = [
      [
        ['C'],
        ['A']
      ],
      [
        ['C'],
        ['B']
      ],
      [
        ['D'],
        ['E']
      ],
      [
        ['D'],
        ['H']
      ],
      [
        ['A'],
        ['C']
      ],
      [
        ['B'],
        ['D']
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
    expects(minCoverFunction.bind(set)).to.throw(TypeError);
    done();
  });
});