const aws = require('aws-sdk');

const S3_BUCKET = 'friendshipapp';

// || 'AKIAJL3ZMYV4REG3ZFGA
// || 'ZSJAYML0cIMVlHwGr1+MV8nRDlQy3xFWDOjWc0CY'

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
