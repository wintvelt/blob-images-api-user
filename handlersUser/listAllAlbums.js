import { handler, getUserFromEvent } from "blob-common/core/handler";

import { getMemberships } from "../libs/dynamodb-lib-memberships";
import { listGroupAlbums } from "../libs/dynamodb-query-lib";
import { getMemberRole } from "../libs/dynamodb-lib-single";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const groups = await getMemberships(userId);
    const listLength = groups.length;
    let groupAlbums = [];
    for (let i = 0; i < listLength; i++) {
        const group = groups[i];
        const groupId = group.SK;
        const groupName = group.group.name;
        const groupRole = await getMemberRole(userId, groupId);
        if (groupRole) {
            const albums = await listGroupAlbums(groupId, groupRole);
            const albumsWithGroupName = albums.map(album => ({ ...album, groupName }));
            groupAlbums = [...groupAlbums, ...albumsWithGroupName];
        }
    }
    return groupAlbums;
});