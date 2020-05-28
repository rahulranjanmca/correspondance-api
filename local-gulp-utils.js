const _ = require('lodash');

const _isStringEmpty = str => {
  if (_.isString(str)) {
    return _.isEmpty(_.trim(str));
  }
  return true;
};

function mutatePath({ path, allJSFiles = false, allFiles = false, negate = false } = {}) {
  let returnedPath = path;
  if (_isStringEmpty(path)) {
    throw new Error('Cannot mutate empty path');
  }
  if (allJSFiles && allFiles) {
    throw new Error('allJSFiles and allFiles options are mutually exclusive');
  }
  if (allJSFiles) {
    returnedPath = `${returnedPath}/**/*.js`;
  }
  if (allFiles) {
    returnedPath = `${returnedPath}/**/*`;
  }
  if (negate) {
    returnedPath = `!${returnedPath}`;
  }
  return returnedPath;
}

module.exports = { mutatePath };
