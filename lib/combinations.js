var _ = require('lodash');

var combinations = function(set, k) {
  if(!_.isArray(set)){
    throw new TypeError('set must be an array', "combinations.js", 3);
  }
  if(k && (!_.isFinite(k) || Math.floor(k) !== k)){
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

module.exports = combinations;
