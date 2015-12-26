/**
 * Bernstein's Algorithm
 *
 */
require('../lib/util');
var helpers = require('../lib/helpers');

var decomposeFds = function(functDep) {
  var relations = [];
  functDep.forEach(function(fd) {
    relations.push(fd[0].concat(fd[1]));
  });
  return relations;
};

var removeRedundantRelations = function(relations) {
  var newRelations = [],
    i;
  relations.forEach(function(relation) {
    var isRedundant = false;
    for (i = 0; i < newRelations.length; ++i) {
      if (newRelations[i].subset(relation)) {
        //console.log(relation, ' subset? ', newRelations[i])
        isRedundant = true;
        break;
      }
    }
    if (isRedundant === false)
      newRelations.push(relation);
  });
  return newRelations;
};

var bernstein = function(selectKeys, functDep) {
  var i, j;
  var cks = helpers.computeCandidateKeys(selectKeys, functDep);
  var fds = helpers.combineLHS(functDep);
  var relations = decomposeFds(fds);
  var no_cks = true;
  relations = removeRedundantRelations(relations);
  for (i = 0; i < relations.length; ++i) {
    for (j = 0; j < cks.length; ++j)
      if (cks[j].equals(relations[i])) {
        no_cks = false;
        break;
      }
    if (no_cks === false)
      break;
  }
  if (no_cks)
    relations.push(cks.shift());
  return relations;
};

module.exports = bernstein;
