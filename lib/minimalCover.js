/**
 * Minimal Cover
 *
 */
require('../lib/util.js');
var helpers = require('../lib/helpers');

/**
 * Eliminate left hand side redundancy
 * @param  {Array[Attribute]} relSchema  Attributes that define the entire schema
 * @param  {Array[FunctionalDependency]} functDep  Given functional dependencies
 * @return {Array[FunctionalDependency]} functDep  Given functional dependencies
 */
var elimRedundancy = function(relSchema, functDep) {
  var fm = helpers.breakRHS(functDep);
  var i, j, contin;
  var newFm;
  var fmc;

  var handleFD = function(fd) {
    if (fd[0].length > 1) { // it is a composite key
      // CSC 4402 Notes
      // X is a composite attribute and
      // Z ⊂ X is a proper subset of X and Z → A ∈ (F′)+, do replace X → A
      // with Z → A.
      var replaced = false;
      for (i = 0; i < fmc.length; ++i) {
        var isProperSubset = fd[0].proper_subset(fmc[i][0]);
        //console.log(fd[0] + '->' + fd[1] + ':' + fmc[i][0] + '->' + fmc[i][1]);
        //console.log(isProperSubset);
        if (isProperSubset && fmc[i][1].indexOf(fd[1][0]) !== -1) {
          replaced = true;
          var alreadyIncluded = false;
          for (j = 0; j < fm.length; ++j)
            if (fm[j].equals([fmc[i][0], fd[1][0]])) {
              alreadyIncluded = true;
              break;
            }
          if (alreadyIncluded === false)
            newFm.push([fmc[i][0], fd[1]]);
          break;
        }
      }
      if (replaced === false)
        newFm.push([fd[0], fd[1]]);
    } else {
      newFm.push([fd[0], fd[1]]);
    }
  };

  do {
    contin = false;
    newFm = [];
    fmc = helpers.closure(relSchema, fm);
    fm.forEach(handleFD);
    if (fm.equals(newFm) === false) {
      fm = newFm;
      contin = true;
    }
  } while (contin);
  return fm;
};

/**
 * Calculate the minimal cover of a relational schema and set of functional dependencies
 * @param  {Array[Attribute]} relSchema  Attributes that define the entire schema
 * @param  {Array[FunctionalDependency]} functDep  Given functional dependencies
 * @return {Array[Relations]} minimal cover
 */
var minimalCover = function(relSchema, functDep) {
  var i, j;
  var fm = elimRedundancy(relSchema, functDep),
    newFm = [],
    X = [],
    attrs = [];
  fm.forEach(function(fd) {
    if (!fd[0].equals(X)) {
      X = fd[0];
      attrs = [];
    }
    var redundant = false;
    for (i = 0; i < attrs.length; ++i) {
      for (j = 0; j < fm.length; ++j) {
        if (fm[j][0].indexOf(attrs[i]) > -1 && fm[j][1].indexOf(fd[1][0]) > -1) {
          redundant = true;
          break;
        }
      }
      if (redundant)
        break;
    }
    if (redundant === false && attrs.indexOf(fd[1][0]) === -1) {
      newFm.push([fd[0], fd[1]]);
      attrs.push(fd[1][0]);
    }
  });

  return newFm;
};

module.exports = minimalCover;
