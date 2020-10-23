import { handler } from "blob-common/core/handler";
import { s3 } from "blob-common/core/s3";

const Bucket = process.env.bucket || process.env.devBucket || 'blob-images-dev';

export const main = handler(async (event, context) => {
    const cognitoId = event.requestContext.identity.cognitoIdentityId;
    const data = JSON.parse(event.body);
    const filename = data?.filename;
    if (!filename) throw new Error('no filename provided');

    // check filecount

    // get signed url
    const Key = `protected/${cognitoId}/$filename`;
    const signedUrl = await s3.getSignedUrl({
        Bucket,
        Key,
        Expires: 60
    });
    return signedUrl;
});