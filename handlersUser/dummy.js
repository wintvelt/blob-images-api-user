import { handler } from 'blob-common/core/handler';

export const main = handler(async (event, context) => {
    console.log(JSON.stringify(event, null, 2));
    return 'ok';
});