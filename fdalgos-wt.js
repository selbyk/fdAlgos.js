/**
 * Webtask Base
 *
 */
var _ = require('lodash');
var helpers = require('./lib/helpers');
var bernstein = require('./lib/bernstein');
var bcnf = require('./lib/bcnf');

module.exports = function(context, cb) {
  if (_.isArray(context.data.attrs) && _.isArray(context.data.fds)) {
    cb(null, {
      specialKeys: helpers.computeCandidateKeys(context.data.attrs, context.data.fds, true),
      "3nf": bernstein(context.data.attrs, context.data.fds),
      bcnf: bcnf(context.data.attrs, context.data.fds)
    });
  } else {
    cb(null, "no attributes or functional dependencies in " + JSON.stringify(context.data));
  }
};
