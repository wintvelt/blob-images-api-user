import { dynamoDb } from 'blob-common/core/db';
import { listPhotoPublications } from './dynamodb-lib-photo';
import { getMemberships } from './dynamodb-lib-memberships';

const getMember = async (userId, groupId) => {
    const memberParams = {
        TableName: process.env.photoTable,
        Key: {
            PK: 'UM' + userId,
            SK: groupId
        },
    };
    const result = await dynamoDb.get(memberParams);
    return (result.Item);
};
export const getMemberRole = async (userId, groupId) => {
    const membership = await getMember(userId, groupId);
    return membership && (membership.status !== 'invite') && membership.role;
};
const getPhotoByUser = async (photoId, userId) => {
    const params = {
        TableName: process.env.photoTable,
        Key: {
            PK: 'PO' + photoId,
            SK: userId,
        }
    };

    const result = await dynamoDb.get(params);
    if (!result.Item) {
        throw new Error("Photo not found.");
    }

    // Return the retrieved item
    return result.Item;
};

const getGroupId = (key) => key.split('#')[0].slice(2);

export const getPhotoById = async (photoId, userId) => {
    // returns photo if user has any access
    try {
        const photo = await getPhotoByUser(photoId, userId);
        return photo;
    } catch (_) {
        // get all publications and return if user is member of any
        const publications = await listPhotoPublications(photoId);
        const memberships = await getMemberships(userId);
        const groupsWithUser = memberships.map(mem => mem.SK);
        const pubsWithMembership = publications.filter(pub => groupsWithUser.includes(getGroupId(pub.PK)));
        if (pubsWithMembership.length === 0) return undefined;
        return pubsWithMembership[0].photo;
    }
};