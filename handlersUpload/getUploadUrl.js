import { handler } from "blob-common/core/handler";
import AWS from "aws-sdk";

var S3 = new AWS.S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.aws_key_id,
    secretAccessKey: process.env.aws_secret_key,
    params: {
        Bucket: process.env.photoBucket || process.env.devBucket || 'blob-images-dev'
    },
    signatureVersion: 'v4'
});

const Bucket = process.env.bucket || process.env.devBucket || 'blob-images-dev';

export const main = handler(async (event, context) => {
    const cognitoId = event.requestContext.identity.cognitoIdentityId;
    const data = JSON.parse(event.body);
    console.log(event);
    const filename = data?.filename;
    if (!filename) throw new Error('no filename provided');

    // check filecount
    
    // get metadata
    const headers = data?.headers;
    
    // get signed url
    const Prefix = `protected/${cognitoId}/`;
    const Key =  Prefix + filename;
    const signedUrl = await S3.getSignedUrl('putObject', {
        Bucket,
        Key,
        Metadata: headers,
    });
    return signedUrl;
});