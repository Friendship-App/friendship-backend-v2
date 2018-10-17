const aws = require('aws-sdk');

const S3_BUCKET = 'friendshipapp';

// || 'AKIAIW5ZRWMIBSEETM3Q'
// || '/apu3+B9lRfhZn1razcXZnBpDjHkbQd1W6gOgqLw'

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

aws.config.update({ credentials, region: 'eu-west-2' });

const s3 = new aws.S3();

export const getSignedUrl = async (request, reply) => {
  const fileName = request.query['file-name'];
  const fileType = request.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  };

  const url = await s3.getSignedUrl('putObject', s3Params);

  return reply.response(
    JSON.stringify({
      signedRequest: url,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    }),
  );
};
