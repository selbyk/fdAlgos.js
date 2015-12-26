/**
 * BCNF Algorithm
 */
var _ = require('lodash');
require('../lib/util');
var helpers = require('../lib/helpers');

var bcnf = function(selectKeys, functDep) {
  var fds = helpers.combineLHS(functDep);
  var result = selectKeys;
  var i;
  var fPlus = helpers.closure(selectKeys, fds);
  //console.log(fPlus);
  var tmp_fds = [];
  for (i = 0; i < fds.length; ++i) {
    if (!fds[i][1].is_subset_of(fds[i][0])) {
      //console.log(fds[i], ' is not trivial lol');
      if (!fPlus.includes_fd([fds[i][0], result])) {
        //console.log([fds[i][0], result], ' isnt in ');
        tmp_fds.push(_.flatten(fds[i]));
        result = _.difference(result, fds[i][1]);
      }
    }
  }
  tmp_fds.push(result);
  return tmp_fds;
};

module.exports = bcnf;
