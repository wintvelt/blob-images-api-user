import { dynamoDb, dbUpdateMulti } from 'blob-common/core/db';
import { now } from 'blob-common/core/date';

export const getLoginUser = async (userId, cognitoId) => {
    const Key = {
        PK: 'USER',
        SK: userId,
    };

    const result = await dynamoDb.get({
        TableName: process.env.photoTable,
        Key
    });
    const oldUser = result.Item;
    if (!oldUser) {
        throw new Error("User not found.");
    }
    const today = now();
    const newVisitDatePrev = oldUser.visitDateLast || today;
    const isNewVisit = (!oldUser.visitDateLast || today > oldUser.visitDateLast);
    const hasNoCognitoId = !oldUser.cognitoId;
    const visitDateUpdate = (isNewVisit) ?
        { visitDateLast: today, visitDatePrev: newVisitDatePrev }
        : {};
    const visitUpdate = (hasNoCognitoId) ? { ...visitDateUpdate, cognitoId } : visitDateUpdate;
    if (isNewVisit || hasNoCognitoId) await dbUpdateMulti('UVvisit', Key.SK, visitUpdate);
    return {
        ...oldUser,
        ...visitUpdate
    };
};