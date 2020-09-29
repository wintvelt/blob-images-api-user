import { eventContext } from "./context";
import { main as deleteUser } from '../handlersUser/deleteUser';

test('delete a user', async () => {
    const event = eventContext();
    const response = await deleteUser(event);
    expect(response.statusCode).toEqual(200);
});