// called by AWS cognito post confirmation trigger
// NB: this happens at signup, but also after forgotpassword flow
import { sanitize } from 'blob-common/core/sanitize';
import { dbCreateItem } from "blob-common/core/dbCreate";
import { dynamoDb } from 'blob-common/core/db';

const NUMPICS = 22;
const randomKnor = () => {
    return `public/img/knorren/knor${Math.round(Math.random() * NUMPICS)}.jpg`;
};


export const main = async (event, context, callback) => {
    const { request } = event;

    const { userAttributes } = request;
    const userSub = userAttributes?.sub;

    if (userSub) {
        // check if user already exists
        const UBkey = {
            PK: 'UBbase',
            SK: 'U' + userSub,
        };
        const userResult = await dynamoDb.get({ Key: UBkey });
        const existingUser = userResult.Item;

        // only create user if there was none
        if (!existingUser) {
            const name = userAttributes['custom:name'];
            const email = userAttributes.email;
            const inviteId = userAttributes['custom:inviteId'];

            const UBItem = {
                ...UBkey,
                name: sanitize(name),
                email: email.toLowerCase(),
                photoUrl: randomKnor()
            };
            const UPItem = {
                PK: 'UPstats',
                SK: 'U' + userSub,
                photoCount: 0,
                inviteId
            };

            await Promise.all([
                dbCreateItem(UBItem),
                dbCreateItem(UPItem),
            ]);
        }
    }
    // return the event to cognito
    callback(null, event);
};