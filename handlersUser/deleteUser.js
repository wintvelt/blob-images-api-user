import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    await dynamoDb.delete({
        Key: {
            PK: 'USER',
            SK: userId
        }
    });
    return { status: 'user deleted forever' };
});
