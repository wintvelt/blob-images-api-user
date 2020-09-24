// tests for database functions - user related
import { dynamoDb } from 'blob-common/core/db';
import { now } from 'blob-common/core/date';
import {
    eventContext, testUserId, testUserId2, testUser, sleep
} from './context';
import { main as createUser } from '../handlersUser/createUser';
import { main as getUser } from '../handlersUser/getUser';
import { main as updateUser } from '../handlersUser/updateUser';

const TIMEOUT = 2000;
const today = now();
// INITIAL SETUP
// test('Create 2 users', async () => {
//     const request = {
//         userName: testUser.email,
//         userAttributes: {
//             sub: testUserId.slice(1),
//             name: testUser.name
//         }
//     };
//     const response = await createUser({ request });
//     expect(response.statusCode).toEqual(200);
//     const userBase = JSON.parse(response.body);
//     expect(userBase.createdAt).toBe(today);

//     const response2 = await createUser({
//         request: {
//             userName: 'wintvelt@me.com',
//             userAttributes: {
//                 sub: testUserId2.slice(1),
//                 name: 'Michiel gast'
//             }
//         }
//     });
//     expect(response2.statusCode).toEqual(200);
// });

test('Get user', async () => {
    await sleep(TIMEOUT);
    const event = eventContext({
        pathParameters: { id: testUserId }
    });
    const response = await getUser(event);
    const user = JSON.parse(response.body);
    expect(response.statusCode).toEqual(200);
    expect(user?.visitDateLast).toBe(today);
}, TIMEOUT + 5000);

describe('Change user', () => {
    test('Change username', async () => {
        const event = eventContext({ body: { name: 'Wim' } });
        const response = await updateUser(event);
        expect(response.statusCode).toEqual(200);
    });
    test.todo('Change user cover photo');
}, TIMEOUT + 5000);