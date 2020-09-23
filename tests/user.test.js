// tests for database functions - user related
import { dynamoDb } from 'blob-common/core/db';
import { now } from 'blob-common/core/date';
import {
    eventContext, testUserId, testGroupId, testUser,
    sleep, setUp, cleanUp, testPhotoId, testAlbumId
} from './context';
import { main as createUser } from '../handlersUser/createUser';
import { main as getUser } from '../handlersUser/getUser';
import { main as updateUser } from '../handlersUser/updateUser';
import { getUserByEmail } from '../libs/dynamodb-lib-user';

const TIMEOUT = 2000;
const today = now();

const recordList = [
    {
        PK: 'UBbase',
        SK: testUserId,
        ...testUser
    },
    {
        PK: 'GBbase',
        SK: testGroupId,
        name: 'test group',
        photoId: testPhotoId
    },
    {
        PK: 'UM' + testUserId,
        SK: testGroupId,
    },
    {
        PK: 'PO' + testPhotoId,
        SK: testUserId,
        user: testUser,
        url: 'dummy'
    },
    {
        PK: 'GA' + testGroupId,
        SK: testAlbumId,
        name: 'test album',
        photoId: testPhotoId
    },
    {
        PK: `GP${testGroupId}#${testAlbumId}`,
        SK: testPhotoId,
    }
];

// beforeAll(async () => {
//     await setUp(recordList);
//     await sleep(2000);
// }, TIMEOUT);

// afterAll(async () => {
//     await sleep(2000);
//     await cleanUp([
//         ...recordList,
//         { PK: 'UBbase', SK: 'U' + testUser2 },
//         { PK: 'USER', SK: 'U' + testUser2 },
//         { PK: 'USER', SK: testUserId },
//         { PK: 'UVvisit', SK: testUserId },
//     ]);
// }, 8000);

test('Create user', async () => {
    const request = {
        userName: testUser.email,
        userAttributes: {
            sub: testUserId.slice(1),
            name: testUser.name
        }
    };
    const response = await createUser({ request });
    console.log({response});
    expect(response.statusCode).toEqual(200);
});
// test('Get user', async () => {
//     const event = eventContext({
//         pathParameters: { id: testUserId }
//     });
//     const response = await getUser(event);
//     console.log(response);
//     expect(response.statusCode).toEqual(200);
//     expect(user?.visitDateLast).toBe(today);
// });

// describe('Change user', () => {
//     test('Change username', async () => {
//         const event = eventContext({ body: { name: 'Wim', photoId: testPhotoId } });
//         const response = await updateUser(event);
//         expect(response.statusCode).toEqual(200);
//         await sleep(TIMEOUT);
//     }, TIMEOUT + 2000);
//     it('membership also updated', async () => {
//         const response = await dynamoDb.get({
//             Key: {
//                 PK: 'UM' + testUserId,
//                 SK: testGroupId
//             }
//         });
//         const membership = response.Item;
//         expect(membership?.user?.name).toEqual('Wim');
//     }, 2000);
//     it('photo also updated', async () => {
//         const response = await dynamoDb.get({
//             Key: {
//                 PK: 'PO' + testPhotoId,
//                 SK: testUserId
//             }
//         });
//         const photo = response.Item;
//         expect(photo?.user?.name).toEqual('Wim');
//     });
//     it('photo publication (group photo) also updated', async () => {
//         const response = await dynamoDb.get({
//             Key: {
//                 PK: `GP${testGroupId}#${testAlbumId}`,
//                 SK: testPhotoId
//             }
//         });
//         const publication = response.Item;
//         expect(publication?.photo?.user?.name).toEqual('Wim');
//     });
//     it('album cover also updated', async () => {
//         const response = await dynamoDb.get({
//             Key: {
//                 PK: `GA${testGroupId}`,
//                 SK: testAlbumId
//             }
//         });
//         const album = response.Item;
//         expect(album?.photo?.user?.name).toEqual('Wim');
//     });
//     it('group cover also updated', async () => {
//         const response = await dynamoDb.get({
//             Key: {
//                 PK: 'GBbase',
//                 SK: testGroupId
//             }
//         });
//         const group = response.Item;
//         expect(group?.photo?.user?.name).toEqual('Wim');
//     });
// }, TIMEOUT + 5000);