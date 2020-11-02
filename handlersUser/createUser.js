// called by AWS cognito post confirmation trigger
import { sanitize } from 'blob-common/core/sanitize';
import { dbCreateItem } from "blob-common/core/dbCreate";

const NUMPICS = 22;
const randomKnor = () => {
    return `public/img/knorren/knor${Math.round(Math.random() * NUMPICS)}.jpg`;
};


export const main = async (event, context, callback) => {
    const { request } = event;

    const { userAttributes } = request;
    const userSub = userAttributes?.sub;

    if (userSub) {
        const name = userAttributes['custom:name'];
        const email = userAttributes.email;

        const UBItem = {
            PK: 'UBbase',
            SK: 'U' + userSub,
            name: sanitize(name),
            email: email.toLowerCase(),
            photoUrl: randomKnor()
        };
        const UPItem = {
            PK: 'UPstats',
            SK: 'U' + userSub,
            photoCount: 0
        };

        await Promise.all([
            dbCreateItem(UBItem),
            dbCreateItem(UPItem),
        ]);
    }
    // return the event to cognito
    callback(null, event);
};