import { handler, getUserFromEvent } from "blob-common/core/handler";
import { disableUser } from "blob-common/core/cognito";
import { dynamoDb } from "blob-common/core/db";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    await dynamoDb.delete({
        Key: {
            PK: 'USER',
            SK: userId
        }
    });
    await disableUser(userId);
    return { status: 'user deleted forever' };
});
