'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getSignedUrl = undefined;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value);
            },
            function(err) {
              step('throw', err);
            },
          );
        }
      }
      return step('next');
    });
  };
}

const S3_BUCKET = 'friendshipapp';
_awsSdk2.default.config.region = 'eu-west-2';

const getSignedUrl = (exports.getSignedUrl = (() => {
  var _ref = _asyncToGenerator(function*(request, reply) {
    const fileName = request.query['file-name'];
    const fileType = request.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read',
    };

    const url = yield getSignedUrlPromise('putObject', s3Params).catch(function(
      err,
    ) {
      return console.log(err);
    });

    return reply.response(
      JSON.stringify({
        signedRequest: url,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
      }),
    );
  });

  return function getSignedUrl(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

const s3 = new _awsSdk2.default.S3();

const getSignedUrlPromise = (operation, params) =>
  new Promise((resolve, reject) => {
    s3.getSignedUrl(operation, params, (err, url) => {
      err ? reject(err) : resolve(url);
    });
  });
//# sourceMappingURL=aws.js.map
