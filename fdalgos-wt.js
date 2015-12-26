var _ = require('lodash');
var combinations = require('lib/combinations');

module.exports = function(context, cb) {
  if (_.isArray(context.data.attrs)) {
    cb(null, {
      combinations: combinations(context.data.attrs)
    });
  } else {
    cb(null, "no attributes in " + JSON.stringify(context.data));
  }
};
