import { dynamoDb } from 'blob-common/core/db';
import { now, expireDate } from 'blob-common/core/date';
import { getUser } from './dynamodb-lib-user';

export const getInvites = async (userId) => {
    const userPromise = getUser(userId);
    const params = {
        KeyConditionExpression: "#u = :member",
        ExpressionAttributeNames: {
            '#u': 'PK',
        },
        ExpressionAttributeValues: {
            ":member": 'UM' + userId,
        },
    };

    const userInvitesPromise = dynamoDb.query(params);
    const [user, userInvites] = await Promise.all([userPromise, userInvitesPromise]);
    const userEmailInvites = await dynamoDb.query({
        ...params,
        ExpressionAttributeValues: {
            ":member": 'UM' + user.email,
        },
    });

    const userInviteItems = userInvites.Items || [];
    const userEmailInviteItems = userEmailInvites.Items || [];
    const items = [...userInviteItems, ...userEmailInviteItems];

    const today = now();
    return items.filter(item => item.status === 'invite' && expireDate(item.createdAt) >= today);
};

export const getMemberships = async (userId) => {
    const params = {
        KeyConditionExpression: "#u = :member",
        ExpressionAttributeNames: {
            '#u': 'PK',
        },
        ExpressionAttributeValues: {
            ":member": 'UM' + userId,
        },
    };

    const result = await dynamoDb.query(params);
    const items = result.Items || [];

    const today = now();
    return items.filter(item => item.status !== 'invite' || expireDate(item.createdAt) >= today);
};