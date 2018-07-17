import aws from 'aws-sdk';

const S3_BUCKET = 'friendshipapp';
aws.config.region = 'eu-west-2';

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

  const url = await getSignedUrlPromise('putObject', s3Params).catch(err =>
    console.log(err),
  );

  return reply.response(
    JSON.stringify({
      signedRequest: url,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    }),
  );
};

const s3 = new aws.S3();

const getSignedUrlPromise = (operation, params) =>
  new Promise((resolve, reject) => {
    s3.getSignedUrl(operation, params, (err, url) => {
      err ? reject(err) : resolve(url);
    });
  });
