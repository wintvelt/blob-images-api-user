import { dynamoDb } from 'blob-common/core/db';

export const listGroupAlbums = async (groupId, groupRole) => {
    const params = {
        KeyConditionExpression: "#g = :g",
        ExpressionAttributeNames: {
            '#g': 'PK',
        },
        ExpressionAttributeValues: {
            ":g": 'GA' + groupId,
        },
    };

    const result = await dynamoDb.query(params);
    const items = result.Items;
    if (!items) {
        throw new Error("albums retrieval failed.");
    };
    const albums = items.map(item => ({
        PK: item.PK,
        SK: item.SK,
        id: item.SK,
        name: item.name,
        image: item.image,
        userIsAdmin: (groupRole === 'admin'),
        date: item.createdAt,
    }));
    return albums;
};