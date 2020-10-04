// called by AWS cognito post confirmation trigger
import { sanitize } from 'blob-common/core/sanitize';
import { dbCreateItem } from "blob-common/core/dbCreate";

export const main = async (event, context, callback) => {
    const { request } = event;

    const { userAttributes } = request;
    const userSub = userAttributes?.sub;

    if (userSub) {
        const name = userAttributes['custom:name'];
        const email = userAttributes.email;

        const Item = {
            PK: 'UBbase',
            SK: 'U' + userSub,
            name: sanitize(name),
            email: email.toLowerCase(),
        };

        await dbCreateItem(Item);
    }
    // return the event to cognito
    callback(null, event);
};