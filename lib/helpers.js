var _ = require('lodash');
require('../lib/util');

/**
 * 	Generate combinations of a set of elements
 * @param  {Array} set elements to get combinations of
 * @param  {Integer} k (optional) number of elements in combinations, power set if not given
 * @return {Array[Array]} combinations
 */
var combinations = function(set, k) {
  if (!_.isArray(set)) {
    throw new TypeError('set must be an array', "combinations.js", 3);
  }
  if (k && (!_.isFinite(k) || Math.floor(k) !== k)) {
    throw new TypeError('k must be an integer', "combinations.js", 3);
  }
  var i, combs;
  if (k === undefined) {
    var k_combs;
    combs = [];
    // Calculate all non-empty k-combinations
    for (k = 1; k <= set.length; k++) {
      k_combs = combinations(set, k);
      for (i = 0; i < k_combs.length; i++) {
        combs.push(k_combs[i]);
      }
    }
    return combs;
  } else if (_.isArray(set)) {
    var j, head, tailcombs;
    if (k > set.length || k <= 0) {
      return [];
    }
    if (k === set.length) {
      return [set];
    }
    if (k === 1) {
      combs = [];
      for (i = 0; i < set.length; i++) {
        combs.push([set[i]]);
      }
      return combs;
    }
    // Assert {1 < k < set.length}
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
      head = set.slice(i, i + 1);
      tailcombs = combinations(set.slice(i + 1), k - 1);
      for (j = 0; j < tailcombs.length; j++) {
        combs.push(head.concat(tailcombs[j]));
      }
    }
  }
  return combs;
};

/**
 * Calculate the closure of a relational schema
 * @param  {Array[Attribute]} relSchema  Attributes that define the entire schema
 * @param  {Array[FunctionalDependency]} functDep  Given functional dependencies
 * @param  {Array[Attribute]} selectKeys (optional) only calculate/return these
 * @return {Array[FunctionalDependency]} all dependencies that could possibly be met
 */
var closure = function(relSchema, functDep, selectKeys) {
  if (selectKeys === undefined) {
    var leftHandSides = combinations(relSchema);
    var clos = [];
    leftHandSides.forEach(function(lhs) {
      var closureOfX = [lhs, closure(relSchema, functDep, lhs)];
      clos.push(closureOfX);
    });
    return clos;
  } else {
    var result = [].concat(selectKeys);
    var fds = [].concat(functDep);
    var found;
    var exists = function exists(attr) {
      //console.log(result.indexOf(attr));
      if (result.indexOf(attr) === -1)
        result.push(attr);
    };
    do {
      found = false;
      for (var j = 0; j < fds.length; j++) {
        var fd = fds[j];
        var Y = fd[0];
        var Z = fd[1];
        var count = 0;
        for (var i = 0; i < Y.length; i++) {
          if (result.indexOf(Y[i]) > -1)
            count++;
          else
            break;
        }
        if (count === Y.length) {
          found = true;
          Z.forEach(exists);
          fds.splice(j--, 1);
          break;
        }
      }
    } while (found === true);
    return result.sort();
  }
};

/**
 * Identify whether attribute combinations are necessary, middle ground, or useless as keys
 * @param  {Array[Attribute]} relSchema  Attributes that define the entire schema
 * @param  {Array[FunctionalDependency]} functDep  Given functional dependencies
 * @return {Object[KeyType][Key]} keys grouped by identification
 */
var identifyKeys = function(relSchema, functDep) {
  var necessaryKeys = [];
  var uselessKeys = [];
  var middleGroundKeys = [];
  relSchema.forEach(function(key) {
    var inLHS = false,
      inRHS = false;
    functDep.forEach(function(fd) {
      if (inLHS === false && fd[0].indexOf(key) !== -1) {
        inLHS = true;
      }
      if (inRHS === false && fd[1].indexOf(key) !== -1) {
        inRHS = true;
      }
    });
    if (inLHS && !inRHS || !inLHS && !inRHS) {
      necessaryKeys.push(key);
    } else if  (!inLHS && inRHS) {
      uselessKeys.push(key);
    } else {
      middleGroundKeys.push(key);
    }
  });
  return {
    necessary: necessaryKeys,
    useless: uselessKeys,
    middleGround: middleGroundKeys
  };
};

/**
 * Compute candidate keys
 * @param  {Array[Attribute]} relSchema  Attributes that define the entire schema
 * @param  {Array[FunctionalDependency]} functDep  Given functional dependencies
 * @return {Array[Key]} Candidate keys grouped by identification
 */
var computeCandidateKeys = function(relSchema, functDep, returnAllSpecial) {
  //console.log(relSchema, functDep);
  var candidateKeys = [];
  var identifiedKeys = identifyKeys(relSchema, functDep);
  var possibleKeys = [];
  combinations(identifiedKeys.middleGround).forEach(function(relSchema) {
    possibleKeys.push(relSchema.concat(identifiedKeys.necessary));
  });
  var tmp = [];
  var handleKey = function(ck) {
    if (ck.subset(possibleKey) === false)
      tmp.push(ck);
  };
  while (possibleKeys.length > 0) {
    var possibleKey = possibleKeys.shift();
    var possibleKeyClosure = closure(relSchema, functDep, possibleKey);
    tmp = [];
    //console.log(closure(possibleKey, functDep));
    if (possibleKeyClosure.equals(relSchema)) {
      possibleKeys.forEach(handleKey);
      candidateKeys.push(possibleKey);
      possibleKeys = tmp;
    }
  }
  if(returnAllSpecial){
    identifiedKeys.candidate = candidateKeys;
    return identifiedKeys;
  } else {
    return candidateKeys;
  }
};

/**
 * Breaks functional dependencies down into only 1 attribute per right hand side
 * @param  {Array[FunctionalDependency]} functDep  Given functional dependencies
 * @return {Array[FunctionalDependency]} Broken down functional dependencies
 */
var breakRHS = function(functDep) {
  var newFds = [];
  //console.log(functDep);
  functDep.forEach(function(fd) {
    //console.log(fd, fd[1]);
    fd[1].forEach(function(attr) {
      newFds.push([fd[0],
        [attr]
      ]);
    });
  });
  return newFds;
};

/**
 * Combine equivelant left sides
 * @param  {Array[FunctionalDependency]} functDep  Given functional dependencies
 * @return {Array[FunctionalDependency]} Functional dependencies with LHS combinations
 */
var combineLHS = function(functDep) {
  var newFds = [];
  var i;
  var newFdKey, newFdAttrs;
  functDep.forEach(function(fd) {
    var alreadyExists = false;
    for (i = 0; i < newFds.length; ++i) {
      if (newFds[i][0].equals(fd[0])) {
        alreadyExists = true;
        break;
      }
    }
    if (alreadyExists === false) {
      newFdKey = fd[0];
      newFdAttrs = [];
      functDep.forEach(function(deeper_fd) {
        if (newFdKey.equals(deeper_fd[0])) {
          newFdAttrs = newFdAttrs.concat(deeper_fd[1]);
        }
      });
      newFds.push([newFdKey, newFdAttrs]);
    }
  });
  return newFds;
};

var helpers = {
  combinations: combinations,
  closure: closure,
  identifyKeys: identifyKeys,
  computeCandidateKeys: computeCandidateKeys,
  breakRHS: breakRHS,
  combineLHS: combineLHS
};

module.exports = helpers;
