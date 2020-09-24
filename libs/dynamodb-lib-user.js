import { dynamoDb, dbUpdateMulti } from 'blob-common/core/db';
import { now } from 'blob-common/core/date';
import { dbCreateItem } from 'blob-common/core/dbCreate';

export const getLoginUser = async (userId, cognitoId) => {
    const Key = {
        PK: 'USER',
        SK: userId,
    };

    const result = await dynamoDb.get({
        Key
    });
    const oldUser = result.Item;
    if (!oldUser) {
        throw new Error("User not found.");
    }
    const today = now();
    const isFirstVisit = !oldUser.visitDateLast;
    const isNewVisit = (!oldUser.visitDateLast || today > oldUser.visitDateLast);
    const hasNoCognitoId = !oldUser.cognitoId;

    const newVisitDatePrev = oldUser.visitDateLast || today;
    const visitDateUpdate = (isNewVisit) ?
        { visitDateLast: today, visitDatePrev: newVisitDatePrev }
        : {};
    const visitUpdate = (hasNoCognitoId) ? { ...visitDateUpdate, cognitoId } : visitDateUpdate;
    if (isFirstVisit) {
        await dbCreateItem({
            PK: 'UVvisit', SK: Key.SK,
            ...visitUpdate
        });
    } else if (isNewVisit || hasNoCognitoId) {
        await dbUpdateMulti('UVvisit', Key.SK, visitUpdate);
    }
    return {
        ...oldUser,
        ...visitUpdate
    };
};