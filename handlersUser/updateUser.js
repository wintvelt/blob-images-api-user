import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dbUpdateMulti } from "blob-common/core/db";
import { sanitize } from "blob-common/core/sanitize";

import { getPhotoById, getPhotoByUrl } from "../libs/dynamodb-lib-single";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const data = JSON.parse(event.body);
    let userUpdate = {};
    // name update only if given and not empty
    if (data.name) userUpdate.name = sanitize(data.name);
    // photoId update also if empty (to delete photo Id)
    if (data.hasOwnProperty('photoId')) {
        if (data.photoId) {
            const photoFound = await getPhotoById(data.photoId, userId);
            if (photoFound) {
                userUpdate.photoUrl = photoFound.url;
                userUpdate.photoId = data.photoId;
            };
        } else {
            // if empty, clear photo from userBase
            userUpdate.photoUrl = '';
            userUpdate.photoId = '';
        }
    } else if (data.filename) {
        const photoUrl = `protected/${event.requestContext.identity.cognitoIdentityId}/${data.filename}`;
        console.log(photoUrl);
        const photoFound = await getPhotoByUrl(photoUrl, userId);
        if (photoFound) {
            userUpdate.photoUrl = photoFound.url;
            userUpdate.photoId = photoFound.PK.slice(2);
        };
    };
    const hasUpdates = (Object.keys(userUpdate).length > 0);
    if (hasUpdates) await dbUpdateMulti('UBbase', userId, userUpdate);

    return { status: true };
});