const stubs = require('./aws-stubs');
const AWS = {};

AWS.config = {
  setPromisesDependency: (arg) => { }
};

AWS.S3 = function () {

}

AWS.S3.prototype = {
  ...AWS.S3.prototype,

  // Stub for the listObjectsV2 method in the sdk
  listObjectsV2(params) {
    const stubPromise = new Promise((resolve, reject) => {
      resolve(stubs.listObjects);
    });

    return {
      promise: () => {
        return stubPromise;
      }
    }
  },
  getObject(params) {
    return {
      promise: () => {
        return {
          Body: new Buffer('testString')
        };
      }
    }
  },
  upload(params) {
    return {
      promise: () => {
        return {
          Location: 'testLocation'
        };
      }
    }
  },
  deleteObject(params) {
    return {
      promise: () => {
        if (params.Key === 'error') {
          throw 'error';
        }
        return {}
      }
    }
  }
};

module.exports = AWS; 