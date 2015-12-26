"use strict";
var _ = require('lodash');
var chai = require('chai').use(require('chai-things'));
var assert = chai.assert;
var expects = chai.expect;
var bcnfFunction = require('../lib/bcnf');

describe('bcnf', function() {
  it('should return [] when given []');
  it('should return correct array of candidate keys', function(done) {
    // Set of attributes
    // Set of attributes
    var X = ['A', 'B', 'C', 'D', 'E', 'G', 'H'];
    //var X = ['A','B','C','D','E'];

    // Set of functional dependencies
    var F = [
      [
        ['B'],
        ['E']
      ],
      [
        ['B'],
        ['H']
      ],
      [
        ['E'],
        ['A']
      ],
      [
        ['E'],
        ['D']
      ],
      [
        ['A', 'H'],
        ['C']
      ],
    ];
    /* var F = [
        [[""A"",""B""], [""E""]],
        [[""A"",""D""], [""B""]],
        [[""B""], [""C""]],
        [[""C""], [""D""]]
     ];*/

    //B,E;B,H;E,A;E,D;AH,C


    /* var expected = [
       ['C', 'D'],
       ['B', 'C'],
       ['A', 'B', 'E']
    ];
    */
    var expected = [
      ['A', 'H', 'C'],
      ['E', 'A', 'D'],
      ['B', 'E', 'H'],
      ['B', 'G']
    ];
    var result = bcnfFunction(X, F);
    result = _.chain(result).map(function(a) {
      return _.sortBy(a, function(k) {
        return k;
      });
    }).sortBy(function(a) {
      return a.join('');
    }).value();
    expected = _.chain(expected).map(function(a) {
      return _.sortBy(a, function(k) {
        return k;
      });
    }).sortBy(function(a) {
      return a.join('');
    }).value();

    //console.log(result);

    //console.log(expected);
    //console.log(result.length, expected.length);
    expects(result).to.be.an('array');
    assert.equal(result.length, expected.length);
    _.forEach(result, function(a, i) {
      assert(_.isEqual(a, expected[i]), 'arrays must be equal');
    });

    done();
  });
  it('should throw error on incorrect input params', function(done) {
    var set = 'loljk';
    expects(bcnfFunction.bind(set)).to.throw(TypeError);
    done();
  });
});
