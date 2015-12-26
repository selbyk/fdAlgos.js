/**
 * Minimal Cover
 *
 */
require('../lib/util.js');
var helpers = require('../lib/helpers');

//
/*
From course:
Eliminate redundancy in the left hand side.The fd CD→A is replaced by C
→A. This is because C→D ∈ (F′)+, hence C→CD ∈ (F′)+; from C→CD ∈(F′)+ and CD→A ∈ F′,
by transitivity, we have C→A∈(F′)+ and hence CD→A should be replaced by C→A. Similarly,
CD→B is replaced by C→B, AE→C is replaced by A→C. F′= {C→A, C→B, C→D, D→E, D→H, A→C, B→D}
after step (2).
*/
var elimRedundancy = function(selectKeys, functDep) {
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
    fmc = helpers.closure(selectKeys, fm);
    fm.forEach(handleFD);
    if (fm.equals(newFm) === false) {
      fm = newFm;
      contin = true;
    }
  } while (contin);
  return fm;
};

var minimalCover = function(selectKeys, functDep) {
  var i, j;
  // F′= {C→A, C→B, C→D, D→E, D→H, A→C, B→D}
  // CSC 4402 Notes
  // The fd C→D is eliminated because it can be derived from C→B and B→D and hence it is
  // redundant. The F′now becomes {C→A, C→B, D→E, D→H, A→C, B→D}, which is the only
  // minimal cover of F.♣
  //console.log(selectKeys, functDep);
  var fm = elimRedundancy(selectKeys, functDep),
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
